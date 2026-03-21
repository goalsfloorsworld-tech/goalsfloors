import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Ruler, Phone, ArrowLeft } from "lucide-react";

// 1. Import our master database
import productsData from "@/data/products.json";

// 2. Setup the Next.js Page Component
export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  // 3. Await the params before using them (Required in Next.js 15+)
  const { slug } = await params;

  // 4. Find the product that matches the URL slug
  const product = productsData.find((p) => p.slug === slug);

  // 4. If someone types a wrong URL, show Next.js 404 page automatically
  if (!product) {
    notFound();
  }

  // 5. If product is found, render the Premium UI
  return (
    <div className="bg-white min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb Navigation */}
        <Link href="/#categories" className="inline-flex items-center text-sm text-gray-500 hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side: Product Image Gallery */}
          <div className="relative h-[400px] md:h-[600px] rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
            {/* Note: In production, map through product.images array for a slider */}
            <Image 
              src={product.images[0]} 
              alt={product.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>

          {/* Right Side: Product Data & Sales Funnel */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              {product.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 mb-10 border-y border-gray-100 py-8">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Technical Specifications */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gray-400" /> Technical Specs
              </h3>
              <div className="bg-gray-50 p-6 border border-gray-100 rounded-sm space-y-3">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/contact?product=${product.slug}`} 
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-amber-600 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all shadow-lg w-full"
              >
                Request Free Quote
              </Link>
              <a 
                href="tel:+917217644573" 
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-50 text-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all w-full sm:w-auto"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}