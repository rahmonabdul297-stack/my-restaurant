import { Link, Outlet } from "react-router";
import Logo from "../components/Logo";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/context";
import { AdminDashboardArr } from "../components/Arrays";
import { IoIosNotifications, IoMdContact } from "react-icons/io";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import { CiLight } from "react-icons/ci";
import { MdLightMode, MdNightlightRound } from "react-icons/md";

const AdminLayout = () => {
  const { dark, setDark } = useContext(ThemeContext);
  const [AdminMenu, setAdminMenu] = useState(false);
  return (
    <div>
      <section
        className={` flex ${dark ? "bg-AppBlack text-AppWhite" : "bg-AppWhite text-AppBlack"} items-center justify-between fixed w-full `}
      >
        <section className="container flex justify-between items-center">
          <div onClick={() => setAdminMenu((prev) => !prev)}>
            {" "}
            {AdminMenu ? (
              <TfiAngleDown size={30} />
            ) : (
              <TfiAngleRight size={30} />
            )}
          </div>

          <Logo />

          <div className="flex items-center gap-4">
            {" "}
            <div onClick={() => setDark((prev) => !prev)}>
              {dark ? <CiLight size={30} /> : <MdLightMode  size={30} />}
            </div>
            <IoIosNotifications size={40} />
          </div>
        </section>
      </section>
      <section className="flex items-start gap-44">
        <div
          className={`${dark ? "bg-AppBlack text-AppWhite" : "bg-AppWhite text-AppBlack"} h-screen w-max flex flex-col gap-3 px-4 py-16  text-sm capitalize font-normal fixed top-16 overflow-auto `}
        >
          {AdminDashboardArr.map((nav) => (
            <Link
              to={nav.Link}
              key={nav.id}
              className="flex items-center gap-4 hover:bg-AppGray/65 px-5 py-3 rounded-xl"
            >
              {nav.icon}
              <div className={AdminMenu ? "" : "hidden"}> {nav.nav}</div>
            </Link>
          ))}

          <div className="mt-96 lg:mt-40 flex items-center  gap-5">
            <IoMdContact size={30} />
            <div className={AdminMenu ?"flex flex-col":"hidden"}>
              <div className="font-bold text-xl">Abdulrahmon</div>
              <div className="capitalize text-sm">Administrator</div>
            </div>
            <TfiAngleRight className={AdminMenu ?"":"hidden"}/>
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
