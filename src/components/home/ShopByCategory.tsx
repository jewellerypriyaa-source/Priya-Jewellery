import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

interface ShopByCategoryProps {
  categories: Category[];
}

export default function ShopByCategory({ categories }: ShopByCategoryProps) {
  if (!categories.length) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="section-header">
        <h2>Shop by Category</h2>
        <div className="section-divider">
          <span>✦</span>
        </div>
        <p>Find the perfect piece for every occasion</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-center">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className="group flex flex-col items-center gap-3"
            id={`category-link-${cat.slug}`}
          >
            {/* Circular image */}
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
              style={{
                borderColor: "#e6c97a",
                boxShadow: "0 4px 16px rgba(201,168,76,0.2)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="112px"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #f5ede0, #fadadd)",
                  }}
                >
                  💍
                </div>
              )}

              {/* Gold ring on hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "inset 0 0 0 3px rgba(201,168,76,0.6)",
                }}
              />
            </div>

            <span
              className="text-xs sm:text-sm font-semibold text-center transition-colors duration-200 group-hover:text-maroon-600"
              style={{ color: "#3d0b15" }}
            >
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
