import SearchPageClient from "./SearchPageClient";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search Results — Priya Jewellery",
  description: "Search results for jewellery items.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading search...</div>}>
      <SearchPageClient initialQuery={sp.q ?? ""} />
    </Suspense>
  );
}
