// Ad Network Data
// This will be used by the ad input system and displayed on the ads page

export const sampleAds = [
  {
    id: 1,
    title: "MacBook Pro M3 - Now Available",
    summary: "Experience the power of the new M3 chip with up to 22 hours of battery life. Perfect for developers and creatives.",
    type: "single-image",
    image: "macbook-pro.jpg",
    hasImage: true,
    company: {
      name: "Apple",
      logo: "apple-logo.png"
    },
    category: "technology",
    keywords: ["laptop", "apple", "macbook", "programming", "development", "work"],
    details: {
      price: "$1,599 - $2,499",
      features: ["M3 Pro & M3 Max chips", "Up to 22-hour battery life", "14\" & 16\" Liquid Retina XDR display", "Up to 128GB unified memory"],
      specs: "Available in Space Black and Silver. Starting with 512GB SSD storage.",
      callToAction: "Configure yours today"
    },
    links: [
      { text: "Shop MacBook Pro", url: "apple.com/macbook-pro", description: "Browse the full MacBook Pro lineup with M3 Pro and M3 Max configurations available." },
      { text: "Compare Models", url: "apple.com/mac/compare", description: "Side-by-side comparison of all Mac models to find the perfect fit for your needs." },
      { text: "Education Pricing", url: "apple.com/us-edu/shop", description: "Special pricing for students, teachers, and educational institutions with exclusive discounts." },
      { text: "Trade In Program", url: "apple.com/trade-in", description: "Get credit toward a new Mac when you trade in your eligible computer or device." }
    ]
  },
  {
    id: 2,
    title: "Explore Dell Gaming Laptops",
    summary: "Discover Dell's latest gaming laptops with RTX 4070 graphics and Intel 13th gen processors.",
    type: "carousel",
    images: ["dell-gaming-1.jpg", "dell-gaming-2.jpg", "dell-gaming-3.jpg", "dell-gaming-4.jpg"],
    hasImage: true,
    company: {
      name: "Dell",
      logo: "dell-logo.png"
    },
    category: "gaming",
    keywords: ["gaming", "laptop", "dell", "rtx", "graphics", "performance"],
    details: {
      price: "$899 - $2,799",
      features: ["NVIDIA RTX 4070 Graphics", "Intel 13th Gen processors", "144Hz refresh rate displays", "Advanced cooling system"],
      specs: "Available in 15\" and 17\" models. Up to 32GB RAM and 1TB SSD storage options.",
      callToAction: "Game at your best"
    },
    links: [
      { text: "Gaming Laptops", url: "dell.com/gaming-laptops", description: "Powerful gaming laptops with NVIDIA RTX graphics and Intel processors for ultimate performance." },
      { text: "Configure & Price", url: "dell.com/configurator", description: "Customize your gaming setup with memory, storage, and display options to match your budget." },
      { text: "Gaming Accessories", url: "dell.com/gaming-gear", description: "Complete your setup with gaming mice, keyboards, headsets, and monitors." },
      { text: "Financing Options", url: "dell.com/financing", description: "Flexible payment plans and financing options to make your gaming laptop more affordable." }
    ]
  },
  {
    id: 3,
    title: "Premium T-Shirt Collection",
    summary: "Comfortable, stylish t-shirts made from 100% organic cotton. Available in 12 colors.",
    type: "carousel", 
    images: ["tshirt-black.jpg", "tshirt-white.jpg", "tshirt-navy.jpg", "tshirt-gray.jpg"],
    hasImage: true,
    company: {
      name: "OrganicWear",
      logo: "organicwear-logo.png"
    },
    category: "fashion",
    keywords: ["clothing", "tshirt", "fashion", "organic", "cotton", "style"],
    details: {
      price: "$24.99 - $34.99",
      features: ["100% Organic Cotton", "Pre-shrunk fabric", "Reinforced stitching", "Available in 12 colors"],
      specs: "Sizes XS-3XL. Machine washable. Ethically sourced materials.",
      callToAction: "Shop sustainable fashion"
    },
    links: [
      { text: "Shop T-Shirts", url: "organicwear.com/tshirts", description: "Browse our complete collection of organic cotton t-shirts in 12 different colors and styles." },
      { text: "Size Guide", url: "organicwear.com/sizing", description: "Find your perfect fit with our detailed sizing chart and measurement guide." },
      { text: "Bulk Orders", url: "organicwear.com/wholesale", description: "Special pricing and customization options for businesses, events, and large orders." },
      { text: "Free Returns", url: "organicwear.com/returns", description: "Easy 30-day return policy with free shipping on all returns and exchanges." }
    ]
  },
  {
    id: 4,
    title: "Learn Python Programming",
    summary: "Complete Python course from beginner to advanced. Build real projects and get job-ready skills.",
    type: "service",
    hasImage: false,
    company: {
      name: "CodeCamp",
      logo: "codecamp-logo.png"
    },
    category: "education",
    keywords: ["python", "programming", "course", "learning", "coding", "development"],
    details: {
      price: "$49.99 (was $199.99)",
      features: ["40+ hours of video content", "10 real-world projects", "Certificate of completion", "Lifetime access"],
      specs: "Beginner-friendly. No prior experience needed. Access on mobile, desktop & TV.",
      callToAction: "Start coding today"
    },
    links: [
      { text: "Enroll Now", url: "codecamp.com/python", description: "Start learning Python today with instant access to 40+ hours of video content and projects." },
      { text: "Free Preview", url: "codecamp.com/preview", description: "Watch sample lessons and get a feel for the teaching style before you enroll." },
      { text: "Student Reviews", url: "codecamp.com/reviews", description: "Read what our 50,000+ students are saying about their Python learning experience." },
      { text: "Course Syllabus", url: "codecamp.com/syllabus", description: "Detailed curriculum covering Python basics, web development, data science, and automation." }
    ]
  },
  {
    id: 5,
    title: "Coffee Subscription Service",
    summary: "Fresh roasted coffee delivered to your door monthly. Try beans from around the world.",
    type: "service",
    hasImage: false,
    company: {
      name: "WorldCoffee",
      logo: "worldcoffee-logo.png"
    },
    category: "food",
    keywords: ["coffee", "subscription", "fresh", "roasted", "delivery", "beans"],
    details: {
      price: "$14.99/month (free shipping)",
      features: ["Single-origin coffee beans", "Roasted within 48 hours", "Curated selections", "Pause anytime"],
      specs: "Choose whole bean or ground. 3 bag sizes available. Cancel or skip deliveries anytime.",
      callToAction: "Taste the world's best coffee"
    },
    links: [
      { text: "Start Subscription", url: "worldcoffee.com/subscribe", description: "Begin your coffee journey with monthly deliveries of freshly roasted beans from around the world." },
      { text: "Coffee Origins", url: "worldcoffee.com/origins", description: "Learn about our partner farms in Ethiopia, Colombia, Guatemala, and other coffee-growing regions." },
      { text: "Gift Subscriptions", url: "worldcoffee.com/gifts", description: "Perfect gift for coffee lovers with flexible duration options and personalized notes." },
      { text: "Brewing Guides", url: "worldcoffee.com/brewing", description: "Step-by-step guides for pour-over, French press, espresso, and other brewing methods." }
    ]
  },
  {
    id: 6,
    title: "Wireless Headphones Collection", 
    summary: "Premium noise-canceling headphones with 30-hour battery life and studio-quality sound.",
    type: "carousel",
    images: ["headphones-black.jpg", "headphones-white.jpg", "headphones-blue.jpg"],
    hasImage: true,
    company: {
      name: "AudioTech",
      logo: "audiotech-logo.png"
    },
    category: "electronics",
    keywords: ["headphones", "wireless", "audio", "music", "noise-canceling", "bluetooth"],
    details: {
      price: "$199 - $349",
      features: ["Active noise cancellation", "30-hour battery life", "Hi-Res audio certified", "Quick charge (3min = 3hrs)"],
      specs: "Bluetooth 5.0. Compatible with all devices. Foldable design with carrying case.",
      callToAction: "Experience pure sound"
    },
    links: [
      { text: "Shop Headphones", url: "audiotech.com/headphones" },
      { text: "Compare Models", url: "audiotech.com/compare" },
      { text: "Try Before Buying", url: "audiotech.com/trial" },
      { text: "Extended Warranty", url: "audiotech.com/warranty" }
    ]
  },
  {
    id: 7,
    title: "Fitness Tracker Pro",
    summary: "Track your health with advanced metrics: heart rate, sleep, steps, and 50+ workout modes.",
    type: "single-image", 
    image: "fitness-tracker.jpg",
    hasImage: true,
    company: {
      name: "FitTech",
      logo: "fittech-logo.png"
    },
    category: "health",
    keywords: ["fitness", "tracker", "health", "exercise", "heart rate", "sleep"],
    details: {
      price: "$149.99 (was $199.99)",
      features: ["24/7 heart rate monitoring", "Sleep stage tracking", "GPS built-in", "7-day battery life"],
      specs: "Water resistant to 50m. Compatible with iOS & Android. Free app included.",
      callToAction: "Start your fitness journey"
    },
    links: [
      { text: "Buy Fitness Tracker", url: "fittech.com/tracker-pro" },
      { text: "Health App", url: "fittech.com/app" },
      { text: "Workout Plans", url: "fittech.com/workouts" },
      { text: "Community", url: "fittech.com/community" }
    ]
  },
  {
    id: 8,
    title: "Home Office Furniture Sale",
    summary: "Ergonomic desks and chairs designed for productivity. Up to 40% off this week only.",
    type: "carousel",
    images: ["desk-modern.jpg", "chair-ergonomic.jpg", "office-setup.jpg", "standing-desk.jpg"],
    hasImage: true,
    company: {
      name: "ErgoFurniture",
      logo: "ergofurniture-logo.png"
    },
    category: "furniture", 
    keywords: ["furniture", "office", "desk", "chair", "ergonomic", "home", "work"],
    details: {
      price: "$299 - $899 (40% off)",
      features: ["Ergonomic design", "Height adjustable", "Cable management", "10-year warranty"],
      specs: "Standing desks available. Memory foam seating. Premium materials with sustainable wood.",
      callToAction: "Upgrade your workspace"
    },
    links: [
      { text: "Shop Office Furniture", url: "ergofurniture.com/office" },
      { text: "Standing Desks", url: "ergofurniture.com/standing" },
      { text: "Ergonomic Chairs", url: "ergofurniture.com/chairs" },
      { text: "Free Assembly", url: "ergofurniture.com/assembly" }
    ]
  },
  {
    id: 9,
    title: "Cloud Storage - 1TB Free",
    summary: "Secure cloud storage with end-to-end encryption. Access your files anywhere, anytime.",
    type: "service",
    hasImage: false,
    company: {
      name: "SecureCloud",
      logo: "securecloud-logo.png"
    },
    category: "software",
    keywords: ["cloud", "storage", "backup", "sync", "security", "files", "data"],
    details: {
      price: "Free 1TB, Pro from $9.99/mo",
      features: ["End-to-end encryption", "Real-time sync", "Version history", "Offline access"],
      specs: "Available on all devices. 99.9% uptime guarantee. GDPR compliant.",
      callToAction: "Secure your files today"
    },
    links: [
      { text: "Get Free 1TB", url: "securecloud.com/free" },
      { text: "Business Plans", url: "securecloud.com/business" },
      { text: "Security Features", url: "securecloud.com/security" },
      { text: "Migration Tool", url: "securecloud.com/migrate" }
    ]
  },
  {
    id: 10,
    title: "Smart Home Starter Kit",
    summary: "Transform your home with smart lights, plugs, and sensors. Easy setup with your phone.",
    type: "carousel", 
    images: ["smart-lights.jpg", "smart-plugs.jpg", "smart-sensors.jpg", "smart-hub.jpg"],
    hasImage: true,
    company: {
      name: "SmartHome",
      logo: "smarthome-logo.png"
    },
    category: "smart-home",
    keywords: ["smart home", "automation", "lights", "sensors", "iot", "technology"],
    details: {
      price: "$199 (was $299) - Complete Kit",
      features: ["Voice control compatible", "Energy monitoring", "Remote access", "Easy 5-min setup"],
      specs: "Works with Alexa, Google Home & Apple HomeKit. Hub included. Expandable system.",
      callToAction: "Make your home smart"
    },
    links: [
      { text: "Buy Starter Kit", url: "smarthome.com/starter" },
      { text: "Product Demo", url: "smarthome.com/demo" },
      { text: "Add-on Devices", url: "smarthome.com/devices" },
      { text: "Installation Help", url: "smarthome.com/setup" }
    ]
  }
];

// Helper functions for the ad system
export const getAdById = (id) => sampleAds.find(ad => ad.id === id);

export const getAdsByCategory = (category) => sampleAds.filter(ad => ad.category === category);

export const getAdsByKeywords = (keywords) => {
  return sampleAds.filter(ad => 
    ad.keywords.some(keyword => 
      keywords.some(searchKeyword => 
        keyword.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    )
  );
};

export const getAllCategories = () => {
  return [...new Set(sampleAds.map(ad => ad.category))];
};
