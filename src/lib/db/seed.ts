import { db } from "./index";
import {
  products,
  cmsUsers,
  users,
  cartItems,
  carts,
  orderItems,
  orders,
  sessions,
} from "./schema";
import bcrypt from "bcryptjs";
import { generateSlug } from "../utils/slug";

const dummyProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    price: "299.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=1",
    slug: generateSlug("Wireless Noise-Cancelling Headphones"),
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring and GPS",
    price: "199.99",
    inventory: 75,
    imageUrl: "https://picsum.photos/400/300?random=2",
    slug: generateSlug("Smart Fitness Watch"),
  },
  {
    name: "Ultra HD 4K Monitor",
    description: "32-inch 4K display with HDR support and 144Hz refresh rate",
    price: "449.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=3",
    slug: generateSlug("Ultra HD 4K Monitor"),
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches",
    price: "129.99",
    inventory: 100,
    imageUrl: "https://picsum.photos/400/300?random=4",
    slug: generateSlug("Mechanical Gaming Keyboard"),
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with RGB lighting",
    price: "79.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=5",
    slug: generateSlug("Wireless Gaming Mouse"),
  },
  {
    name: "Portable Power Bank",
    description: "20000mAh power bank with fast charging support",
    price: "49.99",
    inventory: 200,
    imageUrl: "https://picsum.photos/400/300?random=6",
    slug: generateSlug("Portable Power Bank"),
  },
  {
    name: "Smart Home Security Camera",
    description: "1080p wireless security camera with night vision",
    price: "89.99",
    inventory: 80,
    imageUrl: "https://picsum.photos/400/300?random=7",
    slug: generateSlug("Smart Home Security Camera"),
  },
  {
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with 12-hour battery life",
    price: "69.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=8",
    slug: generateSlug("Bluetooth Speaker"),
  },
  {
    name: "USB-C Hub",
    description: "10-in-1 USB-C hub with HDMI and SD card reader",
    price: "39.99",
    inventory: 180,
    imageUrl: "https://picsum.photos/400/300?random=9",
    slug: generateSlug("USB-C Hub"),
  },
  {
    name: "Wireless Charging Pad",
    description: "15W fast wireless charging pad for smartphones",
    price: "29.99",
    inventory: 250,
    imageUrl: "https://picsum.photos/400/300?random=10",
    slug: generateSlug("Wireless Charging Pad"),
  },
  {
    name: "Smart LED Bulb",
    description: "WiFi-enabled color-changing LED bulb with voice control",
    price: "24.99",
    inventory: 300,
    imageUrl: "https://picsum.photos/400/300?random=11",
    slug: generateSlug("Smart LED Bulb"),
  },
  {
    name: "External SSD",
    description: "1TB portable SSD with USB 3.0 interface",
    price: "159.99",
    inventory: 60,
    imageUrl: "https://picsum.photos/400/300?random=12",
    slug: generateSlug("External SSD"),
  },
  {
    name: "Smart Door Lock",
    description: "Fingerprint and app-controlled smart door lock",
    price: "199.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=13",
    slug: generateSlug("Smart Door Lock"),
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with noise cancellation",
    price: "149.99",
    inventory: 90,
    imageUrl: "https://picsum.photos/400/300?random=14",
    slug: generateSlug("Wireless Earbuds"),
  },
  {
    name: "Smart Thermostat",
    description: "WiFi-enabled smart thermostat with energy savings",
    price: "179.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=15",
    slug: generateSlug("Smart Thermostat"),
  },
  {
    name: "Gaming Headset",
    description: "7.1 surround sound gaming headset with microphone",
    price: "89.99",
    inventory: 110,
    imageUrl: "https://picsum.photos/400/300?random=16",
    slug: generateSlug("Gaming Headset"),
  },
  {
    name: "Smart Scale",
    description: "Body composition smart scale with app sync",
    price: "49.99",
    inventory: 85,
    imageUrl: "https://picsum.photos/400/300?random=17",
    slug: generateSlug("Smart Scale"),
  },
  {
    name: "Portable Projector",
    description: "Mini portable projector with built-in speakers",
    price: "299.99",
    inventory: 25,
    imageUrl: "https://picsum.photos/400/300?random=18",
    slug: generateSlug("Portable Projector"),
  },
  {
    name: "Smart Doorbell",
    description: "Video doorbell with motion detection",
    price: "129.99",
    inventory: 70,
    imageUrl: "https://picsum.photos/400/300?random=19",
    slug: generateSlug("Smart Doorbell"),
  },
  {
    name: "Wireless Mouse Pad",
    description: "RGB gaming mouse pad with wireless charging",
    price: "39.99",
    inventory: 160,
    imageUrl: "https://picsum.photos/400/300?random=20",
    slug: generateSlug("Wireless Mouse Pad"),
  },
  {
    name: "Smart Plug",
    description: "WiFi smart plug with energy monitoring",
    price: "19.99",
    inventory: 400,
    imageUrl: "https://picsum.photos/400/300?random=21",
    slug: generateSlug("Smart Plug"),
  },
  {
    name: "Portable Air Purifier",
    description: "HEPA air purifier with smart controls",
    price: "89.99",
    inventory: 55,
    imageUrl: "https://picsum.photos/400/300?random=22",
    slug: generateSlug("Portable Air Purifier"),
  },
  {
    name: "Smart Mirror",
    description: "LED bathroom mirror with defogger",
    price: "199.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=23",
    slug: generateSlug("Smart Mirror"),
  },
  {
    name: "Wireless Keyboard",
    description: "Slim wireless keyboard with backlight",
    price: "59.99",
    inventory: 130,
    imageUrl: "https://picsum.photos/400/300?random=24",
    slug: generateSlug("Wireless Keyboard"),
  },
  {
    name: "Smart Water Bottle",
    description: "Temperature tracking smart water bottle",
    price: "79.99",
    inventory: 95,
    imageUrl: "https://picsum.photos/400/300?random=25",
    slug: generateSlug("Smart Water Bottle"),
  },
  {
    name: "Portable Monitor",
    description: "15.6-inch portable USB-C monitor",
    price: "249.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=26",
    slug: generateSlug("Portable Monitor"),
  },
  {
    name: "Smart Smoke Detector",
    description: "WiFi-connected smoke and CO detector",
    price: "119.99",
    inventory: 65,
    imageUrl: "https://picsum.photos/400/300?random=27",
    slug: generateSlug("Smart Smoke Detector"),
  },
  {
    name: "Wireless Charging Stand",
    description: "Adjustable wireless charging stand for phones",
    price: "34.99",
    inventory: 180,
    imageUrl: "https://picsum.photos/400/300?random=28",
    slug: generateSlug("Wireless Charging Stand"),
  },
  {
    name: "Smart Door Sensor",
    description: "Window and door open/close sensor",
    price: "29.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=29",
    slug: generateSlug("Smart Door Sensor"),
  },
  {
    name: "Portable Printer",
    description: "Mini portable photo printer",
    price: "129.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=30",
    slug: generateSlug("Portable Printer"),
  },
  {
    name: "Smart Light Strip",
    description: "RGB LED light strip with music sync",
    price: "49.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=31",
    slug: generateSlug("Smart Light Strip"),
  },
  {
    name: "Wireless Webcam",
    description: "1080p wireless webcam with privacy cover",
    price: "79.99",
    inventory: 85,
    imageUrl: "https://picsum.photos/400/300?random=32",
    slug: generateSlug("Wireless Webcam"),
  },
  {
    name: "Smart Garage Opener",
    description: "WiFi garage door controller",
    price: "89.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=33",
    slug: generateSlug("Smart Garage Opener"),
  },
  {
    name: "Portable Scanner",
    description: "Handheld document scanner",
    price: "159.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=34",
    slug: generateSlug("Portable Scanner"),
  },
  {
    name: "Smart Door Viewer",
    description: "Digital peephole camera",
    price: "69.99",
    inventory: 75,
    imageUrl: "https://picsum.photos/400/300?random=35",
    slug: generateSlug("Smart Door Viewer"),
  },
  {
    name: "Wireless Microphone",
    description: "Lavalier wireless microphone system",
    price: "89.99",
    inventory: 60,
    imageUrl: "https://picsum.photos/400/300?random=36",
    slug: generateSlug("Wireless Microphone"),
  },
  {
    name: "Smart Plant Pot",
    description: "Self-watering smart plant pot",
    price: "79.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=37",
    slug: generateSlug("Smart Plant Pot"),
  },
  {
    name: "Portable Power Station",
    description: "300W portable power station",
    price: "299.99",
    inventory: 25,
    imageUrl: "https://picsum.photos/400/300?random=38",
    slug: generateSlug("Portable Power Station"),
  },
  {
    name: "Smart Door Mat",
    description: "Smart welcome mat with motion detection",
    price: "129.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=39",
    slug: generateSlug("Smart Door Mat"),
  },
  {
    name: "Wireless Presenter",
    description: "Laser pointer presentation remote",
    price: "39.99",
    inventory: 200,
    imageUrl: "https://picsum.photos/400/300?random=40",
    slug: generateSlug("Wireless Presenter"),
  },
  {
    name: "Smart Door Chain",
    description: "Digital door chain lock",
    price: "59.99",
    inventory: 80,
    imageUrl: "https://picsum.photos/400/300?random=41",
    slug: generateSlug("Smart Door Chain"),
  },
  {
    name: "Portable Photo Printer",
    description: "Polaroid-style instant photo printer",
    price: "149.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=42",
    slug: generateSlug("Portable Photo Printer"),
  },
  {
    name: "Smart Door Handle",
    description: "Fingerprint door handle lock",
    price: "199.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=43",
    slug: generateSlug("Smart Door Handle"),
  },
  {
    name: "Wireless Trackpad",
    description: "Multi-touch wireless trackpad",
    price: "79.99",
    inventory: 100,
    imageUrl: "https://picsum.photos/400/300?random=44",
    slug: generateSlug("Wireless Trackpad"),
  },
  {
    name: "Smart Door Frame",
    description: "Motion-sensing door frame",
    price: "89.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=45",
    slug: generateSlug("Smart Door Frame"),
  },
  {
    name: "Portable Label Maker",
    description: "Bluetooth label printer",
    price: "69.99",
    inventory: 90,
    imageUrl: "https://picsum.photos/400/300?random=46",
    slug: generateSlug("Portable Label Maker"),
  },
  {
    name: "Smart Door Stop",
    description: "Motion-activated door stop",
    price: "29.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=47",
    slug: generateSlug("Smart Door Stop"),
  },
  {
    name: "Wireless Number Pad",
    description: "Mechanical wireless number pad",
    price: "49.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=48",
    slug: generateSlug("Wireless Number Pad"),
  },
  {
    name: "Smart Door Mat Pro",
    description: "Weight-sensing welcome mat",
    price: "99.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=49",
    slug: generateSlug("Smart Door Mat Pro"),
  },
  {
    name: "Portable Document Scanner",
    description: "Handheld document scanner",
    price: "179.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=50",
    slug: generateSlug("Portable Document Scanner"),
  },
];

const seed = async () => {
  try {
    // Clear existing data in the correct order
    await db.delete(cartItems);
    await db.delete(carts);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(sessions);
    await db.delete(users);
    await db.delete(cmsUsers);

    // Hash passwords
    const hashedPassword = await bcrypt.hash("1234", 10);

    // Seed CMS Users
    const cmsUserData = [
      {
        name: "Onur Atalay",
        email: "onur@test.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Editor User",
        email: "editor@test.com",
        password: hashedPassword,
        role: "editor",
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Seed Regular Users
    const userData = [
      {
        name: "John Doe",
        email: "john@test.com",
        password: hashedPassword,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane@test.com",
        password: hashedPassword,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bob Wilson",
        email: "bob@test.com",
        password: hashedPassword,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Seed CMS Users
    await db.insert(cmsUsers).values(cmsUserData);
    console.log("Successfully seeded CMS users");

    // Seed Regular Users
    await db.insert(users).values(userData);
    console.log("Successfully seeded regular users");

    // Seed Products
    await db.insert(products).values(dummyProducts);
    console.log("Successfully seeded 50 products");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

seed();
