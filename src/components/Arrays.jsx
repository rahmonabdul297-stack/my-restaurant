import { BiSolidFoodMenu } from "react-icons/bi";
import { FaHome, FaInstagramSquare, FaOpencart, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { GiHotMeal } from "react-icons/gi";
import { GrContactInfo, GrGroup, GrOverview } from "react-icons/gr";
import { IoIosMail, IoMdPhonePortrait } from "react-icons/io";
import {  MdEmail, MdOutlineFacebook } from "react-icons/md";

export const navsArr = [
  { id: 1, icon: <FaHome />, nav: "home", Link: "/home" },
  { id: 2, icon: <GrContactInfo />, nav: "About", Link: "/about" },
  {
    id: 3,
    nav: <FaOpencart size={25} className="font-bold text-5xl" />,
    Link: "/order",
  },
];
export const footerArr = [
  { id: 1, icon: <FaHome />, nav: "home", Link: "/home" },
  { id: 2, icon: <GrContactInfo />, nav: "About", Link: "/about" },
  {
    id: 3,
    nav: "order",
    Link: "/order",
  },
  {
    id: 4,
    nav: "locations",
    Link: "/order",
  },
];
export const footerContactArr = [
  { id: 1, icon: <IoMdPhonePortrait  />, nav: "+2347089136508", Link: "tel:+2347089136508" },
  { id: 2, icon: <FaWhatsapp  />, nav: "+2347089136508", Link: "tel:+2347089136508" },
  {
    id: 3,
    icon: <IoIosMail    />,
    nav: "pixelplateKitchen@gmail.com",
    Link: "mailto:pixelplateKitchen@gmail.com",
  },
  {
    id: 4,
    icon: <MdOutlineFacebook  />,
    nav: "facebook",
    Link: "",
  },
  
  {
    id: 5,
    icon: <FaInstagramSquare  />,
    nav: "instagram",
    Link: "",
  },
  {
    id: 6,
    icon: <FaTwitter   />,
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
