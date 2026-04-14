import { useContext } from "react";
import { ThemeContext } from "../context/context";
import { footerArr, footerContactArr } from "./Arrays";
import { Link } from "react-router";
import Logo from "./Logo";
import { FaRegCopyright } from "react-icons/fa";

const GeneralFooter = () => {
  const { dark } = useContext(ThemeContext);
  return (
    <div
      className={`${dark ? "bg-AppBlack text-AppWhite" : "bg-AppRed"} h-max py-10  polygons font-[ubuntu-sans-mono-font ]`}
    >
      <section className="container flex flex-col lg:flex-row   gap-8 lg:gap-32">
        <div className="flex flex-col justify-center">
          <div className="text-AppWhite font-bold text-2xl capitalize">
            {" "}
            Quick links
          </div>
          <div className="flex flex-col text-AppWhite font-[ubuntu-sans-mono-font] capitalize gap-2">
            {footerArr.map((footerNav) => (
              <Link key={footerNav.id} to={footerNav.Link}>
                {footerNav.nav}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-AppWhite font-bold text-2xl capitalize">
            {" "}
            contact us
          </div>
          <div className="flex flex-col text-AppWhite font-[ubuntu-sans-mono-font] capitalize gap-2">
            {footerContactArr.map((footerContact) => (
              <Link
                key={footerContact.id}
                to={footerContact.Link}
                className="flex items-center gap-2"
              >
                {footerContact.icon}
                {footerContact.nav}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-AppWhite font-bold text-2xl">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your Email Address"
            className="border-solid border-2 border-AppWhite"
          />
          <div
            className={`text-AppWhite text-center py-2 rounded-2xl ${dark ? "bg-AppRed" : "bg-AppBlack"} capitalize`}
          >
            subscribe
          </div>
        </div>
      </section>

      <section className="pt-5">
        <div className="flex flex-col items-center justify-center py-5 gap-3">
          {" "}
          <Logo />
          <span className="text-AppWhite capitalize">Quality you can taste in every forkful</span>
        </div>
        <div className="flex items-center text-AppWhite gap-2 justify-center border-t-2 pt-2"><FaRegCopyright /> 2026 copyright all reserved</div>
      </section>
    </div>
  );
};

export default GeneralFooter;
