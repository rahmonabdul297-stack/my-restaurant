import { BiSolidFoodMenu } from "react-icons/bi";
import {
  FaHome,
  FaInstagramSquare,
  FaOpencart,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { GiHotMeal } from "react-icons/gi";
import { GrContactInfo, GrGroup, GrOverview } from "react-icons/gr";
import { IoIosMail, IoMdPhonePortrait } from "react-icons/io";
import { MdEmail, MdOutlineFacebook } from "react-icons/md";

export const navsArr = [
  { id: 1, icon: <FaHome />, nav: "home", Link: "/home" },
  { id: 2, icon: <GrContactInfo />, nav: "About", Link: "/about" },
  {
    id: 3,
    nav: "order food",
    Link: "/order",
  },
  {
    id: 4,
    nav: <FaOpencart  size={30}/>,
    Link: "/food",
  },
];
export const footerArr = [
  { id: 1, icon: <FaHome />, nav: "home", Link: "/home" },
  { id: 2, icon: <GrContactInfo />, nav: "About", Link: "/about" },
  {
    id: 3,
    nav: "food",
    Link: "/food",
  },
  {
    id: 4,
    nav: "locations",
    Link: "/order",
  },
];
export const footerContactArr = [
  {
    id: 1,
    icon: <IoMdPhonePortrait />,
    nav: "+2347089136508",
    Link: "tel:+2347089136508",
  },
  {
    id: 2,
    icon: <FaWhatsapp />,
    nav: "+2347089136508",
    Link: "tel:+2347089136508",
  },
  {
    id: 3,
    icon: <IoIosMail />,
    nav: "pixelplateKitchen@gmail.com",
    Link: "mailto:pixelplateKitchen@gmail.com",
  },
  {
    id: 4,
    icon: <MdOutlineFacebook />,
    nav: "facebook",
    Link: "",
  },

  {
    id: 5,
    icon: <FaInstagramSquare />,
    nav: "instagram",
    Link: "",
  },
  {
    id: 6,
    icon: <FaTwitter />,
    nav: "facebook",
    Link: "",
  },
];
export const AdminDashboardArr = [
  {
    id: 1,
    icon: <GrOverview />,
    nav: "overviews",
    Link: "/dashboard",
  },
  {
    id: 2,
    icon: <GrGroup />,
    nav: "users",
    Link: "/users",
  },
  { id: 3, icon: <GiHotMeal />, nav: " meals", Link: "/foods" },
  { id: 4, icon: <FaOpencart />, nav: "orders", Link: "/orders" },
  { id: 5, icon: <BiSolidFoodMenu />, nav: "menu", Link: "/menu" },
  { id: 6, icon: <GrContactInfo />, nav: "About", Link: "/aboutadmin" },
];

export const ourMeal = [
  { id: 1, img: "/images/Asun_nvrrm6.jpg", name: "Asun" },
  {
    id: 2,
    img: "/images/Asun_rice_Grilled_turkey_small_qf1q20.jpg",
    name: "Grilled rice",
  },
  { id: 3, img: "/images/Plantain_srwjur.jpg", name: "plantain" },
  {
    id: 4,
    img: "/images/Special_fried_Grilled_Turkey_small_wtuua9.jpg",
    name: "Grilled Fried Rice",
  },
  {
    id: 5,
    img: "/images/Seafood_rice_chicken_small_qinywf.jpg",
    name: "Seafood Rice",
  },
];

export const reviews = [
  {
    id: "rev_001",
    customer_name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2026-07-28T14:32:00Z",
    item_ordered: "Jollof Rice & Grilled Chicken",
    comment: "The flavors were incredible! The chicken was perfectly seasoned and smoky. Fast delivery too, still piping hot when it arrived."
  },
  {
    id: "rev_002",
    customer_name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    date: "2026-07-25T19:15:00Z",
    item_ordered: "Truffle Mushroom Pasta",
    comment: "Rich and creamy texture with just the right amount of truffle aroma. Portion size was slightly smaller than expected, but quality was top notch."
  },
  {
    id: "rev_003",
    customer_name: "Amina Bello",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    date: "2026-07-22T20:45:00Z",
    item_ordered: "Egusi Soup & Pounded Yam",
    comment: "Tastes exactly like home! Authentic traditional flavor, soft pounded yam, and generous assortment of meat. Highly recommended."
  },
  {
    id: "rev_004",
    customer_name: "Marcus Vance",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 3,
    date: "2026-07-20T12:10:00Z",
    item_ordered: "Smokey Bacon Burger",
    comment: "Burger was decent, but the fries were a bit soggy by the time they arrived. The house burger sauce saved the meal."
  },
  {
    id: "rev_005",
    customer_name: "Elena Rostova",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "2026-07-18T18:00:00Z",
    item_ordered: "Seafood Paella",
    comment: "Loaded with fresh prawns, mussels, and calamari. The saffron rice was cooked to perfection. Perfect dish for sharing."
  },
  {
    id: "rev_006",
    customer_name: "Kelechi Okafor",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 4,
    date: "2026-07-15T13:25:00Z",
    item_ordered: "Suya Platter",
    comment: "Spicy and well-marinated beef. The Yaji pepper blend is top tier. Just wish they included extra fresh onions."
  },
  {
    id: "rev_007",
    customer_name: "Jessica Taylor",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "2026-07-11T21:05:00Z",
    item_ordered: "Wood-fired Margherita Pizza",
    comment: "Thin, crispy crust with fresh basil and mozzarella. Simple ingredients done right. My go-to Friday night meal!"
  },
  {
    id: "rev_008",
    customer_name: "Omar Al-Mansoor",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 2,
    date: "2026-07-08T19:50:00Z",
    item_ordered: "Lamb Shawarma Wrap",
    comment: "Order took over an hour to arrive. Meat was dry and lacked seasoning. Disappointed given the high ratings."
  },
  {
    id: "rev_009",
    customer_name: "Rachel Adams",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "2026-07-05T15:40:00Z",
    item_ordered: "Matcha Cheesecake & Iced Latte",
    comment: "The dessert was divine! Not overly sweet, perfect matcha balance. The packaging was immaculate as well."
  },
  {
    id: "rev_010",
    customer_name: "Tunde Bakare",
    avatar: "https://i.pravatar.cc/150?img=10",
    rating: 4,
    date: "2026-07-01T17:15:00Z",
    item_ordered: "Peppered Goat Meat (Asun)",
    comment: "Very fiery and tender! If you love spicy food, this is a must-try. Pairs excellently with cold beverages."
  }
];
