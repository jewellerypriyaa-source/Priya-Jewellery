import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import ProductsTableClient from "./ProductsTableClient";

export const dynamic = "force-dynamic";


export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-maroon flex items-center gap-2 text-sm"
          id="add-product-btn"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <ProductsTableClient
        initialProducts={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          mrp: p.mrp,
          stockStatus: p.stockStatus,
          stockQty: p.stockQty,
          isPublished: p.isPublished,
          isBestseller: p.isBestseller,
          isNewArrival: p.isNewArrival,
          categoryName: p.category.name,
          imageUrl: p.images[0]?.url ?? null,
        }))}
      />
    </div>
  );
}
