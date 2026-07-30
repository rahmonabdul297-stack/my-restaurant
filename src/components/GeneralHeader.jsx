import { Link } from "react-router";
import "./index.css";
import Logo from "./Logo";
import { navsArr } from "./Arrays";
import { useContext, useEffect, useState } from "react";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { ThemeContext } from "../context/context";
import { clearSession } from "../utils/authSession";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { AiFillPlusCircle } from "react-icons/ai";
import { GoTriangleDown } from "react-icons/go";
import { FaSignInAlt } from "react-icons/fa";
export const GeneralHeader = () => {
  const [Selected, setSelected] = useState();
  const [ShowMenu, setShowMenu] = useState(false);
  const [AccountDrop, setAccountDrop] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const {
    dark,
    setDark,
    first_name,
    setFirstName,
    drop,
    setdrop,
    email,
    setemail,
    setLastName,
  } = useContext(ThemeContext);
  const handleLogout = () => {
    clearSession();
    setFirstName("");
    setemail("");
    setLastName("");
  };
  const handleMenuDrop = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const readCartCount = () => {
      try {
        const storedCart = window.localStorage.getItem("food-cart");
        if (!storedCart) return 0;
        const parsed = JSON.parse(storedCart);
        return Array.isArray(parsed)
          ? parsed.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
          : 0;
      } catch {
        return 0;
      }
    };

    setCartCount(readCartCount());
    const handleStorage = () => setCartCount(readCartCount());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart:update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart:update", handleStorage);
    };
  }, []);

  return (
    <div
      className={`${dark ? "bg-AppBlack" : "bg-AppWhite "} overflow-x-auto shadow-2xl w-full fixed z-20 text-[12px]`}
    >
      <div className="container hidden lg:flex justify-between items-center">
        <Logo />

        <div
          className={` ${dark ? "text-AppWhite " : "text-AppBlack "} flex items-center justify-between gap-10 font-bold capitalize`}
        >
          {navsArr.slice(0, 3).map((item) => (
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
            {first_name || email ? (
              <i className="text-[12px] font-serif">
                welcome, {first_name || email?.slice(0, 11)}!
              </i>
            ) : (
              <Link to="/signup" className="sec-btn rounded font-bold border">
                sign up
              </Link>
            )}
          </div>
          <div className="relative">
            {" "}
            {navsArr.slice(3, 4).map((item) => (
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
          <div className="absolute right-20 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-AppRed px-1 text-center text-[10px] font-bold text-white">
            {cartCount}
          </div>
          <div onClick={() => setdrop((prev) => !prev)}>
            <IoSettings size={20} />
          </div>
          <div
            className={
              drop
                ? `${dark ? "bg-AppBlack flex" : "bg-AppWhite"} w-[250px] h-max p-4 fixed top-16 right-0 flex flex-col items-center gap-1.5 border-l-AppBlack border-l-2`
                : "hidden"
            }
          >
            <div className=" w-full flex">
              {first_name ? <IoIosContact size={30} /> : ""}
              <div className="flex flex-col">
                <div className=""> {email} </div>
                <div className={dark?"text-AppCream/50":"text-AppGray"}> {first_name}</div>
              </div>
            </div>
            <div className="w-full flex justify-between items-center hover:bg-AppGray hover:text-AppCream px-1 py-1 rounded-lg">
              {first_name ? (
                <Link to="/signin" className="flex items-center justify-between gap-3 " >
                  <AiFillPlusCircle size={13}/>
                  Add new account
                </Link>
              ) : (
                ""
              )}
            </div>
            <Link 
              to="/profile"
              className="px-1 py-1 w-full flex items-center gap-2 hover:bg-AppGray hover:text-AppCream rounded-lg"
            >
              <IoIosContact />
              <span>view profile</span>
            </Link>
            <Link
              to="/adminlogin"
              target="blank"
              className="px-1 py-1 w-full flex items-center gap-2 hover:bg-AppGray hover:text-AppCream rounded-lg"
            >
              <FaSignInAlt />
              <span>sign-in as admin</span>
            </Link>
            <div
              className="px-1 py-1  w-full hover:bg-AppGray hover:text-AppCream rounded-lg"
              onClick={() => setDark((prev) => !prev)}
            >
              {dark ? (
                <span className="w-full flex items-center gap-2">
                  {" "}
                  <MdLightMode />
                  Light Mode
                </span>
              ) : (
                <span className="w-full flex items-center gap-2">
                  <MdDarkMode /> Dark Mode
                </span>
              )}
            </div>
            <div className="text-AppRed px-2" onClick={handleLogout}>
              {first_name || email ? "log out" : ""}
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
          {navsArr.slice(3, 4).map((item) => (
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
        <div className="absolute right-2 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-AppRed px-1 text-[10px] font-bold text-white">
          {cartCount}
        </div>
      </section>
      <section
        className={
          ShowMenu
            ? `fixed left-0 top-[6%] z-30 flex h-screen w-full lg:hidden ${dark ? "bg-AppBlack/70 text-AppWhite" : "bg-AppWhite/70 text-AppBlack"}`
            : "hidden"
        }
      >
        <div
          className={`ml-auto flex h-screen w-[92vw] max-w-[420px] flex-col overflow-y-auto border-l px-4 py-5 shadow-2xl ${dark ? "border-slate-800 bg-AppBlack text-AppWhite" : "border-slate-200 bg-AppWhite text-AppBlack"}`}
        >
          <div
            className="flex items-center justify-between rounded-2xl border border-AppRed/20 bg-AppRed/5 px-3 py-3"
            onClick={() => setAccountDrop((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-AppRed/15 text-lg font-semibold text-AppRed">
                {first_name ? (
                  first_name.charAt(0).toUpperCase()
                ) : (
                  <IoIosContact size={22} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {first_name || "Account"}
                </p>
                <p className="text-xs opacity-70">
                  {email || "Sign in to continue"}
                </p>
              </div>
            </div>
            <GoTriangleDown
              className={`transition ${AccountDrop ? "rotate-180" : ""}`}
            />
          </div>

          {AccountDrop ? (
            <div className="mt-3 rounded-2xl border border-AppRed/20 bg-AppRed/5 p-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-AppRed/15 text-lg font-semibold text-AppRed">
                  {first_name ? (
                    first_name.charAt(0).toUpperCase()
                  ) : (
                    <IoIosContact size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{first_name || "Guest"}</p>
                  <p className="text-xs opacity-70">
                    {email || "No profile yet"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {first_name ? (
                  <Link
                    to="/profile"
                    className="flex-1 rounded-xl bg-AppBlack px-3 py-2 text-center text-sm font-semibold text-white"
                    onClick={handleMenuDrop}
                  >
                    View profile
                  </Link>
                ) : (
                  <Link
                    to="/signin"
                    className="flex-1 rounded-xl bg-AppBlack px-3 py-2 text-center text-sm font-semibold text-white"
                    onClick={handleMenuDrop}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-AppRed/20 bg-AppRed/5 p-2">
            <input
              type="search"
              placeholder="Search meals..."
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
            <div className="rounded-xl bg-AppRed px-3 py-2 text-sm font-semibold text-white">
              Go
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {navsArr.map((item) => (
              <Link
                key={item.id}
                to={item.Link}
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-base font-semibold transition ${Selected === item.id ? "bg-AppRed text-white" : dark ? "bg-slate-900/80 text-AppWhite" : "bg-slate-100 text-AppBlack"}`}
                onClick={() => {
                  setSelected(item.id);
                  handleMenuDrop();
                }}
              >
                <span className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.nav}</span>
                </span>
                <span className="text-xs opacity-70">
                  {item.id === 4 ? `(${cartCount})` : ""}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-AppRed/20 bg-AppRed/5 p-3">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold ${dark ? "bg-slate-900/80 text-AppWhite" : "bg-white text-AppBlack"}`}
              onClick={() => {
                setDark((prev) => !prev);
                handleMenuDrop();
              }}
            >
              {dark ? <MdLightMode /> : <MdDarkMode />}
              {dark ? "Light mode" : "Dark mode"}
            </button>
            <Link
              to="/adminlogin"
              target="blank"
              className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold hover:bg-AppRed/10"
              onClick={handleMenuDrop}
            >
              <FaSignInAlt />
              Sign in as admin
            </Link>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-AppRed/10 pt-4">
            {first_name || email ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  handleMenuDrop();
                }}
                className="rounded-2xl border border-AppRed/20 px-3 py-2 text-sm font-semibold text-AppRed"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/signin"
                className="rounded-2xl border border-AppRed/20 px-3 py-2 text-sm font-semibold text-AppRed"
                onClick={handleMenuDrop}
              >
                Sign in
              </Link>
            )}
            <Link
              to="/signup"
              className="rounded-2xl bg-AppRed px-3 py-2 text-sm font-semibold text-white"
              onClick={handleMenuDrop}
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
