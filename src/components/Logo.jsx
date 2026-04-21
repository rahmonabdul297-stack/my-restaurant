import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="">
      <img src="/images/logo.png" alt="" className="h-16 " />
    </Link>
  );
};

export default Logo;
