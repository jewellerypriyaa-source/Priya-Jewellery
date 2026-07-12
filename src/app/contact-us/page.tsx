import prisma from "@/lib/prisma";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { cleanWhatsAppNumber } from "@/lib/whatsapp";

export const metadata = {
  title: "Contact Us — Priya Jewellery",
  description: "Get in touch with Priya Jewellery. Visit our boutique in Howrah or contact us via WhatsApp, call, or email.",
};

export default async function ContactUsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "main" } });

  const phone = settings?.phone || "+91 7367997766";
  const email = settings?.email || "info@priyajewellery.com";
  const address = settings?.address || "Shop no 137 First floor, SALKIA AC MARKET, 95/A, Aurobindo Road, Infront of Baro Sitla Mata Mandir, Salkia, Howrah, West Bengal 711106";
  const businessHours = settings?.businessHours || "";
  const whatsappNumber = settings?.whatsappNumber || "917367997766";

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-cream-100/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-3 font-semibold">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-maroon-950 mb-4 leading-tight">
            Connect With Us
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-5" />
          <p className="text-gray-600 text-base md:text-lg">
            Have questions about our collections, custom designs, or order support? Reach out and our team will assist you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Info Details (Left Column) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-cream-200/60 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-maroon-950 mb-4">
                Boutique Info
              </h2>

              {/* Address */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 text-gold-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Our Location</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 text-gold-600">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Phone & Support</h3>
                  <p className="text-sm text-gray-600 mb-1">{phone}</p>
                  <a 
                    href={`https://wa.me/${cleanWhatsAppNumber(whatsappNumber)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    💬 WhatsApp Chat Now
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 text-gold-600">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Email Inquiries</h3>
                  <p className="text-sm text-gray-600">{email}</p>
                </div>
              </div>

              {/* Hours */}
              {businessHours && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 text-gold-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">Boutique Hours</h3>
                    <p className="text-sm text-gray-600 mb-1">{businessHours}</p>
                    <p className="text-[11px] text-gray-400">Sundays Closed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Details (Right Column) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-cream-200/60 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-maroon-950 mb-3">
              Send a Message
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Leave your details below and a jewellery specialist will reach out to you on phone or WhatsApp.
            </p>
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
}
