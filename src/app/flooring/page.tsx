import ProductDetailPage from "../products/[slug]/page";

export default function FlooringPage() {
  return <ProductDetailPage params={Promise.resolve({ slug: "luxury-flooring" })} />;
}
