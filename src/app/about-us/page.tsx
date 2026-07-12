import prisma from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "About Us — Priya Jewellery",
  description: "Learn about the heritage, craftsmanship, and story of Priya Jewellery. Exquisite handcrafted traditional and contemporary collections.",
};

export default async function AboutUsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "main" } });
  const storeName = settings?.storeName || "Priya Jewellery";

  return (
    <div className="min-h-screen bg-cream-100/50">
      
      {/* Hero Section */}
      <section 
        className="relative py-24 text-center text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a0e 0%, #3d0b15 50%, #6b1a2a 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-300 via-transparent to-transparent" />
        
        <div className="relative max-w-3xl mx-auto px-4 z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-400 mb-3 font-semibold">
            Our Heritage
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight" style={{ color: "#e6c97a" }}>
            The Story of {storeName}
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
            Crafting premium, hand-finished traditional and contemporary jewellery that celebrates life's most precious milestones.
          </p>
        </div>
      </section>

      {/* Brand Heritage Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Story Text */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-maroon-950 mb-2 leading-tight">
              Timeless Artistry, Made Accessible
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mb-6" />
            
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              Established with a deep passion for heritage Indian craftsmanship, <strong>{storeName}</strong> has become a beloved destination for fine jewellery. Based in Howrah, West Bengal, we bring together royal traditional styles and elegant modern trends.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              We specialize in a diverse array of collections. From the regal splendour of <strong>Polki Kundan</strong> bridal sets and 1.5-gram <strong>Gold Plated</strong> classics to contemporary <strong>Anti-Tarnish</strong> everyday wear, <strong>American Diamond</strong> sparkle, and boho-chic <strong>German Silver &amp; Oxidised</strong> jewelry—each piece is selected for its superior finish, weight, and lasting lustre.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our philosophy is simple: luxury should not be locked in a safe. We craft ornaments that make you feel exceptional every day, backed by the ease of instant WhatsApp ordering and personalized client support.
            </p>
          </div>

          {/* Visual Presentation Card */}
          <div 
            className="rounded-3xl p-8 md:p-12 text-center border shadow-xl relative overflow-hidden flex flex-col justify-center items-center min-h-[350px]"
            style={{
              background: "linear-gradient(135deg, #3d0b15, #1a0a0e)",
              borderColor: "rgba(201,168,76,0.3)",
            }}
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />
            
            <span className="text-gold-400 text-5xl mb-6 block">✦</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              Designed For You
            </h3>
            <p className="text-gray-300 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
              "A piece of jewellery is more than an accessory—it is an expression of your grace, heritage, and unique journey."
            </p>
            <Link 
              href="/shop"
              className="btn-gold px-8 py-3 text-sm font-semibold tracking-wider uppercase transition-all hover:scale-105"
            >
              Browse Collections
            </Link>
          </div>

        </div>
      </section>

      {/* Core Values / Features Grid */}
      <section className="bg-white py-20 px-4 md:px-8 border-t border-b border-cream-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-maroon-950 mb-2">
              Our Commitments
            </h2>
            <p className="text-gray-500 text-sm">
              The foundations on which we build your trust
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="p-6 text-center space-y-3 bg-cream-100/30 rounded-2xl border border-cream-100">
              <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-900 mx-auto">
                <Sparkles size={20} className="text-gold-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">Royal Polish</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Featuring authentic 1.5g gold plating and brilliant hand-set cubic zirconia for a premium finish.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 text-center space-y-3 bg-cream-100/30 rounded-2xl border border-cream-100">
              <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-900 mx-auto">
                <ShieldCheck size={20} className="text-gold-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">Lustre Protection</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our innovative anti-tarnish alloys ensure long-lasting brilliance for everyday comfort and durability.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 text-center space-y-3 bg-cream-100/30 rounded-2xl border border-cream-100">
              <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-900 mx-auto">
                <Award size={20} className="text-gold-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">Bespoke Curation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Carefully hand-curated designs from heritage bridal sets to bohemian oxidised necklaces.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-6 text-center space-y-3 bg-cream-100/30 rounded-2xl border border-cream-100">
              <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-900 mx-auto">
                <Heart size={20} className="text-gold-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">Personal Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Order easily via WhatsApp with direct help from our team on sizing, styling, and safe delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
