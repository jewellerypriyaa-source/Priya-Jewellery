/**
 * WhatsApp URL Builders
 * Single source of truth for all WhatsApp deep-link generation.
 * The business number is pulled from the database Settings record
 * or falls back to the env variable.
 */

const DEFAULT_WA_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917367997766";

const DEFAULT_TEMPLATE = `Hi Priya Jewellery! I am interested in:
🛍️ {product_name}
💰 Rs.{price}
📏 {variant}
🔗 {url}
Please confirm availability and delivery details.`;

interface BuildOrderMessageOptions {
  productName: string;
  price: number;
  variant?: string;
  productUrl: string;
  waNumber?: string;
  template?: string;
}

/**
 * Build a WhatsApp URL for ordering a single product
 */
export function buildOrderUrl(opts: BuildOrderMessageOptions): string {
  const {
    productName,
    price,
    variant,
    productUrl,
    waNumber = DEFAULT_WA_NUMBER,
    template = DEFAULT_TEMPLATE,
  } = opts;

  const message = template
    .replace("{product_name}", productName)
    .replace("{price}", price.toFixed(0))
    .replace("{variant}", variant ?? "N/A")
    .replace("{url}", productUrl);

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

interface WishlistItem {
  name: string;
  price: number;
  slug: string;
}

/**
 * Build a WhatsApp URL for ordering multiple wishlist items at once
 */
export function buildWishlistUrl(
  items: WishlistItem[],
  waNumber: string = DEFAULT_WA_NUMBER,
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
): string {
  const lines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} — Rs.${item.price.toFixed(0)}\n   ${siteUrl}/product/${item.slug}`
    )
    .join("\n");

  const message = `Hi Priya Jewellery! I'm interested in ordering these items from my wishlist:\n\n${lines}\n\nCould you please confirm availability and delivery details?`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a WhatsApp URL for "Notify me when back in stock" requests
 */
export function buildNotifyUrl(
  productName: string,
  productUrl: string,
  waNumber: string = DEFAULT_WA_NUMBER
): string {
  const message = `Hi Priya Jewellery! I'd like to be notified when "${productName}" is back in stock.\n🔗 ${productUrl}`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a direct WhatsApp chat URL (no pre-filled message)
 */
export function buildDirectChatUrl(
  waNumber: string = DEFAULT_WA_NUMBER
): string {
  return `https://wa.me/${waNumber}`;
}
