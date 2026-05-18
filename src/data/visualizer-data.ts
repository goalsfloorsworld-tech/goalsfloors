// --- TYPES ---
export interface MeshMappingDetail {
    meshes: string[];
    tiling: { x: number; y: number };
}

export interface RoomConfig {
    id: string;
    name: string;
    modelUrl: string;
    meshMapping: {
        walls: MeshMappingDetail;
        floors: MeshMappingDetail;
        ceilings: MeshMappingDetail;
    };
}

export interface ProductVariant {
    id: string;
    name: string;
    textureUrl: string;
}

export interface ProductSeries {
    id: string;
    name: string;
    description?: string;
    thumbnailUrl: string;
    variants: ProductVariant[];
}

export interface RoomProps {
    appliedTextures: Record<string, string>;
    appliedTiling: Record<string, { x: number; y: number }>;
    selectedMesh: string | null;
    setSelectedMesh: (name: string) => void;
    activeRoom: RoomConfig;
}

// --- ROOM CONFIGURATION REGISTRY ---
export const ROOM_CONFIGS: RoomConfig[] = [
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
];

// --- WALL SERIES ---
export const wallSeries: ProductSeries[] = [
    {
        id: "wp_primo_fluted",
        name: "Primo Fluted Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png",
        variants: [
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
            { id: "wp_713", name: "FP-713", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_713.png" }
        ]
    },
    {
        id: "wp_metallic_fluted",
        name: "Metallic Fluted Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776832078/Metallic_Fluted_Panel.jpg",
        variants: [
            { id: "wp_met_silver", name: "Silver Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Silver_Metallic.png" },
            { id: "wp_met_gold", name: "Gold Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Gold_Mettalic.png" },
            { id: "wp_met_copper", name: "Copper Metallic", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_Copper_Mettalic.png" },
            { id: "wp_met_fluted", name: "Metallic Fluted", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776832078/Metallic_Fluted_Panel.jpg" }
        ]
    },
    {
        id: "wp_elite_fluted",
        name: "Elite Fluted Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png",
        variants: [
            { id: "wp_714", name: "FP-714", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png" },
            { id: "wp_715", name: "FP-715", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_715.png" },
            { id: "wp_716", name: "FP-716", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_716.png" },
            { id: "wp_717", name: "FP-717", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_717.png" },
            { id: "wp_718", name: "FP-718", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_718.png" },
            { id: "wp_719", name: "FP-719", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_719.png" },
            { id: "wp_720", name: "FP-720", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_720.png" },
            { id: "wp_721", name: "FP-721", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_721.png" },
            { id: "wp_722", name: "FP-722", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_722.png" }
        ]
    },
    {
        id: "wp_elite_pvc",
        name: "Elite PVC Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png",
        variants: [
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
            { id: "wp_gf412", name: "GF-412", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777056/GF_-_412_12_inch_pvc_panel.png" }
        ]
    },
    {
        id: "wp_primo_pvc_1",
        name: "Primo PVC Series (301-312)",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png",
        variants: [
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
            { id: "wp_gf312", name: "GF-312", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779866/GF-312_Pvc_Panel_Wooden_Color.png" }
        ]
    },
    {
        id: "wp_primo_pvc_2",
        name: "Primo PVC Series (313-324)",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779864/GF-313_White_Color_Pvc_Panel.png",
        variants: [
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
            { id: "wp_gf324", name: "GF-324", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776779855/GF-324_Stone_Look_PVC_Panel.png" }
        ]
    },
    {
        id: "wp_17mm_louver",
        name: "Premium 17mm WPC Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477072/17mm_Wpc_Fluted_Panel.png",
        variants: [
            { id: "wp_17_black", name: "Premium Black Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Premium_Black_Color_WPC_Louvers.png" },
            { id: "wp_17_pencil", name: "Pencilclad Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477063/Pencilclad_Wpc_Louvers_2.png" },
            { id: "wp_17_fluted", name: "Fluted Panel Texture", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477066/Wpc_Fluted_Panel.png" },
            { id: "wp_17_image", name: "Imageclad Louver", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477069/Imageclad_Premium_Wpc_Louvers.png" },
            { id: "wp_17_premium", name: "Premium Fluted Panel", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477072/17mm_Wpc_Fluted_Panel.png" }
        ]
    }
];

// --- FLOOR SERIES ---
export const floorSeries: ProductSeries[] = [
    {
        id: "f_spc_silver",
        name: "SPC Cobra Silver Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452465/G-F_SPC_295.avif",
        variants: [
            { id: "f_spc295", name: "G-F SPC 295", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452465/G-F_SPC_295.avif" },
            { id: "f_spc296", name: "G-F SPC 296", textureUrl: "https://res.cloudinary.com/v1779019189/G-F_SPC_296.png" },
            { id: "f_spc297", name: "G-F SPC 297", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_297.avif" },
            { id: "f_spc298", name: "G-F SPC 298", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_298.avif" },
            { id: "f_spc299", name: "G-F SPC 299", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_299.avif" },
            { id: "f_spc300", name: "G-F SPC 300", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452460/G-F_SPC_300.avif" }
        ]
    },
    {
        id: "f_spc_ash",
        name: "SPC Smoked Ash Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453026/G-F_SPC_301.avif",
        variants: [
            { id: "f_spc301", name: "G-F SPC 301", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453026/G-F_SPC_301.avif" },
            { id: "f_spc302", name: "G-F SPC 302", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453027/G-F_SPC_302.avif" },
            { id: "f_spc303", name: "G-F SPC 303", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453027/G-F_SPC_303.avif" },
            { id: "f_spc304", name: "G-F SPC 304", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453026/G-F_SPC_304.avif" },
            { id: "f_spc305", name: "G-F SPC 305", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453031/G-F_SPC_305.avif" },
            { id: "f_spc306", name: "G-F SPC 306", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453031/G-F_SPC_306.avif" }
        ]
    },
    {
        id: "f_spc_herringbone",
        name: "SPC Herringbone Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453460/H-GREY.avif",
        variants: [
            { id: "f_hgrey", name: "H-GREY", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453460/H-GREY.avif" },
            { id: "f_hbrown", name: "H-BROWN", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453460/H-BROWN.avif" },
            { id: "f_hgazlenut", name: "H-GAZLENUT", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775453464/H-GAZLENUT.avif" }
        ]
    },
    {
        id: "f_classic_laminate",
        name: "Classic Laminate Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/oak_color_laminate_flooring.png",
        variants: [
            { id: "f_cl_walnut", name: "Walnut Color", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/walnut_color_laminate_flooring.png" },
            { id: "f_cl_borneo", name: "Borneo Merbau", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/borneo_merbau_laminate_flooring.png" },
            { id: "f_cl_wheat", name: "Oak Wheat", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544839/oak_wheat_laminate_flooring_8mm.png" },
            { id: "f_cl_montana", name: "Walnut Montana Limed", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544839/Walnut_Montana_Limed_Laminate_flooring.png" },
            { id: "f_cl_oak", name: "Oak Color", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/oak_color_laminate_flooring.png" },
            { id: "f_cl_studio", name: "Studioline Walnut", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/Studioline_Walnut_Laminate_Flooring.png" },
            { id: "f_cl_classicoak", name: "Classic Oak", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/8mm_laminate_flooring_in_gurgaon.png" },
            { id: "f_cl_halifax", name: "Natural Halifax", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/Natural_Halifax_Oak_Laminate_flooring.png" },
            { id: "f_cl_grey", name: "Grey Bleached", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544838/Grey_Bleached_Laminate_Flooring.png" },
            { id: "f_cl_teak", name: "Golden Teak", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544837/Golden_Teak_Laminate_Flooring.png" }
        ]
    },
    {
        id: "f_majestic_laminate",
        name: "Majestic Laminate Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776853814/Blanche_Oak_783_Laminate_Flooring.png",
        variants: [
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
        ]
    }
];

// --- CEILING SERIES ---
export const ceilingSeries: ProductSeries[] = [
    {
        id: "c_baffle_series",
        name: "Baffle Ceiling Series",
        thumbnailUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478728/WPC_BAFFLE_CEILING.png",
        variants: [
            { id: "c1", name: "Cobra Wenge", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478728/WPC_BAFFLE_CEILING.png" },
            { id: "c2", name: "Cobra Pure", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478721/WPC_BAFFLE_CEILING_goals_enterprises.png" },
            { id: "c3", name: "Cobra Nayur", textureUrl: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478727/WPC_BAFFLE_CEILING_3.png" }
        ]
    }
];
