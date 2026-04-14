import { useContext } from "react";
import { ThemeContext } from "../context/context";

const TeamPage = () => {
      const { dark } = useContext(ThemeContext);
  return (
    <div
      className={`py-20 ${dark ? "bg-AppGray" : ""} h-[70vh] w-full font-black text-7xl flex items-center justify-center`}
    >
      yourorders
    </div>
  );
};

export default TeamPage;
