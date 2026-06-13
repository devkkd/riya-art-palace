import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";

export const categories = [
  "Wall Décor","Table Décor","Lac Collection","Event Décor","Festive Collection",
  "Rajasthani Traditional","Handmade Accessories","Spiritual Items",
  "Handpainted Articles","Diary Collection","Christmas Items","Ottomans & Puffs",
];

export const subCategories = [
  "All Products","Rajasthani Wall Hanging","Wall Hangings","Torans","Fancy Hangings",
  "Marigold Toran","Marigold Flower Hangings","Wind Chimes","Dream Catcher","Prosperity Hangings",
];

export const moqOptions = ["1 - 100 pcs","100 - 500 pcs","500 - 1000 pcs","1000+ pcs"];
export const sortOptions = ["Recommended","New Arrivals","Price High to Low","Price Low to High"];

export const products = [
  {
    id: 1, slug: "pom-pom-wall-hangings-1",
    name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM",
    images: [p1, p2, p3, p4],
    description: "The Combination Of Soft Pom-poms And Shimmering Gota Lace Creates A Lively Ethnic Look That Beautifully Reflects Traditional Indian Craftsmanship. Lightweight And Easy To Hang, It Is Ideal For Diwali Decor, Mehendi Functions, Holi Ceremonies, Return Gifts, And Bohemian-themed Interiors. Stylish, Colorful, And Eye-catching, This Handmade Hanging Adds Warmth, Joy, And Cultural Elegance To Every Setting.",
    specs: {
      "Product Type": "Wall Hanging",
      "Primary Material": "Gota And POM POM",
      "Style": "Traditional",
      "Set Type": "Single Piece",
      "Color": "Multicolor",
      "Size Category": "Large",
      "Theme": "Festive",
      "Usage Area": "Entrance, Office, Bedroom, Temple, Living Room, Cafe, Hotel, Balcony, Kids Room",
    },
  },
  { id: 2,slug: "pom-pom-wall-hangings-2",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p2, p1, p4, p3], description: "Handcrafted with vibrant Gota lace and soft Pom Poms, this wall hanging brings festive color to any space. Perfect for gifting or home decoration.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Medium", "Theme": "Festive", "Usage Area": "Entrance, Bedroom, Living Room" } },
  { id: 3,
    slug: "pom-pom-wall-hangings-3",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p3, p4, p1, p2], description: "Handcrafted with vibrant Gota lace and soft Pom Poms, this wall hanging brings festive color to any space. Perfect for gifting or home decoration.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom, Living Room" } },
  { id: 4,
    slug: "pom-pom-wall-hangings-4",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p4, p3, p2, p1], description: "Handcrafted with vibrant Gota lace and soft Pom Poms, this wall hanging brings festive color to any space. Perfect for gifting or home decoration.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Medium", "Theme": "Festive", "Usage Area": "Entrance, Bedroom, Living Room" } },
  { id: 5,
    slug: "pom-pom-wall-hangings-5",
 name: "Pom Pom Wall Hangings-6", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p1, p3, p2, p4], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 6,
    slug: "pom-pom-wall-hangings-7",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p2, p4, p3, p1], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 7,slug: "pom-pom-wall-hangings-8",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p3, p1, p4, p2], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 8,
    slug: "pom-pom-wall-hangings-9",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p4, p2, p1, p3], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 9,
    slug: "pom-pom-wall-hangings-10",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p1, p4, p3, p2], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 10,
    slug: "pom-pom-wall-hangings-11",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p2, p3, p4, p1], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 11,
    slug: "pom-pom-wall-hangings-12",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p3, p2, p1, p4], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
  { id: 12,
    slug: "pom-pom-wall-hangings-13",
 name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", images: [p4, p1, p2, p3], description: "Handcrafted with vibrant Gota lace and soft Pom Poms.", specs: { "Product Type": "Wall Hanging", "Primary Material": "Gota And POM POM", "Style": "Traditional", "Set Type": "Single Piece", "Color": "Multicolor", "Size Category": "Large", "Theme": "Festive", "Usage Area": "Entrance, Bedroom" } },
];