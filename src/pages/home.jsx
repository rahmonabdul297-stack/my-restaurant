import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/context";
import { GoDot, GoDotFill } from "react-icons/go";
import useFetch from "../hooks/useFetch";
import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";
import { ourMeal } from "../components/Arrays";
import { Link } from "react-router";

const HomePage = () => {
  const { dark } = useContext(ThemeContext);
  const url = "https://restaurant-management-f9kx.onrender.com/api/v1/foods";
  const [Food, setFood] = useState(0);
  const foodArr = [
    "/images/Jollof.jpg",
    "/images/spag.jpg",
    "/images/egusi.jpg",
    "/images/okra.jpg",
  ];
  const ChangingImage = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setFood((prevIndex) =>
          prevIndex === foodArr.length - 1 ? 0 : prevIndex + 1,
        );
      }, 5000); // 120000ms = 2 minutes

      return () => clearInterval(interval); // cleanup
    }, []);
  };
  ChangingImage();

  const { data, error, loading } = useFetch(url);
  return (
    <div className={`pt-16 bg-[url("/images/egusi.jpg")]   w-full bg-cover bg-no-repeat bg-center bg-fixed `}>
      <section className={`${dark ? "bg-AppGray" : "bg-AppWhite"} pb-10`}>
        <div
          className="background_anim flex items-center text-5xl font-bold text-AppWhite p-10"
          style={{ backgroundImage: `url(${foodArr[Food]})` }}
        >
          <div className="capitalize text-4xl lg:text-7xl">
            {" "}
            {Food === 0
              ? "fried rice"
              : Food === 1
                ? "jollof spagetti"
                : Food === 2
                  ? "egusi soup"
                  : Food === 3
                    ? "seafood okro soup"
                    : null}{" "}
          </div>
        </div>
        <div className="mt-10 text-center flex gap-3 items-center justify-center">
          <div onClick={() => setFood(0)}>
            {Food === 0 ? <GoDot /> : <GoDotFill />}
          </div>{" "}
          <div onClick={() => setFood(1)}>
            {Food === 1 ? <GoDot /> : <GoDotFill />}
          </div>{" "}
          <div onClick={() => setFood(2)}>
            {Food === 2 ? <GoDot /> : <GoDotFill />}
          </div>{" "}
          <div onClick={() => setFood(3)}>
            {Food === 3 ? <GoDot /> : <GoDotFill />}
          </div>{" "}
        </div>
      </section>
        
<section className="bg-AppBlack/55 text-AppWhite py-20">
<h5 className="text-AppWhite my-5 border-b-2 border-AppRed w-[200px] mx-auto">about us</h5>
<div className="container text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti maxime voluptas consequatur? Quidem blanditiis dolor quaerat consequatur tempora nulla excepturi nihil accusantium veniam perspiciatis, beatae accusamus cupiditate ullam mollitia in! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam assumenda accusamus aut ipsa tenetur? Quasi exercitationem et deserunt ullam dolores, debitis impedit iusto neque. Veritatis culpa doloribus quo, facilis nam perspiciatis placeat est assumenda. Ut beatae, et, possimus magni repudiandae repellendus hic nam ullam laboriosam excepturi minus fugiat ex sequi animi sed provident maiores qui cum eaque, ducimus molestiae. Optio.</div>
<div className="flex justify-end p-5">
  <Link to="/about" className={`w-28 text-center px-4 py-1.5 rounded-xl ${dark?"bg-AppBlack":"bg-AppRed"}`}>read more </Link>
</div>
</section>

      <section className={`${dark ? "bg-AppGray" : "bg-AppWhite"} py-10`}>
        <div className="capitalize text-black font-bold text-4xl w-[300px] border-b-4 border-b-AppRed  mx-auto text-center py-2">
          Our Meals
        </div>

      
          <section className="container py-10 flex flex-col lg:flex-row justify-between gap-10 items-center font-bold text-xl capitalize text-center mealAnim">
          {Array.isArray(data) ? (
            data.map((food) => (
              <div key={food.id}>
                <img src={food.food_image} alt="" srcset="" />
                {food.name}
              </div>
            ))
          ) : error ? (
            <AppError error={error} />
          ) : loading ? (
            <Apploader  />
          ) : (
            ourMeal.map((meal) => (
              <div key={meal.id} className="w-[600px]">
                <img src={meal.img} alt="image" className="h-60 w-full" />
                <div className={`${dark ? "bg-AppBlack" : "bg-AppRed"} text-AppWhite`}>
                  {meal.name}
                </div>
              </div>
            ))
          )}
        </section>
        
      </section>
    </div>
  );
};

export default HomePage;
