"use client";

import React, { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader, ThreeEvent } from "@react-three/fiber";
import {
    OrbitControls,
    useGLTF,
    PerspectiveCamera,
    Environment,
    ContactShadows,
    Html,
    useProgress
} from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, RotateCcw, ChevronUp, ChevronDown, Maximize, MousePointer2, Copy, Check, ChevronLeft, ChevronRight, AlertCircle, X } from "lucide-react";

import {
    ROOM_CONFIGS,
    wallSeries,
    floorSeries,
    ceilingSeries,
    type RoomConfig,
    type ProductVariant,
    type ProductSeries,
    type RoomProps
} from "@/data/visualizer-data";

// --- LOADING COMPONENT ---
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-black/80 p-8 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-2xl min-w-[200px]">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-white font-black tracking-[0.3em] uppercase text-[10px]">{Math.round(progress)}% Visualizing</p>
            </div>
        </Html>
    );
}

// --- 3D ROOM COMPONENT (FIXED & SCALABLE) ---
function Room({ appliedTextures, appliedTiling, selectedMesh, setSelectedMesh, activeRoom }: RoomProps) {
    // 1. Load active room model dynamically
    const { scene } = useGLTF(activeRoom.modelUrl) as any; 

    const isValidMesh = (meshName: string) => {
        const lowerName = meshName.toLowerCase();
        return activeRoom.meshMapping.walls.meshes.some(m => m.toLowerCase() === lowerName) ||
               activeRoom.meshMapping.floors.meshes.some(m => m.toLowerCase() === lowerName) ||
               activeRoom.meshMapping.ceilings.meshes.some(m => m.toLowerCase() === lowerName);
    }; 
    
    // 2. Texture cache to avoid reloading same image again and again
    const textureCache = useRef<Record<string, THREE.Texture>>({});

    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                const appliedUrl = appliedTextures[name];
                const isSelected = selectedMesh?.toLowerCase() === name;

                // BUG FIX 1: Har deewar ko apna ek alag material diya (Cloning)
                if (!child.userData.materialCloned) {
                    if (child.material) {
                        child.material = child.material.clone();
                    } else {
                        child.material = new THREE.MeshStandardMaterial({ roughness: 0.6 });
                    }
                    child.userData.materialCloned = true;
                }

                const material = child.material as THREE.MeshStandardMaterial;

                // Enforce absolute matte properties to remove tile-like reflections
                const isFloor = activeRoom.meshMapping.floors.meshes.some(f => f.toLowerCase() === name);
                if (isFloor) {
                    material.roughness = 1.0;  // 100% Matte finish
                    material.metalness = 0.0;  // Non-metallic
                    
                    // Disable all pre-baked maps and physical glossy properties
                    if ('roughnessMap' in material) material.roughnessMap = null;
                    if ('metalnessMap' in material) material.metalnessMap = null;
                    if ('clearcoat' in material) (material as any).clearcoat = 0.0;
                    if ('clearcoatRoughness' in material) (material as any).clearcoatRoughness = 1.0;
                    if ('reflectivity' in material) (material as any).reflectivity = 0.0;
                } else {
                    material.roughness = 0.85; // Clean matte/satin finish for walls/ceilings
                    material.metalness = 0.0;
                }

                // BUG FIX 2: Bina room ko gayab kiye texture load karna (No Suspense flash)
                if (appliedUrl) {
                    // DYNAMIC TILING LOGIC based on configuration mesh mapping details:
                    let tiling = { x: 80, y: 1 }; // Default fallback
                    
                    if (activeRoom.meshMapping.floors.meshes.some(f => f.toLowerCase() === name)) {
                        tiling = activeRoom.meshMapping.floors.tiling;
                    } else if (activeRoom.meshMapping.ceilings.meshes.some(c => c.toLowerCase() === name)) {
                        tiling = activeRoom.meshMapping.ceilings.tiling;
                    } else if (activeRoom.meshMapping.walls.meshes.some(w => w.toLowerCase() === name)) {
                        tiling = activeRoom.meshMapping.walls.tiling;
                    }

                    if (textureCache.current[appliedUrl]) {
                        // Agar pehle se downloaded hai toh turant laga do
                        const tex = textureCache.current[appliedUrl].clone();
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.wrapT = THREE.RepeatWrapping;
                        tex.repeat.set(tiling.x, tiling.y);
                        tex.colorSpace = THREE.SRGBColorSpace; // Sahi colors ke liye
                        tex.needsUpdate = true;
                        material.map = tex;
                        material.needsUpdate = true;
                    } else {
                        // Naya texture background mein chup-chaap load karo
                        new THREE.TextureLoader().load(appliedUrl, (loadedTex) => {
                            textureCache.current[appliedUrl] = loadedTex; // Cache mein save kar lo
                            const tex = loadedTex.clone();
                            tex.wrapS = THREE.RepeatWrapping;
                            tex.wrapT = THREE.RepeatWrapping;
                            tex.repeat.set(tiling.x, tiling.y);
                            tex.colorSpace = THREE.SRGBColorSpace;
                            tex.needsUpdate = true;
                            material.map = tex;
                            material.needsUpdate = true;
                        });
                    }
                }

                // Keep material clean and natural so user can see texture instantly
                material.emissive = new THREE.Color("#000000");
                material.emissiveIntensity = 0;
                material.needsUpdate = true;

                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene, appliedTextures, selectedMesh, activeRoom]);

    return (
        <>
            <primitive
                object={scene}
                position={[0, 0, 0]}
                scale={1}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    if (e.object && e.object.name) {
                        document.body.style.cursor = isValidMesh(e.object.name) ? 'pointer' : 'not-allowed';
                    }
                }}
                onPointerOut={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'auto';
                }}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                    e.stopPropagation();
                    if (e.object && e.object.name) {
                        if (!isValidMesh(e.object.name)) return; // Block clicks on unmapped meshes
                        const clickedName = e.object.name;
                        if (clickedName !== selectedMesh) {
                            setSelectedMesh(clickedName);
                        }
                    }
                }}
            />

            {/* Pulsing Selection Pin at Bounding Box Center */}
            {selectedMesh && (() => {
                const child = scene.getObjectByName(selectedMesh);
                if (!child) return null;
                
                const box = new THREE.Box3().setFromObject(child);
                const center = new THREE.Vector3();
                box.getCenter(center);
                
                return (
                    <Html position={[center.x, center.y, center.z]} center distanceFactor={12}>
                        <div className="flex flex-col items-center gap-1.5 pointer-events-none select-none animate-bounce">
                            {/* Glowing Pin Badge */}
                            <div className="bg-[#121214]/90 backdrop-blur-md border border-purple-500/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                                <div className="relative w-1.5 h-1.5 flex items-center justify-center">
                                    <div className="absolute w-3 h-3 bg-purple-500/50 rounded-full animate-ping" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                </div>
                                <span className="text-[8px] font-black text-white uppercase tracking-wider whitespace-nowrap">
                                    {selectedMesh}
                                </span>
                            </div>
                            
                            {/* Downward pointing purple arrow */}
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-purple-500" />
                        </div>
                    </Html>
                );
            })()}
        </>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function VisualizerPage() {
    const [currentRoomId, setCurrentRoomId] = useState<string>(ROOM_CONFIGS[0].id);
    const [activeTab, setActiveTab] = useState("wall");
    const [selectedMesh, setSelectedMesh] = useState<string | null>(null);
    const [appliedTextures, setAppliedTextures] = useState<Record<string, string>>({});
    const [selectedSeries, setSelectedSeries] = useState<ProductSeries | null>(null);
    const controlsRef = useRef<any>(null);
    const [copied, setCopied] = useState(false);
    const [batchIndex, setBatchIndex] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

    useEffect(() => {
        setCopied(false);
    }, [selectedMesh]);

    useEffect(() => {
        setBatchIndex(0);
        setSelectedSeries(null); // Reset back to category/series root view
    }, [activeTab, currentRoomId, selectedMesh]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const copyToClipboard = () => {
        if (!selectedMesh) return;
        navigator.clipboard.writeText(selectedMesh);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Get currently active room configuration
    const activeRoom = useMemo(() => {
        return ROOM_CONFIGS.find(room => room.id === currentRoomId) || ROOM_CONFIGS[0];
    }, [currentRoomId]);

    const applyTexture = (url: string) => {
        if (!selectedMesh) return;
        
        const lowerMesh = selectedMesh.toLowerCase();
        
        // STRICT CATEGORY VALIDATION LOGIC based on mesh mapping details
        if (activeTab === "floor") {
            const isFloor = activeRoom.meshMapping.floors.meshes.some(f => f.toLowerCase() === lowerMesh);
            if (!isFloor) {
                setToast({ message: "Flooring sirf farsh (Floor) par lagai ja sakti hai!", type: "error" });
                return;
            }
        } else if (activeTab === "wall") {
            // Wall panel ceiling pe bhi lagaya ja sakta hai
            const isWall = activeRoom.meshMapping.walls.meshes.some(w => w.toLowerCase() === lowerMesh);
            const isCeiling = activeRoom.meshMapping.ceilings.meshes.some(c => c.toLowerCase() === lowerMesh);
            if (!isWall && !isCeiling) {
                setToast({ message: "Wall panels sirf deewar ya chhat par lagaye ja sakte hain!", type: "error" });
                return;
            }
        } else if (activeTab === "ceiling") {
            const isCeiling = activeRoom.meshMapping.ceilings.meshes.some(c => c.toLowerCase() === lowerMesh);
            if (!isCeiling) {
                setToast({ message: "Ceiling panels sirf chhat par lagaye ja sakte hain!", type: "error" });
                return;
            }
        }

        if (appliedTextures[lowerMesh] === url) return;
        setAppliedTextures(prev => ({ ...prev, [lowerMesh]: url }));
    };

    const resetView = () => {
        if (controlsRef.current) controlsRef.current.reset();
    };

    const rotateCamera = (angle: number) => {
        if (!controlsRef.current) return;
        controlsRef.current.rotateLeft(angle);
        controlsRef.current.update();
    };

    const moveHeight = (delta: number) => {
        if (!controlsRef.current) return;
        const { object, target } = controlsRef.current;
        object.position.y += delta;
        target.y += delta;
        controlsRef.current.update();
    };

    return (
        <main className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans">
            <AnimatePresence>
                {selectedMesh && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="absolute top-10 left-1/2 z-[100] pointer-events-none"
                    >
                        <div className="bg-purple-600 text-white px-8 py-3 rounded-full font-black text-[10px] tracking-[0.2em] shadow-[0_0_50px_rgba(147,51,234,0.5)] border-2 border-white/20">
                            <span className="uppercase">Selected Surface:</span> <span className="underline ml-2">{selectedMesh}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="absolute top-24 left-1/2 z-[200] w-full max-w-sm px-4"
                    >
                        <div className="bg-[#121214]/90 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.2)] flex items-start gap-3">
                            <div className="p-2 bg-red-500/10 rounded-xl text-red-400 mt-0.5">
                                <AlertCircle size={16} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-[10px] font-black uppercase tracking-wider mb-0.5">Attention Required</h3>
                                <p className="text-gray-300 text-[11px] font-semibold leading-relaxed">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToast(null)}
                                className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all active:scale-95 flex items-center justify-center"
                                title="Close Alert"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-10 left-10 z-[100] flex flex-col gap-4">
                <button
                    onClick={resetView}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl text-[10px] text-white font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl"
                >
                    <Maximize size={14} className="text-purple-500" />
                    Reset View
                </button>
            </div>

            <div className="absolute bottom-10 left-10 z-[100] flex flex-col items-center gap-2 p-6 bg-black/40 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl scale-90 sm:scale-100">
                <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-2">Look & Height</div>
                <button onClick={() => moveHeight(1)} className="p-3 bg-white/5 hover:bg-purple-600 text-white rounded-xl transition-all active:scale-90" title="Look Up"><ChevronUp size={20} /></button>
                <div className="flex gap-2">
                    <button onClick={() => rotateCamera(0.2)} className="p-3 bg-white/5 hover:bg-purple-600 text-white rounded-xl transition-all active:scale-90" title="Rotate Left"><RotateCcw size={20} /></button>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <MousePointer2 size={16} className="text-purple-500 opacity-50" />
                    </div>
                    <button onClick={() => rotateCamera(-0.2)} className="p-3 bg-white/5 hover:bg-purple-600 text-white rounded-xl transition-all active:scale-90" title="Rotate Right"><RotateCw size={20} /></button>
                </div>
                <button onClick={() => moveHeight(-1)} className="p-3 bg-white/5 hover:bg-purple-600 text-white rounded-xl transition-all active:scale-90" title="Look Down"><ChevronDown size={20} /></button>
            </div>

            <div className="absolute inset-0 z-0">
                <Canvas
                    shadows
                    dpr={[1, 2]}
                    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                >
                    <Suspense fallback={<Loader />}>
                        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={45} />
                        <OrbitControls
                            ref={controlsRef}
                            enableDamping
                            dampingFactor={0.05}
                            enablePan={false} // Disables moving the camera position laterally
                            enableZoom={true}
                            minDistance={2} // Prevents zooming too far in
                            maxDistance={15} // Prevents zooming outside the walls
                            maxPolarAngle={Math.PI - 0.2} // Allows looking upwards at the ceiling
                            makeDefault
                        />

                        <ambientLight intensity={0.5} />
                        <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={2.5} castShadow />
                        <directionalLight position={[-10, 10, 5]} intensity={1} />

                        <Environment preset="city" />

                        <Room
                            appliedTextures={appliedTextures}
                            appliedTiling={{}}
                            selectedMesh={selectedMesh}
                            setSelectedMesh={setSelectedMesh}
                            activeRoom={activeRoom}
                        />

                        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="absolute top-10 right-10 z-40 w-80 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                <div className="flex flex-col gap-6">
                    <header>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase leading-none">Studio</h1>
                        <p className="text-purple-400 text-[9px] font-bold tracking-[0.2em] uppercase">Individual Surface Control</p>
                    </header>

                    {/* DYNAMIC ROOM/SPACE SELECTOR */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Select Room Space</label>
                        <select
                            value={currentRoomId}
                            onChange={(e) => {
                                setCurrentRoomId(e.target.value);
                                setSelectedMesh(null); // Reset active selection when space changes
                            }}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 px-4 focus:outline-none focus:border-purple-500 transition-all text-[11px] font-bold tracking-wider"
                        >
                            {ROOM_CONFIGS.map(config => (
                                <option key={config.id} value={config.id} className="bg-[#0c0c0e] text-white py-2">
                                    {config.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!selectedMesh ? (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
                            <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Click any wall or floor in the room to start designing
                            </p>
                        </div>
                    ) : (
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Active Surface</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] text-purple-400 font-black tracking-widest truncate max-w-[100px]">{selectedMesh}</span>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all text-purple-400 active:scale-90 flex items-center justify-center"
                                    title="Copy Surface Name"
                                >
                                    {copied ? <Check size={8} className="text-green-400 animate-pulse" /> : <Copy size={8} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                        {["wall", "floor", "ceiling"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                disabled={!selectedMesh}
                                className={`py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${!selectedMesh ? "opacity-30 cursor-not-allowed" : ""} ${activeTab === tab ? "bg-purple-600 text-white shadow-lg" : "text-gray-400"}`}
                            >
                                {tab === "wall" ? "Walls" : tab === "floor" ? "Floors" : "Ceiling"}
                            </button>
                        ))}
                    </div>

                    {/* BREADCRUMB NAVIGATION */}
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 select-none">
                        <button
                            onClick={() => {
                                setSelectedSeries(null);
                                setBatchIndex(0);
                            }}
                            className={`transition-all duration-300 hover:text-purple-400 ${selectedSeries ? "text-purple-400 cursor-pointer" : "text-gray-300 pointer-events-none"}`}
                        >
                            {activeTab === "wall" ? "Walls" : activeTab === "floor" ? "Floors" : "Ceiling"}
                        </button>
                        {selectedSeries && (
                            <>
                                <ChevronRight size={10} className="text-gray-600 animate-pulse" />
                                <span className="text-white truncate max-w-[130px] font-black">{selectedSeries.name}</span>
                            </>
                        )}
                    </div>

                    {/* BATCHED HORIZONTAL SWIPER PAGE OF 4 OPTIONS */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTab}-${selectedSeries?.id || "root"}-${batchIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 gap-4 min-h-[220px]"
                            >
                                {(() => {
                                    const activeSeriesList = activeTab === "wall" ? wallSeries : activeTab === "floor" ? floorSeries : ceilingSeries;
                                    
                                    // If no series is selected, display the list of categories (folders)
                                    if (!selectedSeries) {
                                        const itemsPerPage = 4;
                                        const currentBatch = activeSeriesList.slice(batchIndex * itemsPerPage, (batchIndex + 1) * itemsPerPage);
                                        
                                        return currentBatch.map((series) => (
                                            <button
                                                key={series.id}
                                                disabled={!selectedMesh}
                                                onClick={() => {
                                                    setSelectedSeries(series);
                                                    setBatchIndex(0);
                                                }}
                                                className={`group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 ${!selectedMesh ? "opacity-50 grayscale cursor-not-allowed" : "hover:scale-105 hover:border-purple-500/50"}`}
                                            >
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                                                <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <Image src={series.thumbnailUrl} alt={series.name} fill sizes="150px" className="object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                
                                                {/* Series Badge */}
                                                <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 bg-purple-600/90 text-white text-[6px] font-black rounded uppercase tracking-wider shadow-lg">
                                                    Series
                                                </div>
                                                
                                                <span className="absolute bottom-3 left-3 right-3 text-[8px] font-black text-white uppercase tracking-wider z-10 text-left leading-tight">
                                                    {series.name}
                                                </span>
                                            </button>
                                        ));
                                    }
                                    
                                    // If a series is selected, display the variants inside it
                                    const itemsPerPage = 4;
                                    const currentBatch = selectedSeries.variants.slice(batchIndex * itemsPerPage, (batchIndex + 1) * itemsPerPage);
                                    
                                    return currentBatch.map((item) => (
                                        <button
                                            key={item.id}
                                            disabled={!selectedMesh}
                                            onClick={() => applyTexture(item.textureUrl)}
                                            className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${!selectedMesh ? "opacity-50 grayscale cursor-not-allowed" : "hover:scale-105"}`}
                                            style={{ borderColor: selectedMesh && appliedTextures[selectedMesh.toLowerCase()] === item.textureUrl ? "#9333ea" : "transparent" }}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image src={item.textureUrl} alt={item.name} fill sizes="150px" className="object-cover group-hover:scale-110 transition-transform animate-fade-in" />
                                            </div>
                                            <span className="absolute bottom-2 left-2 right-2 text-[7px] font-black text-white uppercase bg-black/60 px-2 py-1 rounded backdrop-blur z-10">
                                                {item.name}
                                            </span>
                                        </button>
                                    ));
                                })()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination indicator dots and arrows */}
                        {(() => {
                            const activeSeriesList = activeTab === "wall" ? wallSeries : activeTab === "floor" ? floorSeries : ceilingSeries;
                            const activeList = selectedSeries ? selectedSeries.variants : activeSeriesList;
                            const itemsPerPage = 4;
                            const totalPages = Math.ceil(activeList.length / itemsPerPage);
                            
                            if (totalPages <= 1) return null;

                            return (
                                <div className="flex items-center justify-between mt-4 px-2">
                                    <button
                                        onClick={() => setBatchIndex(prev => Math.max(0, prev - 1))}
                                        disabled={batchIndex === 0}
                                        className="p-2 bg-white/5 hover:bg-purple-600 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                        title="Previous"
                                    >
                                        <ChevronLeft size={12} />
                                    </button>

                                    <div className="flex gap-1.5 items-center">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setBatchIndex(i)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${batchIndex === i ? "bg-purple-500 w-3" : "bg-white/20 hover:bg-white/40"}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setBatchIndex(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={batchIndex === totalPages - 1}
                                        className="p-2 bg-white/5 hover:bg-purple-600 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                        title="Next"
                                    >
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            );
                        })()}
                    </div>

                    <button className="w-full py-5 bg-white hover:bg-purple-600 hover:text-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95">
                        Save Configuration
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] flex gap-8 shadow-2xl">
                <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-purple-500" /> Left Click: Rotate</span>
                <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-purple-500" /> Right Click: Pan/Move</span>
                <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-purple-500" /> Scroll: Zoom</span>
            </div>
        </main>
    );
}
