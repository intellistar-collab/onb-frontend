interface Event {
  title: string;
  banner: string;
  type: "carousel" | "grid";
  cards: HomeCard[];
}

export const sportsEvents: Event = {
  title: "Sports Events",
  banner: "/home-card/banner/sports-events.webp",
  type: "carousel",
  cards: [
    {
      title: "Abu Dhabi F1 Weekend",
      location: "F1",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Wimbledon Final Weekend",
      location: "Tennis",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Qatar F1 Weekend",
      location: "F1",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "US Open Weekend",
      location: "Tennis",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Mexico F1 Weekend",
      location: "F1",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "London NFL Weekend",
      location: "Football",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const cityStays: Event = {
  title: "City Stays",
  banner: "/home-card/banner/city-stays.webp",
  type: "carousel",
  cards: [
    {
      title: "Marina Sandz",
      location: "Dubai",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Tuk Tuk Titan",
      location: "Bangkok",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Lost & Found",
      location: "Bali",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Gaudi’s Gamble",
      location: "Barcelona",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "I Took The Loot To Ibiza",
      location: "Ibiza",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Palm Playa",
      location: "Dubai#2",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const personalExperiences: Event = {
  title: "Personal Experiences",
  type: "grid",
  banner: "/home-card/banner/personal-experience.webp",
  cards: [
    {
      title: "The Most Expensive Hotel",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Haunted Hotel",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Underwater Hotel",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Treehouse Hotel",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Luxury Safari Lodge",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Cave Hotel",
      location: "One Night",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const worldEvents: Event = {
  title: "World Events",
  type: "carousel",
  banner: "/home-card/banner/world-events.webp",
  cards: [
    {
      title: "Oktoberfest",
      location: "Germany",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Día de los Muertos",
      location: "Mexico",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Ibiza Closing Parties",
      location: "Ibiza",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Yi Peng Lantern Festival",
      location: "Thailand",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Sziget Festival Hungary",
      location: "Hungary",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Creamfields Festival",
      location: "UK",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const dressToImpress: Event = {
  title: "Dress To Impress",
  type: "carousel",
  banner: "/home-card/banner/dress-to-impress.webp",
  cards: [
    {
      title: "Louis Vuitton Timeless Luxury",
      location: "LV",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Bold Bandit Balenciaga",
      location: "Balenciaga",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Call Me Christian Dior",
      location: "Dior",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Adidas Featured",
      location: "Adidas",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Supreme Unbox The Hype",
      location: "Supreme",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Unleash The Bathing Ape",
      location: "Bape",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const gearUpGadgets: Event = {
  title: "Gear Up Gadgets",
  type: "grid",
  banner: "/home-card/banner/gear-up-gadgets.webp",
  cards: [
    {
      title: "Take A Bite Of The Apple",
      location: "Apple",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Geared Up For Gaming",
      location: "Gaming",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Streamers Supreme",
      location: "Streamer",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Garage Sale Gadgets",
      location: "G Sale",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "PC Plugin & Conquer",
      location: "PC",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "See More & Capture It All",
      location: "Cheese",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const dripCity: Event = {
  type: "grid",
  title: "Drip City",
  banner: "/home-card/banner/drip-city.webp",
  cards: [
    {
      title: "Watch King Master Of Time",
      location: "Watches",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "The Certified Chain Vault",
      location: "Chains",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "One Bag At A Time",
      location: "Bags",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Don’t Cap Your Style",
      location: "Hat Box",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "My Precious",
      location: "Rings",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "The Treasure Chest Awaits",
      location: "Chest",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const greadCarefully: Event = {
  title: "Gread Carefully",
  banner: "/home-card/banner/gread-carefully.webp",
  type: "grid",
  cards: [
    {
      title: "Give Me Golden Goose",
      location: "GG",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Jumping For Jordans",
      location: "Jordans",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Chill Yeezy Chill",
      location: "Yeezy",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Yves Saint Laurent",
      location: "YSL",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "You’re My Main Man Nike",
      location: "Nike",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
    {
      title: "Backyard Sale",
      location: "Backyard",
      image: "/home-card/onb-box.png",
      price: "19.99",
    },
  ],
};

export const homeCardGroups = [
  cityStays,
  sportsEvents,
  dressToImpress,
  worldEvents,
  personalExperiences,
  gearUpGadgets,
  dripCity,
  greadCarefully,
];
