import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";
import { API_ENDPOINTS } from "../config/api";
import { currencyFormatter, successNotification } from "../utils/helper";

const FOODS_URL = API_ENDPOINTS.foods;

const normalizeFoods = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.foods)) return payload.foods;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && typeof payload === "object") {
    const nested = Object.values(payload).find((value) => Array.isArray(value));
    return Array.isArray(nested) ? nested : [];
  }
  return [];
};

const OrderFoodPage = () => {
  const { dark } = useContext(ThemeContext);
  const { data, loading, error } = useFetch(FOODS_URL);
  const [cartCount, setCartCount] = useState(0);

  const foods = useMemo(() => normalizeFoods(data), [data]);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem("food-cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        const count = Array.isArray(parsed)
          ? parsed.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
          : 0;
        setCartCount(count);
      }
    } catch {
      window.localStorage.removeItem("food-cart");
    }
  }, []);

  const addToCart = (food) => {
    const key = food.id || food._id || food.name;
    const storedCart = window.localStorage.getItem("food-cart");
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    const existing = parsedCart.find((item) => item.key === key);
    let nextCart = [];

    if (existing) {
      nextCart = parsedCart.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      nextCart = [
        ...parsedCart,
        {
          key,
          id: food.id || food._id || key,
          name: food.name || food.title || "Delicious meal",
          price: Number(food.price || food.amount || 0),
          image:
            food.image ||
            food.img ||
            food.image_url ||
            "/images/Plantain_srwjur.jpg",
          quantity: 1,
        },
      ];
    }

    window.localStorage.setItem("food-cart", JSON.stringify(nextCart));
    window.dispatchEvent(new Event("cart:update"));
    const nextCount = nextCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(nextCount);
    successNotification(`${food.name || food.title || "Meal"} added to cart`);
  };

  return (
    <div
      className={`min-h-screen px-3 py-24 sm:px-5 lg:px-8 ${
        dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[28px] border border-AppRed/20 bg-gradient-to-br from-AppRed/10 via-white to-AppRed/5 p-6 shadow-sm sm:p-8 dark:border-AppRed/30 dark:from-AppBlack dark:via-AppGray dark:to-AppBlack">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-AppRed">
                Order food
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">Pick your meal</h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base opacity-80">
                All meals posted by the admin appear here. Tap any meal to add
                it to your cart and continue to checkout.
              </p>
            </div>
            <Link
              to="/food"
              className="rounded-2xl border border-AppRed/20 bg-white/80 px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-AppRed hover:text-white dark:border-AppRed/20 dark:bg-AppBlack/70"
            >
              View cart ({cartCount})
            </Link>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[24px] border border-dashed border-AppRed/25 p-8 text-center text-sm opacity-80">
            Loading meals...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-amber-400/40 bg-amber-500/10 p-6 text-sm">
            We could not load the menu right now. Please try again shortly.
          </div>
        ) : foods.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-AppRed/25 p-8 text-center text-sm opacity-80">
            No meals have been posted by the admin yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {foods.map((food, index) => {
              const itemKey = food.id || food._id || food.name || index;
              const price = Number(food.price || food.amount || 0);
              const image =
                food.image ||
                food.img ||
                food.image_url ||
                "/images/Plantain_srwjur.jpg";

              return (
                <button
                  key={itemKey}
                  type="button"
                  onClick={() => addToCart(food)}
                  className={`overflow-hidden rounded-[24px] border text-left shadow-sm transition hover:-translate-y-1 ${
                    dark
                      ? "border-slate-800 bg-slate-900/80"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img
                      src={image}
                      alt={food.name || food.title || "Meal"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {food.name || food.title || "Signature meal"}
                        </h3>
                        <p className="mt-1 text-sm opacity-70">
                          {food.description ||
                            food.details ||
                            "Freshly prepared and served hot."}
                        </p>
                      </div>
                      <span className="rounded-full bg-AppRed/10 px-3 py-1 text-sm font-semibold text-AppRed">
                        {currencyFormatter(price)}
                      </span>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-AppRed">
                      Tap to add to cart
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFoodPage;
