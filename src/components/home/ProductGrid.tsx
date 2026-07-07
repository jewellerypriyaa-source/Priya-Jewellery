import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryName?: string;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  viewAllHref,
}: ProductGridProps) {
  if (!products.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2>{title}</h2>}
          <div className="section-divider">
            <span>✦</span>
          </div>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {viewAllHref && (
        <div className="text-center mt-10">
          <Link href={viewAllHref} className="btn-outline-gold px-8 py-2.5">
            View All →
          </Link>
        </div>
      )}
    </div>
  );
}
