import ProductDetailPage from "../products/[slug]/page";

export default function WallPanelsPage() {
  return <ProductDetailPage params={Promise.resolve({ slug: "wall-panels" })} />;
}
