import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
  title: "Men Leather Jacket",
  description: "Premium biker style leather jacket",
  price: 6999,
  category: "clothing",
  images: [
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80",
    "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80"
  ],
  attributes: {
    brand: "RogueWear",
    material: "Leather",
    fit: "Regular",
    gender: "Men",
  },
  variants: {
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
  },
},

{
  title: "Women Summer Dress",
  description: "Floral lightweight summer dress",
  price: 2799,
  category: "clothing",
  images: [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80"
  ],
  attributes: {
    brand: "BloomStyle",
    material: "Polyester",
    fit: "Slim",
    gender: "Women",
  },
  variants: {
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red", "Yellow", "White"],
  },
},

{
  title: "4K Ultra HD Smart TV",
  description: "55 inch 4K Smart LED TV with HDR support",
  price: 45999,
  category: "electronics",
  images: [
    "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80",
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
    "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80"
  ],
  attributes: {
    brand: "ViewMax",
    resolution: "4K UHD",
    size: "55 inch",
  },
  variants: null,
},

{
  title: "Men Sports Shorts",
  description: "Breathable quick-dry sports shorts",
  price: 1199,
  category: "clothing",
  images: [
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
  ],
  attributes: {
    brand: "ActiveRun",
    material: "Polyester",
    fit: "Regular",
    gender: "Men",
  },
  variants: {
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Blue"],
  },
},

{
  title: "Wireless Earbuds",
  description: "True wireless earbuds with charging case",
  price: 3499,
  category: "electronics",
  images: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
  ],
  attributes: {
    brand: "SoundBeat",
    battery: "24h",
    connectivity: "Bluetooth 5.3",
  },
  variants: null,
},

{
  title: "Women Running Shoes",
  description: "Lightweight running shoes for daily training",
  price: 4299,
  category: "footwear",
  images: [
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"
  ],
  attributes: {
    brand: "RunFlex",
    sole: "Rubber",
    purpose: "Running",
  },
  variants: {
    sizes: [5, 6, 7, 8, 9],
    colors: ["Pink", "White", "Black"],
  },
},

{
  title: "Mechanical Keyboard RGB",
  description: "Blue switch mechanical keyboard with RGB",
  price: 4999,
  category: "electronics",
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
  ],
  attributes: {
    brand: "KeyStorm",
    switches: "Blue",
    connectivity: "Wired",
  },
  variants: null,
},

{
  title: "Classic Analog Watch",
  description: "Minimal stainless steel analog watch",
  price: 2599,
  category: "accessories",
  images: [
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800&q=80",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80"
  ],
  attributes: {
    brand: "TimeCraft",
    material: "Stainless Steel",
    type: "Analog",
  },
  variants: {
    colors: ["Silver", "Black"],
  },
},

{
  title: "Travel Suitcase",
  description: "Hard shell suitcase with 360° wheels",
  price: 5499,
  category: "accessories",
  images: [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
  ],
  attributes: {
    brand: "SkyTravel",
    material: "Polycarbonate",
    capacity: "Medium",
  },
  variants: {
    colors: ["Blue", "Black", "Grey"],
  },
},

{
  title: "Yoga Mat",
  description: "Anti-slip eco-friendly yoga mat",
  price: 999,
  category: "fitness",
  images: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
  ],
  attributes: {
    brand: "ZenFlex",
    material: "Eco Rubber",
    thickness: "6mm",
  },
  variants: {
    colors: ["Purple", "Green", "Black"],
  },
},

    ],
  });

  console.log("✅ Products seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
