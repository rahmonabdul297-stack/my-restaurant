import { useContext } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../context/context";

const Logo = () => {
  const {dark}=useContext(ThemeContext)
  return (
    <Link to="/" className="">
      <img src={dark?"/images/new logo.png":"/images/logo.png"} alt="" className="h-16 " />
    </Link>
  );
};

export default Logo;
