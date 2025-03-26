import { db } from "./index";
import { products, cmsUsers, users } from "./schema";
import bcrypt from "bcryptjs";

const dummyProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    price: "299.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=1",
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring and GPS",
    price: "199.99",
    inventory: 75,
    imageUrl: "https://picsum.photos/400/300?random=2",
  },
  {
    name: "Ultra HD 4K Monitor",
    description: "32-inch 4K display with HDR support and 144Hz refresh rate",
    price: "449.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=3",
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches",
    price: "129.99",
    inventory: 100,
    imageUrl: "https://picsum.photos/400/300?random=4",
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with RGB lighting",
    price: "79.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=5",
  },
  {
    name: "Portable Power Bank",
    description: "20000mAh power bank with fast charging support",
    price: "49.99",
    inventory: 200,
    imageUrl: "https://picsum.photos/400/300?random=6",
  },
  {
    name: "Smart Home Security Camera",
    description: "1080p wireless security camera with night vision",
    price: "89.99",
    inventory: 80,
    imageUrl: "https://picsum.photos/400/300?random=7",
  },
  {
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with 12-hour battery life",
    price: "69.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=8",
  },
  {
    name: "USB-C Hub",
    description: "10-in-1 USB-C hub with HDMI and SD card reader",
    price: "39.99",
    inventory: 180,
    imageUrl: "https://picsum.photos/400/300?random=9",
  },
  {
    name: "Wireless Charging Pad",
    description: "15W fast wireless charging pad for smartphones",
    price: "29.99",
    inventory: 250,
    imageUrl: "https://picsum.photos/400/300?random=10",
  },
  {
    name: "Smart LED Bulb",
    description: "WiFi-enabled color-changing LED bulb with voice control",
    price: "24.99",
    inventory: 300,
    imageUrl: "https://picsum.photos/400/300?random=11",
  },
  {
    name: "External SSD",
    description: "1TB portable SSD with USB 3.0 interface",
    price: "159.99",
    inventory: 60,
    imageUrl: "https://picsum.photos/400/300?random=12",
  },
  {
    name: "Smart Door Lock",
    description: "Fingerprint and app-controlled smart door lock",
    price: "199.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=13",
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with noise cancellation",
    price: "149.99",
    inventory: 90,
    imageUrl: "https://picsum.photos/400/300?random=14",
  },
  {
    name: "Smart Thermostat",
    description: "WiFi-enabled smart thermostat with energy savings",
    price: "179.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=15",
  },
  {
    name: "Gaming Headset",
    description: "7.1 surround sound gaming headset with microphone",
    price: "89.99",
    inventory: 110,
    imageUrl: "https://picsum.photos/400/300?random=16",
  },
  {
    name: "Smart Scale",
    description: "Body composition smart scale with app sync",
    price: "49.99",
    inventory: 85,
    imageUrl: "https://picsum.photos/400/300?random=17",
  },
  {
    name: "Portable Projector",
    description: "Mini portable projector with built-in speakers",
    price: "299.99",
    inventory: 25,
    imageUrl: "https://picsum.photos/400/300?random=18",
  },
  {
    name: "Smart Doorbell",
    description: "Video doorbell with motion detection",
    price: "129.99",
    inventory: 70,
    imageUrl: "https://picsum.photos/400/300?random=19",
  },
  {
    name: "Wireless Mouse Pad",
    description: "RGB gaming mouse pad with wireless charging",
    price: "39.99",
    inventory: 160,
    imageUrl: "https://picsum.photos/400/300?random=20",
  },
  {
    name: "Smart Plug",
    description: "WiFi smart plug with energy monitoring",
    price: "19.99",
    inventory: 400,
    imageUrl: "https://picsum.photos/400/300?random=21",
  },
  {
    name: "Portable Air Purifier",
    description: "HEPA air purifier with smart controls",
    price: "89.99",
    inventory: 55,
    imageUrl: "https://picsum.photos/400/300?random=22",
  },
  {
    name: "Smart Mirror",
    description: "LED bathroom mirror with defogger",
    price: "199.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=23",
  },
  {
    name: "Wireless Keyboard",
    description: "Slim wireless keyboard with backlight",
    price: "59.99",
    inventory: 130,
    imageUrl: "https://picsum.photos/400/300?random=24",
  },
  {
    name: "Smart Water Bottle",
    description: "Temperature tracking smart water bottle",
    price: "79.99",
    inventory: 95,
    imageUrl: "https://picsum.photos/400/300?random=25",
  },
  {
    name: "Portable Monitor",
    description: "15.6-inch portable USB-C monitor",
    price: "249.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=26",
  },
  {
    name: "Smart Smoke Detector",
    description: "WiFi-connected smoke and CO detector",
    price: "119.99",
    inventory: 65,
    imageUrl: "https://picsum.photos/400/300?random=27",
  },
  {
    name: "Wireless Charging Stand",
    description: "Adjustable wireless charging stand for phones",
    price: "34.99",
    inventory: 180,
    imageUrl: "https://picsum.photos/400/300?random=28",
  },
  {
    name: "Smart Door Sensor",
    description: "Window and door open/close sensor",
    price: "29.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=29",
  },
  {
    name: "Portable Printer",
    description: "Mini portable photo printer",
    price: "129.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=30",
  },
  {
    name: "Smart Light Strip",
    description: "RGB LED light strip with music sync",
    price: "49.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=31",
  },
  {
    name: "Wireless Webcam",
    description: "1080p wireless webcam with privacy cover",
    price: "79.99",
    inventory: 85,
    imageUrl: "https://picsum.photos/400/300?random=32",
  },
  {
    name: "Smart Garage Opener",
    description: "WiFi garage door controller",
    price: "89.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=33",
  },
  {
    name: "Portable Scanner",
    description: "Handheld document scanner",
    price: "159.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=34",
  },
  {
    name: "Smart Door Viewer",
    description: "Digital peephole camera",
    price: "69.99",
    inventory: 75,
    imageUrl: "https://picsum.photos/400/300?random=35",
  },
  {
    name: "Wireless Microphone",
    description: "Lavalier wireless microphone system",
    price: "89.99",
    inventory: 60,
    imageUrl: "https://picsum.photos/400/300?random=36",
  },
  {
    name: "Smart Plant Pot",
    description: "Self-watering smart plant pot",
    price: "79.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=37",
  },
  {
    name: "Portable Power Station",
    description: "300W portable power station",
    price: "299.99",
    inventory: 25,
    imageUrl: "https://picsum.photos/400/300?random=38",
  },
  {
    name: "Smart Door Mat",
    description: "Smart welcome mat with motion detection",
    price: "129.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=39",
  },
  {
    name: "Wireless Presenter",
    description: "Laser pointer presentation remote",
    price: "39.99",
    inventory: 200,
    imageUrl: "https://picsum.photos/400/300?random=40",
  },
  {
    name: "Smart Door Chain",
    description: "Digital door chain lock",
    price: "59.99",
    inventory: 80,
    imageUrl: "https://picsum.photos/400/300?random=41",
  },
  {
    name: "Portable Photo Printer",
    description: "Polaroid-style instant photo printer",
    price: "149.99",
    inventory: 45,
    imageUrl: "https://picsum.photos/400/300?random=42",
  },
  {
    name: "Smart Door Handle",
    description: "Fingerprint door handle lock",
    price: "199.99",
    inventory: 30,
    imageUrl: "https://picsum.photos/400/300?random=43",
  },
  {
    name: "Wireless Trackpad",
    description: "Multi-touch wireless trackpad",
    price: "79.99",
    inventory: 100,
    imageUrl: "https://picsum.photos/400/300?random=44",
  },
  {
    name: "Smart Door Frame",
    description: "Motion-sensing door frame",
    price: "89.99",
    inventory: 50,
    imageUrl: "https://picsum.photos/400/300?random=45",
  },
  {
    name: "Portable Label Maker",
    description: "Bluetooth label printer",
    price: "69.99",
    inventory: 90,
    imageUrl: "https://picsum.photos/400/300?random=46",
  },
  {
    name: "Smart Door Stop",
    description: "Motion-activated door stop",
    price: "29.99",
    inventory: 150,
    imageUrl: "https://picsum.photos/400/300?random=47",
  },
  {
    name: "Wireless Number Pad",
    description: "Mechanical wireless number pad",
    price: "49.99",
    inventory: 120,
    imageUrl: "https://picsum.photos/400/300?random=48",
  },
  {
    name: "Smart Door Mat",
    description: "Weight-sensing welcome mat",
    price: "99.99",
    inventory: 40,
    imageUrl: "https://picsum.photos/400/300?random=49",
  },
  {
    name: "Portable Document Scanner",
    description: "Handheld document scanner",
    price: "179.99",
    inventory: 35,
    imageUrl: "https://picsum.photos/400/300?random=50",
  },
];

const seed = async () => {
  try {
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
