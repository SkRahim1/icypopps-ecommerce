export const products = [
  {
    id: "pani-puri-family-pack",
    title: "Pani Puri Family Pack (30 Puris + 5 Flavors)",
    category: "Pani Puri Box",
    description: "DESI SWAD. MODERN VIBES. The complete home showcase box containing 30 crispy, hollow semolina puris and 5 concentrated seasoning waters to satisfy every craving.",
    details: "100% vegetarian. Made using clean RO-filtered water and high-grade flour. Includes sweet-tamarind, spicy-mint, lemon-tang, fiery-chilli, and cheese blast pastes. Perfect for family events or weekend get-togethers.",
    options: [
      { name: "Family Pack (30 Puris)", price: 249.00, regularPrice: 299.00 },
      { name: "Party Tub (60 Puris)", price: 499.00, regularPrice: 599.00 }
    ],
    images: [
      "images/brand-showcase.jpg",
      "images/cheese-blast.jpg",
      "images/classic-pudina.jpg",
      "images/fiery-chilli.jpg",
      "images/meetha-masti.jpg"
    ],
    features: ["Desi Swad", "Modern Vibes", "Hygienic preparation", "100% Vegetarian"]
  },
  {
    id: "cheese-blast-box",
    title: "Cheese Blast Pani Puri Showcase Kit",
    category: "Signature Kit",
    description: "Creamy liquid cheese meets crispy puris! A modern culinary twist on India's favorite street snack that will blow your tastebuds away.",
    details: "Includes 24 crispy puris and a jar of our gourmet cheddar-infused liquid cheese dip. Burst of creaminess in every single bite!",
    options: [
      { name: "Standard Kit (24 Puris)", price: 180.00, regularPrice: 220.00 },
      { name: "Large Tub (48 Puris)", price: 320.00, regularPrice: 380.00 }
    ],
    images: [
      "images/cheese-blast.jpg",
      "images/brand-showcase.jpg"
    ],
    features: ["Creamy Cheese", "Crispy Puris", "Modern Twist", "100% Vegetarian"]
  },
  {
    id: "classic-pudina-concentrate",
    title: "Classic Pudina Water Concentrate",
    category: "Water Blend",
    description: "Refreshing mint water crafted with traditional green herbs and hand-ground spices. Tangy, cool, and classic.",
    details: "Concentrated mint-coriander paste. Just dilute with cold water and ice. Serves up to 50 puris. Rich in iron and digestive spices.",
    options: [
      { name: "250ml Bottle", price: 120.00, regularPrice: 150.00 },
      { name: "500ml Bottle", price: 220.00, regularPrice: 280.00 }
    ],
    images: [
      "images/classic-pudina.jpg",
      "images/brand-showcase.jpg"
    ],
    features: ["Fresh Mint", "Digestive Herbs", "RO Purified", "Low Calorie"]
  },
  {
    id: "fiery-chilli-spicy-dip",
    title: "Fiery Chilli Hot Water Concentrate",
    category: "Water Blend",
    description: "Bold. Spicy. Unstoppable. For those who love the real heat! Made with dried red chillies and black pepper.",
    details: "Spicy red concentrate water. Extreme tang and heat designed to fill your puris with a bursting hot sensation. Handle with care!",
    options: [
      { name: "250ml Bottle", price: 130.00, regularPrice: 160.00 },
      { name: "500ml Bottle", price: 240.00, regularPrice: 300.00 }
    ],
    images: [
      "images/fiery-chilli.jpg",
      "images/brand-showcase.jpg"
    ],
    features: ["Red Guntur Chilli", "Extreme Heat", "Tangy Twist", "Spiced Kick"]
  },
  {
    id: "meetha-masti-sweet-sauce",
    title: "Meetha Masti Sweet Date-Tamarind Sauce",
    category: "Sweet Sauce",
    description: "A sweet surprise in every bite! Fun, unique, and simply irresistible. Rich dates, tamarind, and jaggery blend.",
    details: "Thick dates and sweet tamarind paste. Dilute or drizzle directly inside the puris. Kids' favorite and balances the spicy mint water.",
    options: [
      { name: "200g Jar", price: 110.00, regularPrice: 140.00 },
      { name: "400g Jar", price: 200.00, regularPrice: 250.00 }
    ],
    images: [
      "images/meetha-masti.jpg",
      "images/brand-showcase.jpg"
    ],
    features: ["Sweet Dates", "Organic Jaggery", "Tangy Tamarind", "Rich & Smooth"]
  }
];

export const flavorShowcase = [
  {
    name: "Classic Pudina",
    color: "#1F5E4A",
    tagline: "Refreshing mint water crafted with traditional herbs and authentic spices.",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #e8f5e9 100%)",
    image: "images/classic-pudina.jpg"
  },
  {
    name: "Cheese Blast",
    color: "#FF9A3D",
    tagline: "Creamy cheese meets crispy puris for a delicious twist you won't forget.",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #fff3e0 100%)",
    image: "images/cheese-blast.jpg"
  },
  {
    name: "Fiery Chilli",
    color: "#F05A4A",
    tagline: "Bold. Spicy. Unstoppable. For those who love the heat!",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #ffe8e6 100%)",
    image: "images/fiery-chilli.jpg"
  },
  {
    name: "Meetha Masti",
    color: "#b03a2e",
    tagline: "A sweet surprise in every bite. Fun. Unique. Simply Irresistible.",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #fbebeb 100%)",
    image: "images/meetha-masti.jpg"
  },
  {
    name: "Imli Chatpata",
    color: "#873600",
    tagline: "Tangy explosion of tamarind and cumin secret spices that hit all the right spots.",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #efe5de 100%)",
    image: "images/brand-showcase.jpg"
  }
];
