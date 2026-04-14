import { Link } from "react-router";
import "./index.css";
import Logo from "./Logo";
import { navsArr } from "./Arrays";
import { useContext, useState } from "react";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { ThemeContext } from "../context/context";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { AiFillPlusCircle } from "react-icons/ai";
import { GoTriangleDown } from "react-icons/go";
export const GeneralHeader = () => {
  const [Selected, setSelected] = useState();
  const [ShowMenu, setShowMenu] = useState(false);
  const [AccountDrop, setAccountDrop] = useState(false);
  const {
    dark,
    setDark,
    first_name,
    setFirstName,
    drop,
    setdrop,
    email,
    setemail,
  } = useContext(ThemeContext);
  const handleLogout = () => {
    setFirstName("");
    setemail("");
  };
  const handleMenuDrop = () => {
    setShowMenu((prev) => !prev);
  };
  return (
    <div
      className={`${dark ? "bg-AppBlack" : "bg-AppWhite "} overflow-x-auto shadow-2xl w-full fixed z-20 text-[12px]`}
    >
      <div className="container hidden lg:flex justify-between items-center">
        <Logo />

        <div
          className={` ${dark ? "text-AppWhite " : "text-AppBlack "} flex items-center justify-between gap-10 font-bold capitalize`}
        >
          {navsArr.slice(0, 2).map((item) => (
            <Link
              key={item.id}
              to={item.Link}
              className={
                Selected === item.id
                  ? " border-b border-AppRed text-AppRed"
                  : ""
              }
              onClick={() => setSelected(item.id)}
            >
              {item.nav}
            </Link>
          ))}

          <div className="flex items-center gap-2.5">
            {first_name ? (
              <i className="text-[12px] font-serif">
                welcome, {first_name?.slice(0, 11)}!
              </i>
            ) : (
              <Link to="/signup" className="sec-btn rounded font-bold border">
                sign up
              </Link>
            )}
          </div>
          <div className=" relative">
            {" "}
            {navsArr.slice(2, 3).map((item) => (
              <Link
                key={item.id}
                to={item.Link}
                className={
                  Selected === item.id
                    ? " border-b border-AppRed text-AppRed"
                    : ""
                }
                onClick={() => setSelected(item.id)}
              >
                {item.nav}
              </Link>
            ))}
          </div>
          <div className="absolute right-20 top-3 bg-AppRed h-5 w-5  rounded-[50%] text-white text-center">
            {"0"}
          </div>
          <div onClick={() => setdrop((prev) => !prev)}>
            <IoSettings size={20} />
          </div>
          <div
            className={
              drop
                ? `${dark ? "bg-AppBlack" : "bg-AppWhite"} w-max h-max p-4 fixed top-12 right-0 flex flex-col `
                : "hidden"
            }
          >
            <div className="flex items-center">
              {first_name ? <IoIosContact size={50} /> : ""}
              <div className="flex flex-col">
                <div className=""> {email} </div>
                <div className="text-AppGray"> {first_name}</div>
              </div>
            </div>
            <div>
              {first_name ? (
                <Link to="/signin" className="flex items-center">
                  <AiFillPlusCircle />
                  Add new account
                </Link>
              ) : (
                ""
              )}
            </div>
            <Link to="/adminlogin">sign-in as admin</Link>
            <div className="  p-2" onClick={() => setDark((prev) => !prev)}>
              {dark ? (
                <span className="flex items-center">
                  {" "}
                  <MdLightMode />
                  Light Mode
                </span>
              ) : (
                <span className="flex items-center">
                  <MdDarkMode /> Dark Mode
                </span>
              )}
            </div>
            <div className="text-AppRed px-2" onClick={handleLogout}>
              {first_name ? "log out" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* mobile header */}
      <section className="container flex lg:hidden items-center justify-between">
        <HiMiniBars3BottomLeft
          size={30}
          className={`lg:hidden flex  rounded-xl ${dark ? "text-AppWhite" : ""}`}
          onClick={handleMenuDrop}
        />
        <Logo />
        <div className={`relative ${dark ? "text-AppWhite" : ""}`}>
          {" "}
          {navsArr.slice(2, 3).map((item) => (
            <Link
              key={item.id}
              to={item.Link}
              className={
                Selected === item.id
                  ? " border-b border-AppRed text-AppRed"
                  : ""
              }
              onClick={() => setSelected(item.id)}
            >
              {item.nav}
            </Link>
          ))}
        </div>
        <div className="absolute right-2 top-3 bg-AppRed h-5 w-5 text-center rounded-[50%] text-white">
          {"0"}
        </div>
      </section>
      <section
        className={
          ShowMenu
            ? `flex lg:hidden fixed top-[6%] h-screen w-full mx-auto  ${dark ? "bg-AppBlack/55 text-AppWhite" : "bg-AppWhite/55 text-AppBlack"}`
            : "hidden"
        }
      >
        <div
          className={`h-screen w-[500px] mx-auto flex flex-col py-20 px-5 ${dark ? "bg-AppBlack text-AppWhite" : "bg-AppWhite text-AppBlack"}`}
        >
          <div
            className="flex justify-between font-bold text-xl capitalize items-center py-4"
            onClick={() => setAccountDrop((prev) => !prev)}
          >
            <div className="flex items-center gap-4">
              {" "}
              <IoIosContact size={50} /> <span>accounts</span>
            </div>
            <GoTriangleDown />
          </div>
          <div
            className={
              AccountDrop
                ? "flex items-center my-2 border-b hover:border-AppRed":"hidden"
            }
          >
            {first_name ? <IoIosContact size={50} /> : ""}
            <div className="flex flex-col">
              <div className=""> {email} </div>
              <div className="text-AppGray"> {first_name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="search meals..."
              id=""
              className="outline-0 border-AppRed w-[70%] "
            />
            <div
              className={`${dark ? "bg-AppRed" : "bg-AppBlack "} text-AppWhite px-3 py-1 rounded-2xl text-center text-2xl content-['search']`}
            >
              search
            </div>
          </div>
          <div className="my-2 flex flex-col gap-5 capitalize font-bold text-2xl">
            {" "}
            {navsArr.slice(0, 2).map((item) => (
              <div
                className="flex items-center gap-5 hover:border-AppRed border-b py-2"
                key={item.id}
              >
                <div>{item.icon}</div>
                <Link
                  to={item.Link}
                  className={Selected === item.id ? "text-AppRed" : ""}
                  onClick={() => setSelected(item.id) & handleMenuDrop()}
                >
                  {item.nav}
                </Link>
              </div>
            ))}
          </div>

          <div
            className="capitalize font-bold text-2xl hover:border-AppRed border-b py-3"
            onClick={() => {
              setDark((prev) => !prev);
              handleMenuDrop();
            }}
          >
            {dark ? (
              <span className="flex items-center gap-5 ">
                {" "}
                <MdLightMode />
                Light Mode
              </span>
            ) : (
              <span className="flex items-center gap-5">
                <MdDarkMode /> Dark Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="my-4 flex items-center gap-2.5">
              {first_name ? (
                <i className="text-xl font-serif">
                  welcome, {first_name?.slice(0, 11)}!
                </i>
              ) : (
                <Link to="/signup" className="sec-btn rounded font-bold border">
                  sign up
                </Link>
              )}
            </div>

            <div className="my-4 flex items-center gap-2.5 ">
              {first_name ? (
                <Link
                  to="/signin"
                  className="pry-btn rounded font-bold border w-[150px]"
                  onClick={handleLogout}
                >
                  log out
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="pry-btn rounded font-bold border w-[150px]"
                >
                  sign in
                </Link>
              )}
            </div>
          </div>
          <Link to="/adminlogin">sign-in as admin</Link>
        </div>
      </section>
    </div>
  );
};
