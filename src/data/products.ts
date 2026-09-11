import type { Product } from "../types";

import dharwadPeda from "../assets/products/dharwad peda.png";
import mysorePak from "../assets/products/mysore pak.png";
import tirunelveliHalwa from "../assets/products/tirunelveli halwa.png";
import bandaruLadoo from "../assets/products/bandaru ladoo.png";
import pootharekulu from "../assets/products/pootarekulu.png";
import kajuKatli from "../assets/products/kaju katli.png";
import bananaChips from "../assets/products/banana chips.png";
import murukku from "../assets/products/murukku.png";
import khakhra from "../assets/products/khakhra.png";
import avakayaPickle from "../assets/products/avakaya pickle.png";
import gunturKaram from "../assets/products/guntur karam.png";
import arakuCoffee from "../assets/products/araku coffee.png";
import a2DesiGhee from "../assets/products/A2 desi ghee.png";
export const products: Product[] = [
  {
    id: "dharwad-peda",
    name: "Original Dharwad Peda",
    origin: "Dharwad, Karnataka",
    price: 250,
    unit: "500g",
    verifiedOrigin: true,
    description: "Authentic Dharwad Peda made using traditional methods.",
    image: dharwadPeda,
  },

  {
    id: "mysore-pak",
    name: "Mysore Pak",
    origin: "Mysore, Karnataka",
    price: 320,
    unit: "500g",
    verifiedOrigin: true,
    description: "Soft and rich Mysore Pak prepared with pure ghee.",
    image: mysorePak,
  },

  {
    id: "tirunelveli-halwa",
    name: "Tirunelveli Halwa",
    origin: "Tirunelveli, Tamil Nadu",
    price: 350,
    unit: "500g",
    verifiedOrigin: true,
    description: "World-famous Tirunelveli wheat halwa.",
    image: tirunelveliHalwa,
  },

  {
    id: "bandaru-laddu",
    name: "Bandaru Laddu",
    origin: "Machilipatnam, Andhra Pradesh",
    price: 280,
    unit: "500g",
    verifiedOrigin: true,
    description: "Traditional Andhra sweet with authentic taste.",
    image: bandaruLadoo,
  },

  {
    id: "pootharekulu",
    name: "Pootharekulu",
    origin: "Atreyapuram, Andhra Pradesh",
    price: 420,
    unit: "10 Pieces",
    verifiedOrigin: true,
    description: "Delicate paper sweet made using rice starch.",
    image: pootharekulu,
  },

  {
    id: "kaju-katli",
    name: "Kaju Katli",
    origin: "North India",
    price: 500,
    unit: "500g",
    verifiedOrigin: true,
    description: "Premium cashew sweet.",
    image: kajuKatli,
  },

  {
    id: "banana-chips",
    name: "Banana Chips",
    origin: "Kerala",
    price: 180,
    unit: "250g",
    verifiedOrigin: true,
    description: "Crispy Kerala style banana chips.",
    image: bananaChips,
  },

  {
    id: "murukku",
    name: "Murukku",
    origin: "Tamil Nadu",
    price: 170,
    unit: "250g",
    verifiedOrigin: true,
    description: "Crunchy South Indian snack.",
    image: murukku,
  },

  {
    id: "khakhra",
    name: "Khakhra",
    origin: "Gujarat",
    price: 160,
    unit: "250g",
    verifiedOrigin: true,
    description: "Healthy roasted Gujarati snack.",
    image: khakhra,
  },

  {
    id: "avakaya-pickle",
    name: "Avakaya Pickle",
    origin: "Andhra Pradesh",
    price: 260,
    unit: "500g",
    verifiedOrigin: true,
    description: "Traditional mango pickle.",
    image: avakayaPickle,
  },

  {
    id: "guntur-chilli",
    name: "Guntur Chilli Powder",
    origin: "Guntur, Andhra Pradesh",
    price: 210,
    unit: "500g",
    verifiedOrigin: true,
    description: "Premium spicy red chilli powder.",
    image: gunturKaram,
  },

  {
    id: "araku-coffee",
    name: "Araku Coffee",
    origin: "Araku Valley",
    price: 450,
    unit: "500g",
    verifiedOrigin: true,
    description: "Organic tribal coffee.",
    image: arakuCoffee,
  },

  {
    id: "basmati-rice",
    name: "Premium Basmati Rice",
    origin: "Punjab",
    price: 620,
    unit: "5kg",
    verifiedOrigin: true,
    description: "Long grain premium basmati rice.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "a2-ghee",
    name: "A2 Desi Ghee",
    origin: "Karnataka",
    price: 850,
    unit: "1L",
    verifiedOrigin: true,
    description: "Pure A2 cow ghee.",
    image: a2DesiGhee,
  },
];