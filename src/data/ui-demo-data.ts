export interface ProfileVariant {
  id: string;
  name: string;
  length: string;
  width: string;
  thickness: string;
  weight: string;
  price: string;
  mrp: string;
  discount: string;
  material: string;
  packing: string;
  packingType: string;
  application: string;
  images: string[];
}

export const dummyProfiles: ProfileVariant[] = [
  {
    id: "tm-22",
    name: "T-M 22mm",
    length: "2440mm (8feet)",
    width: "22mm",
    thickness: "12mm",
    weight: "0.175 Kg per Pc",
    price: "₹90 per pc",
    mrp: "₹140",
    discount: "35% off",
    material: "Pvc Calcium Composite",
    packing: "10 PCS",
    packingType: "Poly Pack",
    application: "Interior Walls & Ceilings",
    images: [
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Wpc_Baffle_For_Ceiling.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573399/Exterior_Louvers_For_Facade.png"
    ]
  },
  {
    id: "tm-30",
    name: "T-M 30mm",
    length: "2440mm (8feet)",
    width: "30mm",
    thickness: "16mm",
    weight: "0.22 Kg per Pc",
    price: "₹160 per pc",
    mrp: "₹245",
    discount: "34% off",
    material: "Pvc Calcium Composite",
    packing: "10 PCS",
    packingType: "Poly Pack",
    application: "Interior Walls & Ceilings",
    images: [
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573399/Exterior_Louvers_For_Facade.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Wpc_Baffle_For_Ceiling.png"
    ]
  },
  {
    id: "tm-38",
    name: "T-M 38mm",
    length: "2440mm (8feet)",
    width: "38mm",
    thickness: "20mm",
    weight: "0.5 Kg per Pc",
    price: "₹260 per pc",
    mrp: "₹399",
    discount: "34% off",
    material: "Pvc Calcium Composite",
    packing: "10 PCS",
    packingType: "Poly Pack",
    application: "Interior Walls & Ceilings",
    images: [
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Wpc_Baffle_For_Ceiling.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573399/Exterior_Louvers_For_Facade.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png"
    ]
  },
  {
    id: "tm-45",
    name: "T-M 45mm",
    length: "2440mm (8feet)",
    width: "45mm",
    thickness: "23mm",
    weight: "0.8 Kg per Pc",
    price: "₹360 per pc",
    mrp: "₹550",
    discount: "34% off",
    material: "Pvc Calcium Composite",
    packing: "10 PCS",
    packingType: "Poly Pack",
    application: "Interior Walls & Ceilings",
    images: [
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573398/Premium_Quality_Pu_Stones_For_Wall.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573400/Laminate_Flooring_Grey_Color.png",
      "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png"
    ]
  }
];
