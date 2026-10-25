"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { 
  RotateCw, Maximize2, Minimize2, Sparkles, 
  Layers, MessageCircle, Box, BookOpen, Book, Sun
} from "lucide-react";

// Known 10 detachable panel node names from the Blender model
const FRONT_PANELS = ["Panel_E8-01", "Panel_E8-02", "Panel_E8-03", "Panel_E8-11", "Panel_E8-13"];
const BACK_PANELS = ["Panel_E8-14", "Panel_E8-15", "Panel_E8-16", "Panel_E8-17", "Panel_E8-18"];
const ALL_PANEL_NAMES = [...FRONT_PANELS, ...BACK_PANELS];

// Realistic panel finishes for live dynamic swapping
const FINISH_PRESETS = [
  { id: "e8-original", name: "Original Spec Finish", color: "#8a6642", roughness: 0.6 },
  { id: "natural-teak", name: "Natural Royal Teak", color: "#a56336", roughness: 0.5 },
  { id: "dark-walnut", name: "Deep Smoked Walnut", color: "#3d2314", roughness: 0.7 },
  { id: "charcoal-black", name: "Charcoal Facade Black", color: "#222222", roughness: 0.8 },
  { id: "scandi-oak", name: "Scandinavian White Oak", color: "#c8b093", roughness: 0.4 },
  { id: "statuario-marble", name: "Statuario UV Marble", color: "#e8eaed", roughness: 0.2 },
];

interface PanelData {
  name: string;
  originalZ: number;
  mesh: THREE.Mesh;
  isDetached: boolean;
  targetZ: number;
  currentZ: number;
  finishId: string;
}

export default function Catalog3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const panelsRef = useRef<Map<string, PanelData>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Exact Blender Model Rotation Euler values:
  // Hinge_Front = -1.309 rad (-75 degrees)
  // Hinge_Back  = +1.309 rad (+75 degrees)
  // Total Opening Angle = 150 degrees, perfectly symmetrical around the central spine!
  const hingeFrontRef = useRef<THREE.Object3D | null>(null);
  const hingeBackRef = useRef<THREE.Object3D | null>(null);
  const targetFrontAngleRef = useRef<number>(-1.309);
  const targetBackAngleRef = useRef<number>(1.309);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [allPoppedOut, setAllPoppedOut] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Folder Open & Close Actions (Exact Blender 150 degrees)
  const handleOpenCatalog = useCallback(() => {
    targetFrontAngleRef.current = -1.309;
    targetBackAngleRef.current = 1.309;
    setIsOpen(true);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.25, -0.03);
    }
  }, []);

  const handleCloseCatalog = useCallback(() => {
    targetFrontAngleRef.current = 0;
    targetBackAngleRef.current = 0;
    setIsOpen(false);
    // Put back all popped out panels if closing
    panelsRef.current.forEach((panel) => {
      panel.isDetached = false;
      panel.targetZ = panel.originalZ;
    });
    setAllPoppedOut(false);
  }, []);

  // Animate panel detachment (pull out / put back)
  const togglePanelDetachment = useCallback((panelName: string) => {
    const panel = panelsRef.current.get(panelName);
    if (!panel) return;

    const isFront = FRONT_PANELS.includes(panelName);
    // Front panels move along negative Z in their local space; back panels move positive Z
    const offset = isFront ? -0.09 : 0.09;

    panel.isDetached = !panel.isDetached;
    panel.targetZ = panel.isDetached ? panel.originalZ + offset : panel.originalZ;
    setSelectedPanel(panelName);
  }, []);

  const handleSelectPanelFromList = (panelName: string) => {
    const isFront = FRONT_PANELS.includes(panelName);
    if (!isOpen) {
      handleOpenCatalog();
    }
    setCameraPreset(isFront ? "front" : "back");
    togglePanelDetachment(panelName);
  };

  const toggleAllPanels = useCallback(() => {
    const newState = !allPoppedOut;
    setAllPoppedOut(newState);

    if (newState && !isOpen) {
      handleOpenCatalog();
    }

    panelsRef.current.forEach((panel, name) => {
      const isFront = FRONT_PANELS.includes(name);
      const offset = isFront ? -0.09 : 0.09;
      panel.isDetached = newState;
      panel.targetZ = newState ? panel.originalZ + offset : panel.originalZ;
    });
  }, [allPoppedOut, isOpen, handleOpenCatalog]);

  // Dynamic color/finish swap for selected panel
  const handleApplyFinish = (finish: typeof FINISH_PRESETS[0]) => {
    if (!selectedPanel) return;
    const panel = panelsRef.current.get(selectedPanel);
    if (!panel || !panel.mesh) return;

    if (panel.mesh.material) {
      const mat = panel.mesh.material as THREE.MeshStandardMaterial;
      mat.color = new THREE.Color(finish.color);
      mat.roughness = finish.roughness;
      mat.needsUpdate = true;
      panel.finishId = finish.id;
    }
  };

  // Camera presets
  const setCameraPreset = (preset: "front" | "back" | "iso") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    if (preset === "front") {
      camera.position.set(0, 0.32, isMobile ? 1.45 : 1.15);
      controls.target.set(0, 0.25, -0.03);
    } else if (preset === "back") {
      camera.position.set(0, 0.32, isMobile ? -1.55 : -1.25);
      controls.target.set(0, 0.25, -0.03);
    } else {
      camera.position.set(isMobile ? 0.6 : 0.85, isMobile ? 0.65 : 0.75, isMobile ? 1.4 : 1.05);
      controls.target.set(0, 0.25, -0.03);
    }
    controls.update();
  };

  // Full Screen Toggle with Native Fullscreen API + Fallback
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => setIsFullscreen(true));
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => setIsFullscreen(false));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Listen to browser native fullscreen change
  useEffect(() => {
    const onFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  // Handle ESC key fallback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Handle Resize on Fullscreen and Window Changes
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      const isMobile = w < 640 || w / h < 0.8;
      cameraRef.current.aspect = w / h;
      cameraRef.current.fov = isMobile ? 46 : 40;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [isFullscreen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d); // Luxury architectural slate-950

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = width < 640 || width / height < 0.8;
    const camera = new THREE.PerspectiveCamera(isMobile ? 46 : 40, width / height, 0.05, 50);
    if (isMobile) {
      camera.position.set(0.4, 0.48, 1.45);
    } else {
      camera.position.set(0.85, 0.75, 1.05);
    }
    cameraRef.current = camera;

    // 3. Renderer with High-Quality Shadow Maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 4.2;
    controls.minDistance = 0.35;
    controls.target.set(0, 0.25, -0.03);
    controlsRef.current = controls;

    // 5. ARCHITECTURAL WARM STUDIO LIGHTING & BALANCED SHADOWS
    // A. Warm ambient light to keep natural, true-to-life catalog colors without desaturation
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 0.65);
    scene.add(ambientLight);

    // B. Strong One-Sided Master Key Light (from top-right-front at 45°)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(2.2, 3.5, 1.8);
    keyLight.target.position.set(0, 0.25, 0);
    scene.add(keyLight.target);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02; // Prevents shadow acne on thin panel faces
    scene.add(keyLight);

    // C. Warm frontal fill light so angled front cover receives identical color and brightness
    const fillLight = new THREE.DirectionalLight(0xfff3e0, 1.3);
    fillLight.position.set(-2.2, 2.8, 2.2);
    scene.add(fillLight);

    // D. Subtle top rim light
    const rimLight = new THREE.DirectionalLight(0xfef3c7, 0.5);
    rimLight.position.set(0, 3.2, -2.5);
    scene.add(rimLight);

    // 6. Load GLB Model & Setup Scene
    const loader = new GLTFLoader();
    const texLoader = new THREE.TextureLoader();

    loader.load(
      "/models/Goals-Cataloge.glb",
      (gltf) => {
        const root = gltf.scene;
        scene.add(root);

        // Model sits naturally on the ground plane (y = 0)
        root.position.set(0, 0, 0);

        // Shadows & Color Matching across materials
        root.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name.toLowerCase().includes("floor")) {
              child.scale.set(20, 1, 20); // Seamlessly stretches floor so no void is visible
              child.castShadow = false;
              child.receiveShadow = true;
            } else {
              child.castShadow = true;
              child.receiveShadow = true;
            }
            if (child.material) {
              child.material.shadowSide = THREE.DoubleSide;
            }

            // Ensure Front_Band and Spine_Band have identical warm cream-tan color matching physical catalog
            if (child.name.includes("Band") || child.material?.name?.includes("Band")) {
              if (child.material) {
                child.material = (child.material as THREE.Material).clone();
                const bMat = child.material as THREE.MeshStandardMaterial;
                bMat.color.set("#E1CBAD");
                bMat.roughness = 0.5;
                bMat.metalness = 0.0;
                bMat.needsUpdate = true;
              }
            }
          }
        });

        // Find BOTH Hinge nodes for symmetrical open book (150 degrees)
        const hingeFront = root.getObjectByName("Hinge_Front");
        if (hingeFront) {
          hingeFrontRef.current = hingeFront;
          hingeFront.rotation.y = targetFrontAngleRef.current; // -1.309 rad (-75 deg as in Blender)
        }

        const hingeBack = root.getObjectByName("Hinge_Back");
        if (hingeBack) {
          hingeBackRef.current = hingeBack;
          hingeBack.rotation.y = targetBackAngleRef.current; // +1.309 rad (+75 deg as in Blender)
        }

        // Apply Clean Generated Front Lady Photo (high-res, no blur, no white dots, no badges)
        texLoader.load(
          "/images/sample-kit/front_cover_lady.jpg",
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.flipY = false;
            root.traverse((child) => {
              if (child instanceof THREE.Mesh && (child.name.includes("Lady") || child.material?.name === "Lady_Tex.001")) {
                if (child.material) {
                  child.material = (child.material as THREE.Material).clone();
                  const mat = child.material as THREE.MeshStandardMaterial;
                  mat.map = tex;
                  mat.roughness = 0.5;
                  mat.needsUpdate = true;
                }
              }
            });
          },
          undefined,
          (err) => console.warn("Could not load custom lady texture:", err)
        );

        // Apply Clean Seamless Car Texture exclusively to Back_Car mesh (without touching any other cards)
        texLoader.load(
          "/images/sample-kit/goals_car_matched.jpg",
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.flipY = false;
            const carMesh = root.getObjectByName("Back_Car");
            if (carMesh instanceof THREE.Mesh && carMesh.material) {
              carMesh.material = (carMesh.material as THREE.Material).clone();
              const mat = carMesh.material as THREE.MeshStandardMaterial;
              mat.map = tex;
              mat.roughness = 0.45;
              mat.needsUpdate = true;
            }
          },
          undefined,
          (err) => console.warn("Could not load car texture:", err)
        );

        // Collect and register the 10 detachable panel pieces
        root.traverse((child) => {
          if (child instanceof THREE.Mesh && ALL_PANEL_NAMES.includes(child.name)) {
            // Clone material so individual panel finish edits don't bleed across
            if (child.material) {
              child.material = (child.material as THREE.Material).clone();
            }

            panelsRef.current.set(child.name, {
              name: child.name,
              originalZ: child.position.z,
              targetZ: child.position.z,
              currentZ: child.position.z,
              mesh: child,
              isDetached: false,
              finishId: "e8-original",
            });
          }
        });

        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error("Error loading GLB catalog model:", error);
        setIsLoading(false);
      }
    );

    // 7. Raycaster interaction for hover and click with drag distance threshold
    let pointerStartX = 0;
    let pointerStartY = 0;

    const getIntersectedPanel = (clientX: number, clientY: number): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const meshes: THREE.Mesh[] = [];
      panelsRef.current.forEach(p => meshes.push(p.mesh));
      const intersects = raycasterRef.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        return intersects[0].object.name;
      }
      return null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const panelName = getIntersectedPanel(e.clientX, e.clientY);
      setHoveredPanel(panelName);
      renderer.domElement.style.cursor = panelName ? "pointer" : "default";
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dragDistance = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      // Only treat as click if user didn't drag to orbit
      if (dragDistance < 7) {
        const panelName = getIntersectedPanel(e.clientX, e.clientY);
        if (panelName) {
          togglePanelDetachment(panelName);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointermove", handlePointerMove);
    domElement.addEventListener("pointerup", handlePointerUp);

    // 8. Animation Render Loop (smooth lerp for book hinges and detached pieces)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smoothly animate BOTH hinges for symmetrical open book (150 degrees)
      if (hingeFrontRef.current) {
        if (Math.abs(hingeFrontRef.current.rotation.y - targetFrontAngleRef.current) > 0.0005) {
          hingeFrontRef.current.rotation.y = THREE.MathUtils.lerp(
            hingeFrontRef.current.rotation.y,
            targetFrontAngleRef.current,
            0.08
          );
        }
      }

      if (hingeBackRef.current) {
        if (Math.abs(hingeBackRef.current.rotation.y - targetBackAngleRef.current) > 0.0005) {
          hingeBackRef.current.rotation.y = THREE.MathUtils.lerp(
            hingeBackRef.current.rotation.y,
            targetBackAngleRef.current,
            0.08
          );
        }
      }

      // Smoothly animate panels sliding in or out
      panelsRef.current.forEach(panel => {
        if (Math.abs(panel.currentZ - panel.targetZ) > 0.0005) {
          panel.currentZ = THREE.MathUtils.lerp(panel.currentZ, panel.targetZ, 0.12);
          panel.mesh.position.z = panel.currentZ;
        }

        // Apply visual emissive rim highlight when detached
        if (panel.mesh.material && "emissive" in panel.mesh.material) {
          const mat = panel.mesh.material as THREE.MeshStandardMaterial;
          const targetEmissive = panel.isDetached ? new THREE.Color(0x35200b) : new THREE.Color(0x000000);
          mat.emissive.lerp(targetEmissive, 0.1);
        }
      });

      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.2;
      controls.update();

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointermove", handlePointerMove);
      domElement.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [togglePanelDetachment, autoRotate]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-slate-950 overflow-hidden select-none transition-all duration-300 ${
        isFullscreen 
          ? "!fixed !inset-0 !z-[999999] !w-screen !h-screen rounded-none border-none shadow-none" 
          : "h-[650px] sm:h-[750px] lg:h-[820px] rounded-3xl border border-slate-800 shadow-2xl"
      }`}
    >
      
      {/* 3D Top Status Bar - Minimal & Clean */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Box size={15} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-2 truncate">
              GOALS™ ARCHITECTURAL SPECIFIER FOLDER
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              Interactive 360° Studio • Authentic Physical Catalog by Goals Floors
            </p>
          </div>
        </div>
      </div>

      {/* Main WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing flex-grow" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h4 className="text-base font-bold text-white mb-1">Loading 3D Wall Panel Catalog...</h4>
          <p className="text-xs text-slate-400">Loading hinges, realistic directional shadows &amp; 10 detachable panel cuts ({loadProgress}%)</p>
        </div>
      )}

      {/* Hover Tooltip Overlay */}
      {hoveredPanel && !selectedPanel && (
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-400 shadow-xl backdrop-blur-sm animate-in fade-in duration-150 whitespace-nowrap">
          ✨ {hoveredPanel.replace("Panel_", "Panel ")} • Click to slide out &amp; inspect
        </div>
      )}

      {/* Floating Bottom Capsule Toolbar (Mobile & Desktop) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-black/80 backdrop-blur-md max-w-[95%]">
        
        {/* Open / Close Buttons */}
        <div className="flex items-center bg-slate-950/80 rounded-full p-0.5 border border-slate-800">
          <button
            onClick={handleOpenCatalog}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isOpen 
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
            title="Open catalog folder"
          >
            <BookOpen size={13} />
            <span>Open</span>
          </button>
          <button
            onClick={handleCloseCatalog}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              !isOpen 
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
            title="Close catalog folder"
          >
            <Book size={13} />
            <span>Close</span>
          </button>
        </div>

        <div className="w-px h-5 bg-slate-700/60 my-auto" />

        {/* 360 Auto-Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-full text-xs font-semibold transition border cursor-pointer ${
            autoRotate 
              ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30" 
              : "bg-slate-950/80 text-slate-300 hover:text-white border-slate-800"
          }`}
          title={autoRotate ? "Pause 360° Rotate" : "360° Auto-Rotate"}
          aria-label="Toggle 360 rotation"
        >
          <RotateCw size={14} className={autoRotate ? "animate-spin" : ""} />
        </button>

        {/* Camera Angle Presets (Hidden on small mobile screens to keep capsule sleek) */}
        <div className="hidden sm:flex items-center bg-slate-950/80 rounded-full p-0.5 border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => setCameraPreset("front")}
            className="px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Front Cover View"
          >
            Front
          </button>
          <button
            onClick={() => setCameraPreset("back")}
            className="px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Back Cover View"
          >
            Back
          </button>
          <button
            onClick={() => setCameraPreset("iso")}
            className="px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="3D Perspective View"
          >
            3D Iso
          </button>
        </div>

        <div className="w-px h-5 bg-slate-700/60 my-auto" />

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border shadow-md cursor-pointer ${
            isFullscreen 
              ? "bg-amber-500 text-white border-amber-400 shadow-amber-500/30" 
              : "bg-slate-950/80 text-slate-200 hover:text-white border-slate-800"
          }`}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span className="hidden md:inline">{isFullscreen ? "Exit" : "Full Screen"}</span>
        </button>

      </div>

      {/* Selected Panel Inspector Card (Bottom Drawer) */}
      {selectedPanel && (
        <div className="absolute bottom-20 sm:bottom-24 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-30 p-5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                {FRONT_PANELS.includes(selectedPanel) ? "Front Specimen" : "Back Specimen"}
              </span>
              <h4 className="text-base font-black text-white">
                {selectedPanel.replace("Panel_", "Wall Panel ")}
              </h4>
            </div>
            <button
              onClick={() => togglePanelDetachment(selectedPanel)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {panelsRef.current.get(selectedPanel)?.isDetached ? "Put Back" : "Pull Out"}
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            Status: <span className="text-emerald-400 font-bold">{panelsRef.current.get(selectedPanel)?.isDetached ? "Detached / Pulled Out" : "Fitted in Catalog Slot"}</span>
          </p>

          {/* Live Texture Finishes */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Test Alternate Wood Finish on 3D Model:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {FINISH_PRESETS.map((fin) => (
                <button
                  key={fin.id}
                  onClick={() => handleApplyFinish(fin)}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: fin.color }} />
                  <span className="text-[10px] text-slate-300 font-medium truncate">{fin.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Order Button */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <a
              href={`https://wa.me/917217644573?text=${encodeURIComponent(`Hi Goals Floors, I am exploring your 3D Wall Panel Catalog and want to order the physical sample piece for ${selectedPanel.replace("Panel_", "Wall Panel ")}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <MessageCircle size={14} /> Request Sample on WhatsApp
            </a>
            <button
              onClick={() => setSelectedPanel(null)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}



    </div>
  );
}
