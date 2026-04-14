import { useContext } from "react";
import { ThemeContext } from "../context/context";
import { Link } from "react-router";

const AboutPage = () => {
  const { dark } = useContext(ThemeContext);
  return (
    <div className={`py-16 ${dark ? "bg-AppGray" : ""}  w-full`}>
      <section className={`${dark ? "bg-AppGray" : "bg-AppWhite"}`}>
        <div className="bg-[url('/images/Gemini_Generated_Image_gkfl0qgkfl0qgkfl.png')] bg-no-repeat bg-cover bg-center h-[50vh] lg:h-max p-7 lg:p-20 mb-20 flex items-center">
          <div className="bg-AppBlack/65 mx-auto lg:mx-5 w-max h-max p-5 lg:p-10 flex flex-col items-center lg:items-end gap-4 rounded-2xl">
            <div className="font-black text-AppWhite flex flex-col items-center lg:items-end">
              <h6 className="text-3xl  lg:text-5xl"> Fresh, Local Ingredients:</h6>
             <div className=" text-xl lg:text-3xl"> Quality you can taste in every forkful.</div>
              <i className="w-full lg:text-end"> Enjoy your taste to the fullest...</i>
            </div>
            <Link to="/" className="bg-AppRed p-3 text-center text-AppWhite capitalize rounded-xl ">
              give it a trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
