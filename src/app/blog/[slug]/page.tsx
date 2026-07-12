import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";
import Link from "next/link";
import { Calendar, Clock, ChevronLeft } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — Priya Jewellery Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get 3 related posts (excluding the current one)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-cream-100/50">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors uppercase tracking-wider mb-8 gap-1.5"
        >
          <ChevronLeft size={16} />
          Back to Journal
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-cream-200/60 p-6 md:p-12 shadow-sm mb-12">
          {/* Category Tag */}
          <span className="text-[10px] tracking-widest font-bold uppercase text-gold-600 bg-gold-50 px-2.5 py-1 rounded-md mb-6 inline-block">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-maroon-950 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-xs text-gray-400 border-b border-cream-100 pb-6 mb-8 font-light">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-gray-500 font-light text-base md:text-lg italic border-l-2 border-gold-400 pl-4 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Body Content */}
          <div 
            className="prose prose-maroon max-w-none text-gray-700 leading-relaxed space-y-6 text-sm md:text-base font-light blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-cream-200 pt-12">
            <h2 className="font-serif text-2xl font-bold text-maroon-950 mb-8 text-center md:text-left">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link 
                  href={`/blog/${p.slug}`} 
                  key={p.id}
                  className="bg-white p-6 rounded-2xl border border-cream-200/60 shadow-sm hover:shadow-md transition-all duration-300 block group"
                >
                  <span className="text-[9px] tracking-widest font-bold uppercase text-gold-600 block mb-2">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-maroon-950 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-4">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
