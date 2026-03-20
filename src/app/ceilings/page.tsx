import ProductDetailPage from "../products/[slug]/page";

export default function CeilingsPage() {
  return <ProductDetailPage params={Promise.resolve({ slug: "baffle-ceilings" })} />;
}
