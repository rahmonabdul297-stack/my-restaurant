import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "../context/context";
import { GoDot, GoDotFill } from "react-icons/go";
import { ourMeal } from "../components/Arrays";
import { Link } from "react-router";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { NotesList } from "./Note";
import { MdLocalShipping, MdOutlineRestaurantMenu, MdSecurity } from "react-icons/md";

const HomePage = () => {
  const { dark } = useContext(ThemeContext);

  const [Food, setFood] = useState(0);
  /** Mobile "Our Meals" carousel index */
  const [mobileMealIndex, setMobileMealIndex] = useState(0);
  const touchStartX = useRef(null);
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

  const displayMeals = useMemo(
    () =>
      ourMeal.map((m) => ({
        id: m.id,
        food_id: m.id,
        name: m.name,
        food_image: m.img,
        price: undefined,
      })),
    [],
  );

  useEffect(() => {
    setMobileMealIndex(0);
  }, []);

  const mobileMealCount = displayMeals.length;
  const currentMobileMeal =
    mobileMealCount > 0
      ? displayMeals[Math.min(mobileMealIndex, mobileMealCount - 1)]
      : null;

  const goMobilePrev = () => setMobileMealIndex((i) => Math.max(0, i - 1));
  const goMobileNext = () =>
    setMobileMealIndex((i) => {
      const max = Math.max(0, mobileMealCount - 1);
      return Math.min(max, i + 1);
    });

  const onMobileTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onMobileTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const startX = touchStartX.current;
    touchStartX.current = null;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) return;
    const dx = endX - startX;
    if (dx > 56) goMobilePrev();
    else if (dx < -56) goMobileNext();
  };

  return (
    <div
      className={`relative pt-16 bg-[url("/images/egusi.jpg")] w-full bg-cover bg-no-repeat bg-center bg-fixed`}
    >
      <section className={`${dark ? "bg-AppGray" : "bg-AppWhite"} pb-10`}>
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -left-1/4 top-0 h-[120%] w-1/2 rounded-full bg-AppRed/25 blur-[100px] home-orb-a"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-1/4 bottom-0 h-full w-1/2 rounded-full bg-AppWhite/15 blur-[90px] home-orb-b"
            aria-hidden
          />

          <div
            className="home-hero-ken relative z-10 flex min-h-[50vh] items-center justify-center bg-no-repeat bg-center bg-cover p-10 text-5xl font-bold text-AppWhite lg:min-h-[80vh]"
            style={{ backgroundImage: `url(${foodArr[Food]})` }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
              aria-hidden
            >
              <div className="home-hero-scan absolute inset-x-0 top-0 h-1/3 w-full" />
            </div>
            <div className="home-hero-title relative z-30 max-w-[95vw] text-center capitalize drop-shadow-lg lg:max-w-[85vw]">
              <span className="block text-4xl lg:text-7xl">
                {Food === 0
                  ? "fried rice"
                  : Food === 1
                    ? "jollof spagetti"
                    : Food === 2
                      ? "egusi soup"
                      : Food === 3
                        ? "seafood okro soup"
                        : null}
              </span>
            </div>
          </div>
        </div>
        <div className="home-dots-row mt-10 flex cursor-pointer items-center justify-center gap-3 text-AppRed">
          <div onClick={() => setFood(0)}>
            {Food === 0 ? <GoDot /> : <GoDotFill />}
          </div>
          <div onClick={() => setFood(1)}>
            {Food === 1 ? <GoDot /> : <GoDotFill />}
          </div>
          <div onClick={() => setFood(2)}>
            {Food === 2 ? <GoDot /> : <GoDotFill />}
          </div>
          <div onClick={() => setFood(3)}>
            {Food === 3 ? <GoDot /> : <GoDotFill />}
          </div>
        </div>
      </section>

      <section className="home-about-pulse bg-AppBlack/55 py-20 text-AppWhite">
        <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="text-center lg:text-left">
            <h5 className="mx-auto mb-5 w-[200px] border-b-2 border-AppRed text-center text-AppWhite lg:mx-0">
              about us
            </h5>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <NotesList />
            </div>
            <div className="mt-5 flex justify-center lg:justify-start">
              <Link
                to="/about"
                className={`w-32 rounded-2xl px-4 py-2.5 text-center font-semibold ${dark ? "bg-AppBlack" : "bg-AppRed"}`}
              >
                Read more
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                title: "Freshly prepared",
                subtitle: "Chef-led meals delivered with bold flavour and clean presentation.",
                icon: <MdOutlineRestaurantMenu size={22} />,
              },
              {
                title: "Fast checkout",
                subtitle: "A simple order process with secure cart handling and instant updates.",
                icon: <MdLocalShipping size={22} />,
              },
              {
                title: "Trusted support",
                subtitle: "Our team helps you keep your account and orders in great shape.",
                icon: <MdSecurity size={22} />,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] border border-white/10 bg-AppWhite/10 p-4 text-left backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-AppRed/20 text-AppRed">
                  {item.icon}
                </div>
                <h6 className="text-base font-semibold">{item.title}</h6>
                <p className="mt-2 text-sm opacity-80">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${dark ? "bg-AppGray" : "bg-AppWhite"} py-10`}>
        <div
          className={`home-meals-head mx-auto w-[300px] border-b-4 border-b-AppRed py-2 text-center text-4xl font-bold capitalize ${
            dark ? "text-AppWhite" : "text-AppBlack"
          }`}
        >
          Our Meals
        </div>

        <section className="container hidden lg:grid grid-cols-4 gap-3 py-10 text-center text-xl font-bold capitalize ">
          {displayMeals.slice(0, 4).map((meal) => (
            <div
              key={meal.id}
              className="home-meal-card group overflow-hidden rounded-xl ring-2 ring-transparent transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:ring-AppRed/60"
            >
              <img
                src={meal.food_image}
                alt={meal.name}
                className="h-60 w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
              <div
                className={`${dark ? "bg-AppBlack" : "bg-AppRed"} text-AppWhite`}
              >
                {meal.name}
              </div>
            </div>
          ))}
        </section>

        <section
          className={`lg:hidden container px-3 py-10 ${
            dark ? "text-AppWhite" : "text-AppBlack"
          }`}
        >
          {!currentMobileMeal ? (
            <p className="py-12 text-center text-sm opacity-80">
              No meals to show yet.
            </p>
          ) : (
            <div className="mx-auto w-full max-w-md">
              <div
                className={`overflow-hidden rounded-2xl border-2 shadow-lg transition-colors ${
                  dark
                    ? "border-AppGray/60 bg-AppBlack/50"
                    : "border-AppRed/35 bg-AppWhite"
                }`}
                onTouchStart={onMobileTouchStart}
                onTouchEnd={onMobileTouchEnd}
              >
                <div className="flex min-h-[280px] items-stretch">
                  <button
                    type="button"
                    aria-label="Previous meal"
                    disabled={mobileMealIndex <= 0}
                    onClick={goMobilePrev}
                    className={`flex w-11 shrink-0 items-center justify-center text-2xl transition disabled:opacity-30 ${
                      dark
                        ? "bg-AppBlack text-AppRed hover:bg-AppBlack/80"
                        : "bg-AppGray/30 text-AppRed hover:bg-AppRed/15"
                    }`}
                  >
                    <FaAngleLeft />
                  </button>

                  <div className="min-w-0 flex-1">
                    <img
                      src={currentMobileMeal.food_image || "/images/Jollof.jpg"}
                      alt={currentMobileMeal.name || "Meal"}
                      className="h-56 w-full object-cover"
                    />
                    <div
                      className={`space-y-1 px-3 py-3 text-center text-AppWhite ${
                        dark ? "bg-AppBlack" : "bg-AppRed"
                      }`}
                    >
                      <div className="text-lg font-bold capitalize">
                        {currentMobileMeal.name || "Unnamed meal"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Next meal"
                    disabled={mobileMealIndex >= mobileMealCount - 1}
                    onClick={goMobileNext}
                    className={`flex w-11 shrink-0 items-center justify-center text-2xl transition disabled:opacity-30 ${
                      dark
                        ? "bg-AppBlack text-AppRed hover:bg-AppBlack/80"
                        : "bg-AppGray/30 text-AppRed hover:bg-AppRed/15"
                    }`}
                  >
                    <FaAngleRight />
                  </button>
                </div>
              </div>

              {mobileMealCount > 1 ? (
                <div
                  className="mt-5 flex flex-wrap items-center justify-center gap-2"
                  role="tablist"
                  aria-label="Meal slides"
                >
                  {displayMeals.map((mealItem, i) => (
                    <button
                      key={mealItem.food_id || mealItem.id || i}
                      type="button"
                      role="tab"
                      aria-selected={i === mobileMealIndex}
                      aria-label={`Show meal ${i + 1}`}
                      onClick={() => setMobileMealIndex(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        i === mobileMealIndex
                          ? "w-8 bg-AppRed"
                          : "w-2.5 bg-AppGray dark:bg-AppGray/60"
                      }`}
                    />
                  ))}
                </div>
              ) : null}

              {mobileMealCount > 1 ? (
                <p
                  className={`mt-2 text-center text-xs ${
                    dark ? "text-AppRed" : "text-AppBlack/60"
                  }`}
                >
                  Swipe the card or use arrows · {mobileMealIndex + 1} /{" "}
                  {mobileMealCount}
                </p>
              ) : null}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default HomePage;
