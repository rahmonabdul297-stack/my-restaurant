import { useContext } from "react";
import { Outlet } from "react-router";
import { ThemeContext } from "../context/context";

const AuthLayout = () => {
  const { dark } = useContext(ThemeContext);
  return (
    <div className="lg:flex">
      {" "}
      <section
        className={`${dark ? "bg-AppBlack" : "bg-AppRed "} hidden lg:flex flex-col items-center justify-center h-screen  fixed top-0 left-0`}
      >
        <img src="/src/assets/new logo.png" alt="" className="" />
      </section>
      <div className="lg:ml-[50%] lg:w-[60%] px-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
