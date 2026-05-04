/**
 * Stock photos from Pexels (free use: https://www.pexels.com/license/).
 * Do not use Instagram/Google redirect URLs in <img> — they expire or block hotlinking.
 */
const q = "auto=compress&cs=tinysrgb&w=1200&q=80";

export const stockImages = {
  /** Local wedding images */
  weddingImage1: "/image.png",
  weddingImage2: "/image1.png",
  weddingImage3: "/image2.png",
  weddingImage4: "/image3.png",
  /** Traditional Nepali wedding couple — matches user reference (Pexels #29137533) — hero slide 1 */
  nepaliWedding: `https://images.pexels.com/photos/29137533/pexels-photo-29137533.jpeg?${q}`,
  /** Hero slideshow slides 2–4 only (other sections still use couple1–3) */
  heroSlide2: `https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?${q}`,
  heroSlide3: `https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?${q}`,
  heroSlide4: `https://images.pexels.com/photos/1516039/pexels-photo-1516039.jpeg?${q}`,
  couple1: `https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?${q}`,
  couple2: `https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?${q}`,
  couple3: `https://images.pexels.com/photos/1183622/pexels-photo-1183622.jpeg?${q}`,
} as const;
