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

// --- ROOM CONFIGURATION REGISTRY ---
interface MeshMappingDetail {
    meshes: string[];
    tiling: { x: number; y: number };
}

interface RoomConfig {
    id: string;
    name: string;
    modelUrl: string;
    meshMapping: {
        walls: MeshMappingDetail;
        floors: MeshMappingDetail;
        ceilings: MeshMappingDetail;
    };
}

const ROOM_CONFIGS: RoomConfig[] = [
    {
        id: "living-room",
        name: "Living Room",
        modelUrl: "/models/room.glb",
        meshMapping: {
            walls: {
                meshes: ["Modern_Living_Room_Walls_0004", "cieling002", "wall003", "wall-front"],
                tiling: { x: 80, y: 5 }
            },
            floors: {
                meshes: ["Modern_Living_Room_Planks_0"],
                tiling: { x: 5, y: 10 }
            },
            ceilings: {
                meshes: ["mm001"],
                tiling: { x: 20, y: 5 }
            }
        }
    }
    // FUTURE SPACE PLACEHOLDERS:
    // {
    //     id: "bedroom",
    //     name: "Luxury Bedroom",
    //     modelUrl: "/models/bedroom.glb",
    //     meshMapping: {
    //         walls: {
    //             meshes: ["wall_bedside", "wall_window", "wall_accent"],
    //             tiling: { x: 40, y: 2 }
    //         },
    //         floors: {
    //             meshes: ["floor_parquet"],
    //             tiling: { x: 20, y: 20 }
    //         },
    //         ceilings: {
    //             meshes: ["ceiling_suspended"],
    //             tiling: { x: 15, y: 15 }
    //         }
    //     }
    // }
];

// --- TYPES ---
interface ProductVariant {
    id: string;
    name: string;
    textureUrl: string;
}

interface RoomProps {
    appliedTextures: Record<string, string>;
    appliedTiling: Record<string, { x: number; y: number }>;
    selectedMesh: string | null;
    setSelectedMesh: (name: string) => void;
    activeRoom: RoomConfig;
}

// --- HELPER FOR DEFAULT TILING ---
const getDefaultTiling = (meshName: string) => {
    return { x: 80, y: 1 };
};

// --- PRODUCT DATA ---
const wallPanels: ProductVariant[] = [
    // Primo Fluted Panel (FP 701 - 713)
    { id: "wp_701", name: "FP-701", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png" },
    { id: "wp_702", name: "FP-702", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_702.png" },
    { id: "wp_703", name: "FP-703", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_703.png" },
    { id: "wp_704", name: "FP-704", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_704.png" },
    { id: "wp_705", name: "FP-705", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_705.png" },
    { id: "wp_706", name: "FP-706", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_706.png" },
    { id: "wp_707", name: "FP-707", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_707.png" },
    { id: "wp_708", name: "FP-708", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_708.png" },
    { id: "wp_709", name: "FP-709", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_709.png" },
    { id: "wp_710", name: "FP-710", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_710.png" },
    { id: "wp_711", name: "FP-711", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_711.png" },
    { id: "wp_712", name: "FP-712", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_712.png" },
    { id: "wp_713", name: "FP-713", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_713.png" },

    // Metallic Fluted Series
    { id: "wp_met_silver", name: "Silver Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Silver_Metallic.png" },
    { id: "wp_met_gold", name: "Gold Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Gold_Mettalic.png" },
    { id: "wp_met_copper", name: "Copper Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Copper_Mettalic.png" },
    { id: "wp_met_fluted", name: "Metallic Fluted", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776832078/Metallic_Fluted_Panel.jpg" },

    // Elite Fluted Panels (FP 714 - 722)
    { id: "wp_714", name: "FP-714", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png" },
    { id: "wp_715", name: "FP-715", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_715.png" },
    { id: "wp_716", name: "FP-716", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_716.png" },
    { id: "wp_717", name: "FP-717", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_717.png" },
    { id: "wp_718", name: "FP-718", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_718.png" },
    { id: "wp_719", name: "FP-719", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_719.png" },
    { id: "wp_720", name: "FP-720", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_720.png" },
    { id: "wp_721", name: "FP-721", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_721.png" },
    { id: "wp_722", name: "FP-722", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_722.png" },

    // Elite PVC Panel (12 Inch)
    { id: "wp_gf401", name: "GF-401", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png" },
    { id: "wp_gf402", name: "GF-402", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777063/Premium_Pvc_Panel_In_gurgaon.png" },
    { id: "wp_gf403", name: "GF-403", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777062/GF-403_Silver_Color_Pvc_Panel.png" },
    { id: "wp_gf404", name: "GF-404", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777061/GF-404_Gold_Flower_Design_Pvc_Panel.png" },
    { id: "wp_gf405", name: "GF-405", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777061/GF-305_Marble_Look_Premium_Pvc_Panel.png" },
    { id: "wp_gf406", name: "GF-406", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777059/GF-406_Premium_pvc_panel.png" },
    { id: "wp_gf407", name: "GF-407", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777059/GF_-_407_12_inch_Premium_pvc_panel_goals_floors.png" },
    { id: "wp_gf408", name: "GF-408", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777058/GF-408_Pvc_Panel_Supplier_in_Gurgaon.png" },
    { id: "wp_gf409", name: "GF-409", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777058/GF-409_Pvc_Panel_Latest_Texture_Design.png" },
    { id: "wp_gf410", name: "GF-410", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777058/GF-410_Cream_Color_Pvc_Panel.png" },
    { id: "wp_gf411", name: "GF-411", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777057/GF-411_Fabric_Texture_Pvc_Panel.png" },
    { id: "wp_gf412", name: "GF-412", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777056/GF_-_412_12_inch_pvc_panel.png" },

    // Primo Series (GF-301 - GF-312)
    { id: "wp_gf301", name: "GF-301", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png" },
    { id: "wp_gf302", name: "GF-302", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/GF-302_Premium_Pvc_Panel_Primo_Series.png" },
    { id: "wp_gf303", name: "GF-303", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780202/GF-303_Grey_Color_Pvc_Panel.png" },
    { id: "wp_gf304", name: "GF-304", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780202/GF-304_New_Launch_Wall_Panel_Design.png" },
    { id: "wp_gf305", name: "GF-305", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780202/GF-305_Latest_Pvc_Panel_Design.png" },
    { id: "wp_gf306", name: "GF-306", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779877/GF-306_Premium_Pvc_Panel.png" },
    { id: "wp_gf307", name: "GF-307", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779870/GF-307_Premium_Pvc_Panel_twelve_Inch.png" },
    { id: "wp_gf308", name: "GF-308", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779869/GF-308_Premium_Pvc_Panel_Dark_Brown.png" },
    { id: "wp_gf309", name: "GF-309", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779868/GF-309_Goals_Floors_Premium_Pvc_Panel.png" },
    { id: "wp_gf310", name: "GF-310", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779867/GF-310_Goals_Floors_Premium_Pvc_Panel.png" },
    { id: "wp_gf311", name: "GF-311", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779867/GF-311_Premium_Pvc_Panel_in_Gurgaon.png" },
    { id: "wp_gf312", name: "GF-312", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779866/GF-312_Pvc_Panel_Wooden_Color.png" },

    // Primo Series (GF-313 - GF-324)
    { id: "wp_gf313", name: "GF-313", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779864/GF-313_White_Color_Pvc_Panel.png" },
    { id: "wp_gf314", name: "GF-314", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779864/GF-314_Cream_Color_Pvc_Panel.png" },
    { id: "wp_gf315", name: "GF-315", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779863/GF-315_Grey_Color_Pvc_Panel.png" },
    { id: "wp_gf316", name: "GF-316", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779862/GF-316_Plain_Color_Pvc_Panel.png" },
    { id: "wp_gf317", name: "GF-317", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779861/GF-317_Texture_Pvc_Panel_Cream_Color.png" },
    { id: "wp_gf318", name: "GF-318", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779861/GF-318_Texture_Pvc_Panel_Greu_Color.png" },
    { id: "wp_gf319", name: "GF-319", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779859/GF-319_Dark_Grey_Color_Pvc_Panel.png" },
    { id: "wp_gf320", name: "GF-320", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779857/GF-320_12_inch_Premium_Pvc_Panel.png" },
    { id: "wp_gf321", name: "GF-321", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779857/GF-321_12_inch_Pvc_Panel.png" },
    { id: "wp_gf322", name: "GF-322", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779856/GF-322_12_inch_Premium_Pvc_Panel_Grey_Colour.png" },
    { id: "wp_gf323", name: "GF-323", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779856/GF-323_12_inch_Premium_Pvc_Panel_Latest_Color.png" },
    { id: "wp_gf324", name: "GF-324", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779855/GF-324_Stone_Look_PVC_Panel.png" },

    // Premium 17mm Fluted Series
    { id: "wp_17_black", name: "Premium Black Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Premium_Black_Color_WPC_Louvers.png" },
    { id: "wp_17_pencil", name: "Pencilclad Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477063/Pencilclad_Wpc_Louvers_2.png" },
    { id: "wp_17_fluted", name: "Fluted Panel Texture", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477066/Wpc_Fluted_Panel.png" },
    { id: "wp_17_image", name: "Imageclad Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477069/Imageclad_Premium_Wpc_Louvers.png" },
    { id: "wp_17_premium", name: "Premium Fluted Panel", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477072/17mm_Wpc_Fluted_Panel.png" }
];

const flooring: ProductVariant[] = [
    // G-F SPC 301 (Cobra Silver)
    { id: "f_spc295", name: "G-F SPC 295", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452465/G-F_SPC_295.avif" },
    { id: "f_spc296", name: "G-F SPC 296", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1779019189/G-F_SPC_296.png" },
    { id: "f_spc297", name: "G-F SPC 297", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_297.avif" },
    { id: "f_spc298", name: "G-F SPC 298", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_298.avif" },
    { id: "f_spc299", name: "G-F SPC 299", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_299.avif" },
    { id: "f_spc300", name: "G-F SPC 300", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_300.avif" },

    // G-F SPC 303 (Smoked Ash)
    { id: "f_spc301", name: "G-F SPC 301", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453026/G-F_SPC_301.avif" },
    { id: "f_spc302", name: "G-F SPC 302", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453027/G-F_SPC_302.avif" },
    { id: "f_spc303", name: "G-F SPC 303", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453027/G-F_SPC_303.avif" },
    { id: "f_spc304", name: "G-F SPC 304", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453026/G-F_SPC_304.avif" },
    { id: "f_spc305", name: "G-F SPC 305", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453031/G-F_SPC_305.avif" },
    { id: "f_spc306", name: "G-F SPC 306", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453031/G-F_SPC_306.avif" },

    // G-F SPC 302 (Herringbone)
    { id: "f_hgrey", name: "H-GREY", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453460/H-GREY.avif" },
    { id: "f_hbrown", name: "H-BROWN", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453460/H-BROWN.avif" },
    { id: "f_hgazlenut", name: "H-GAZLENUT", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453464/H-GAZLENUT.avif" },

    // Majestic Laminate Series
    { id: "f_blanche783", name: "Blanche Oak 783", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853814/Blanche_Oak_783_Laminate_Flooring.png" },
    { id: "f_bran782", name: "Bran Oak 782", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853812/Bran_Oak_782_Laminate_Flooring.png" },
    { id: "f_burlington7812", name: "Burlington Oak 7812", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853810/Burlington_Oak_7812_Laminate_Flooring.png" },
    { id: "f_gunmetal784", name: "Gunmetal Hue 784", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853808/Gunmetal_Hue_784_Laminate_Flooring.png" },
    { id: "f_ivory788", name: "Ivory Oak 788", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853806/Ivory_Oak_788_Laminate_Flooring.png" },
    { id: "f_loft789", name: "Loft Oak 789", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853804/Loft_Oak_789_Laminate_Flooring.png" },
    { id: "f_quattro785", name: "Quattro Walnut 785", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853802/Quattro_Walnut_785_Laminate_Flooring.png" },
    { id: "f_stretto786", name: "Stretto Walnut 786", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853800/Stretto_Walnut_786_Laminate_Flooring.png" },
    { id: "f_rosewood787", name: "Stripped Rosewood 787", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853798/Stripped_Rosewood_787_Laminate_Flooring.png" },
    { id: "f_walnut7811", name: "Stripped Walnut 7811", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853794/Stripped_Walnut_7811_Laminate_Flooring.png" },
    { id: "f_vitabarrel7814", name: "Vita Barrel Oak 7814", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853793/Vita_Barrel_Oak_7814_Laminate_Flooring.png" },
    { id: "f_wildwalnut781", name: "Wild Walnut 781", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853792/Wild_Walnut_781_Laminate_Flooring.png" }
];

const ceilings: ProductVariant[] = [
    { id: "c1", name: "Cobra Wenge", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478728/WPC_BAFFLE_CEILING.png" },
    { id: "c2", name: "Cobra Pure", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478721/WPC_BAFFLE_CEILING_goals_enterprises.png" },
    { id: "c3", name: "Cobra Nayur", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478727/WPC_BAFFLE_CEILING_3.png" },
];

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
    const controlsRef = useRef<any>(null);
    const [copied, setCopied] = useState(false);
    const [batchIndex, setBatchIndex] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

    useEffect(() => {
        setCopied(false);
    }, [selectedMesh]);

    useEffect(() => {
        setBatchIndex(0);
    }, [activeTab, currentRoomId]);

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

                    {/* BATCHED HORIZONTAL SWIPER PAGE OF 4 OPTIONS */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTab}-${batchIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 gap-4 min-h-[220px]"
                            >
                                {(() => {
                                    const activeList = activeTab === "wall" ? wallPanels : activeTab === "floor" ? flooring : ceilings;
                                    const itemsPerPage = 4;
                                    const currentBatch = activeList.slice(batchIndex * itemsPerPage, (batchIndex + 1) * itemsPerPage);
                                    
                                    return currentBatch.map((item) => (
                                        <button
                                            key={item.id}
                                            disabled={!selectedMesh}
                                            onClick={() => applyTexture(item.textureUrl)}
                                            className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${!selectedMesh ? "opacity-50 grayscale cursor-not-allowed" : "hover:scale-105"}`}
                                            style={{ borderColor: selectedMesh && appliedTextures[selectedMesh.toLowerCase()] === item.textureUrl ? "#9333ea" : "transparent" }}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image src={item.textureUrl} alt={item.name} fill sizes="150px" className="object-cover group-hover:scale-110 transition-transform" />
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
                            const activeList = activeTab === "wall" ? wallPanels : activeTab === "floor" ? flooring : ceilings;
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
