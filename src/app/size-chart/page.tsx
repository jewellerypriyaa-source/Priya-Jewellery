import prisma from "@/lib/prisma";
import { Ruler, Sparkles, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Jewellery Size Chart — Priya Jewellery",
  description: "Find your perfect fit. View our detailed ring size, bangle size, and necklace length measurement guide.",
};

export default async function SizeChartPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "main" } });
  const storeName = settings?.storeName || "Priya Jewellery";

  const ringSizes = [
    { size: "10", diameter: "15.9 mm", circumference: "50.0 mm" },
    { size: "12", diameter: "16.5 mm", circumference: "51.8 mm" },
    { size: "14", diameter: "17.2 mm", circumference: "54.0 mm" },
    { size: "16", diameter: "17.8 mm", circumference: "55.9 mm" },
    { size: "18", diameter: "18.5 mm", circumference: "58.1 mm" },
    { size: "20", diameter: "19.1 mm", circumference: "60.0 mm" },
  ];

  const bangleSizes = [
    { size: "2.4", diameter: '2.25" (57.2 mm)', circumference: '7.06" (179.4 mm)' },
    { size: "2.6", diameter: '2.37" (60.3 mm)', circumference: '7.46" (189.6 mm)' },
    { size: "2.8", diameter: '2.50" (63.5 mm)', circumference: '7.85" (199.4 mm)' },
    { size: "2.10", diameter: '2.62" (66.7 mm)', circumference: '8.24" (209.3 mm)' },
  ];

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-cream-100/50">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-3 font-semibold">
            Fitting Guide
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-maroon-950 mb-4 leading-tight">
            Jewellery Size Charts
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-5" />
          <p className="text-gray-600 text-sm md:text-base">
            To ensure your {storeName} selections fit you perfectly, we have prepared this comprehensive sizing guide for rings, bangles, and necklaces.
          </p>
        </div>

        {/* Section 1: Ring Sizes */}
        <section className="bg-white rounded-3xl border border-cream-200/60 p-6 md:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600">
              <Ruler size={18} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-maroon-950">Ring Size Chart</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Indian Size</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Inner Diameter</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Inner Circumference</th>
                  </tr>
                </thead>
                <tbody>
                  {ringSizes.map((row) => (
                    <tr key={row.size} className="border-b border-cream-100 hover:bg-cream-50/40">
                      <td className="py-3.5 px-4 font-semibold text-maroon-900 text-sm">Size {row.size}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm">{row.diameter}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm">{row.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-5 bg-cream-50/50 p-6 rounded-2xl border border-cream-200/40 space-y-4">
              <h3 className="font-serif text-lg font-bold text-maroon-950">How to measure at home:</h3>
              <ol className="list-decimal pl-5 text-xs text-gray-600 space-y-2.5">
                <li>Wrap a thin strip of paper or string around the base of the finger you wish to measure.</li>
                <li>Ensure the paper is snug but can slide comfortably over your knuckle.</li>
                <li>Mark the exact point where the paper overlaps.</li>
                <li>Measure the length of the paper strip in millimetres against a ruler to find your <strong>Circumference</strong>.</li>
                <li>Match the circumference value against the chart to find your perfect Indian ring size.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 2: Bangle Sizes */}
        <section className="bg-white rounded-3xl border border-cream-200/60 p-6 md:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600">
              <Sparkles size={18} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-maroon-950">Bangle Size Chart</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Bangle Size</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Inner Diameter</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-sm">Inner Circumference</th>
                  </tr>
                </thead>
                <tbody>
                  {bangleSizes.map((row) => (
                    <tr key={row.size} className="border-b border-cream-100 hover:bg-cream-50/40">
                      <td className="py-3.5 px-4 font-semibold text-maroon-900 text-sm">Size {row.size}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm">{row.diameter}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm">{row.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-5 bg-cream-50/50 p-6 rounded-2xl border border-cream-200/40 space-y-4">
              <h3 className="font-serif text-lg font-bold text-maroon-950">Bangle sizing tip:</h3>
              <ol className="list-decimal pl-5 text-xs text-gray-600 space-y-2.5">
                <li>Bring your thumb and little finger together closely as if sliding a bangle on.</li>
                <li>Wrap a string or measuring tape around the widest part of your hand (the knuckles).</li>
                <li>Mark the overlapping point and measure the length in inches to find your hand's <strong>Circumference</strong>.</li>
                <li>Compare this knuckle circumference to find the correct bangle size: 7.0" is size 2.4, 7.5" is size 2.6, 7.9" is size 2.8, and 8.25" is size 2.10.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 3: Necklace Lengths */}
        <section className="bg-white rounded-3xl border border-cream-200/60 p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600">
              <AlertCircle size={18} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-maroon-950">Necklace Length Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 border border-cream-200/60 rounded-xl space-y-2">
              <h3 className="font-serif font-bold text-maroon-900 text-base">Choker (14"–16")</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sits closely around the base of the throat. Ideal for framing boat necklines, off-shoulder ensembles, or layering with longer necklaces.
              </p>
            </div>
            <div className="p-5 border border-cream-200/60 rounded-xl space-y-2">
              <h3 className="font-serif font-bold text-maroon-900 text-base">Princess (17"–19")</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The most popular and versatile length. Sits gracefully near the collarbone and flatters round, scoop, and plunging necklines.
              </p>
            </div>
            <div className="p-5 border border-cream-200/60 rounded-xl space-y-2">
              <h3 className="font-serif font-bold text-maroon-900 text-base">Matinee (20"–24")</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sits just above or at the cleavage. Excellent choice for high collars, formal office wear, or creating depth in layered stacks.
              </p>
            </div>
            <div className="p-5 border border-cream-200/60 rounded-xl space-y-2">
              <h3 className="font-serif font-bold text-maroon-900 text-base">Opera (28"–36")</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A long, majestic drape that drops below the bust. Perfect for traditional long Sita Hars, Rani Hars, and formal ethnic celebrations.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
