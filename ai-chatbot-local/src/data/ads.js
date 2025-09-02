// Ad Network Data
// This will be used by the ad input system and displayed on the ads page

export const sampleAds = [
  {
    id: 1,
    title: "MacBook Pro M3 - Now Available",
    summary: "Experience the power of the new M3 chip with up to 22 hours of battery life. Perfect for developers and creatives.",
    company: {
      name: "Apple",
      logo: "apple-logo.png"
    },
    category: "technology",
    keywords: ["laptop", "apple", "macbook", "programming", "development", "work"],
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
    company: {
      name: "Dell",
      logo: "dell-logo.png"
    },
    category: "gaming",
    keywords: ["gaming", "laptop", "dell", "rtx", "graphics", "performance"],
    links: [
      { text: "Gaming Laptops", url: "dell.com/gaming-laptops", description: "Browse Dell's complete gaming laptop collection with RTX graphics" },
      { text: "Configure & Customize", url: "dell.com/configurator", description: "Build your perfect gaming setup with custom specs and accessories" },
      { text: "Gaming Deals", url: "dell.com/gaming-deals", description: "Current promotions and discounts on gaming laptops and gear" },
      { text: "Support & Warranty", url: "dell.com/support", description: "Technical support and extended warranty options for gaming laptops" }
    ]
  },
  {
    id: 3,
    title: "Premium T-Shirt Collection",
    summary: "Comfortable, stylish t-shirts made from 100% organic cotton. Available in 12 colors.",
    company: {
      name: "OrganicWear",
      logo: "organicwear-logo.png"
    },
    category: "fashion",
    keywords: ["clothing", "tshirt", "fashion", "organic", "cotton", "style"],
    links: [
      { text: "Shop T-Shirts", url: "organicwear.com/tshirts", description: "Browse complete organic cotton t-shirt collection in all colors and styles" },
      { text: "Size Guide", url: "organicwear.com/sizing", description: "Find your perfect fit with detailed measurements and fit guide" },
      { text: "Bulk Orders", url: "organicwear.com/wholesale", description: "Special pricing and customization options for businesses and events" },
      { text: "Free Returns", url: "organicwear.com/returns", description: "Easy 30-day return policy with free shipping on all returns" }
    ]
  },
  {
    id: 4,
    title: "Learn Python Programming",
    summary: "Complete Python course from beginner to advanced. Build real projects and get job-ready skills.",
    company: {
      name: "CodeCamp",
      logo: "codecamp-logo.png"
    },
    category: "education",
    keywords: ["python", "programming", "course", "learning", "coding", "development"],
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
    company: {
      name: "WorldCoffee",
      logo: "worldcoffee-logo.png"
    },
    category: "food",
    keywords: ["coffee", "subscription", "fresh", "roasted", "delivery", "beans"],
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
    company: {
      name: "AudioTech",
      logo: "audiotech-logo.png"
    },
    category: "electronics",
    keywords: ["headphones", "wireless", "audio", "music", "noise-canceling", "bluetooth"],
    links: [
      { text: "Shop Headphones", url: "audiotech.com/headphones", description: "Browse complete AudioTech headphone collection with professional audio quality" },
      { text: "Compare Models", url: "audiotech.com/compare", description: "Compare frequency response and audio specifications across all models" },
      { text: "Audio Trial", url: "audiotech.com/trial", description: "Try any AudioTech headphones for 30 days risk-free with full refund guarantee" },
      { text: "Support & Warranty", url: "audiotech.com/support", description: "Get technical support and extended warranty options for your headphones" }
    ]
  },
  {
    id: 7,
    title: "Fitness Tracker Pro",
    summary: "Track your health with advanced metrics: heart rate, sleep, steps, and 50+ workout modes.",
    company: {
      name: "FitTech",
      logo: "fittech-logo.png"
    },
    category: "health",
    keywords: ["fitness", "tracker", "health", "exercise", "heart rate", "sleep"],
    links: [
      { text: "Shop Trackers", url: "fittech.com/tracker-pro", description: "Browse our complete fitness tracking lineup with advanced health monitoring" },
      { text: "Health App", url: "fittech.com/app", description: "Download the companion app for detailed health insights and goal tracking" },
      { text: "Workout Programs", url: "fittech.com/workouts", description: "Access personalized workout plans and training programs" },
      { text: "Community", url: "fittech.com/community", description: "Join thousands of users sharing fitness tips and achievements" }
    ]
  },
  {
    id: 8,
    title: "Home Office Furniture Sale",
    summary: "Ergonomic desks and chairs designed for productivity. Up to 40% off this week only.",
    company: {
      name: "ErgoFurniture",
      logo: "ergofurniture-logo.png"
    },
    category: "furniture", 
    keywords: ["furniture", "office", "desk", "chair", "ergonomic", "home", "work"],
    links: [
      { text: "Shop Office Furniture", url: "ergofurniture.com/office", description: "Browse our complete collection of ergonomic office furniture" },
      { text: "Standing Desks", url: "ergofurniture.com/standing", description: "Height-adjustable standing desks with memory presets and cable management" },
      { text: "Ergonomic Chairs", url: "ergofurniture.com/chairs", description: "Premium office chairs with lumbar support and breathable materials" },
      { text: "Free Assembly", url: "ergofurniture.com/assembly", description: "Professional assembly service available in most areas" }
    ]
  },
  {
    id: 9,
    title: "Cloud Storage - 1TB Free",
    summary: "Secure cloud storage with end-to-end encryption. Access your files anywhere, anytime.",
    company: {
      name: "SecureCloud",
      logo: "securecloud-logo.png"
    },
    category: "software",
    keywords: ["cloud", "storage", "backup", "sync", "security", "files", "data"],
    links: [
      { text: "Get Free 1TB", url: "securecloud.com/free", description: "Sign up for 1TB of free secure cloud storage with automatic sync" },
      { text: "Business Plans", url: "securecloud.com/business", description: "Team collaboration tools and admin controls for organizations" },
      { text: "Security Features", url: "securecloud.com/security", description: "Learn about end-to-end encryption and zero-knowledge architecture" },
      { text: "Migration Tool", url: "securecloud.com/migrate", description: "Easily transfer files from other cloud services" }
    ]
  },
  {
    id: 10,
    title: "Smart Home Starter Kit",
    summary: "Transform your home with smart lights, plugs, and sensors. Easy setup with your phone.",
    company: {
      name: "SmartHome",
      logo: "smarthome-logo.png"
    },
    category: "smart-home",
    keywords: ["smart home", "automation", "lights", "sensors", "iot", "technology"],
    links: [
      { text: "Shop Smart Kits", url: "smarthome.com/starter", description: "Complete smart home automation kits for every budget and need" },
      { text: "Product Demo", url: "smarthome.com/demo", description: "See how easy it is to set up and control your smart home" },
      { text: "Add-on Devices", url: "smarthome.com/devices", description: "Expand your system with security cameras, sensors, and more" },
      { text: "Installation Help", url: "smarthome.com/setup", description: "Step-by-step guides and professional installation services" }
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
