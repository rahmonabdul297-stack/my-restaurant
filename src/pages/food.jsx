import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";
import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "../services/apiClient";
import {
  currencyFormatter,
  errorNotification,
  successNotification,
} from "../utils/helper";

const FOODS_URL = API_ENDPOINTS.foods;
const ORDER_URL = API_ENDPOINTS.order;

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

const FoodPage = () => {
  const { dark } = useContext(ThemeContext);
  const { data, loading, error } = useFetch(FOODS_URL);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem("food-cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        window.localStorage.removeItem("food-cart");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("food-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart:update"));
  }, [cart]);

  const foods = useMemo(() => normalizeFoods(data), [data]);

  const addToCart = (food) => {
    const key = food.id || food._id || food.name;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prev,
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
    });
  };

  const updateQuantity = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const ensureTableExists = async () => {
    const storedTableId = window.localStorage.getItem("restaurant-table-id");
    if (storedTableId) return storedTableId;

    const tableCandidates = [
      {
        endpoint: API_ENDPOINTS.table,
        payload: { table_id: "table-1", name: "table-1", status: "occupied" },
      },
      {
        endpoint: API_ENDPOINTS.tables,
        payload: { table_id: "table-1", name: "table-1", status: "occupied" },
      },
      {
        endpoint: API_ENDPOINTS.table,
        payload: { table_id: "table-1", name: "table-1" },
      },
      {
        endpoint: API_ENDPOINTS.tables,
        payload: { table_id: "table-1", name: "table-1" },
      },
      {
        endpoint: API_ENDPOINTS.table,
        payload: { id: "table-1", name: "table-1", status: "occupied" },
      },
      {
        endpoint: API_ENDPOINTS.tables,
        payload: { id: "table-1", name: "table-1", status: "occupied" },
      },
    ];

    for (const candidate of tableCandidates) {
      try {
        const response = await apiRequest(candidate.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: candidate.payload,
        });

        if (response.ok || response.status === 201) {
          const tableData =
            response.data && typeof response.data === "object"
              ? response.data
              : null;
          const nextTableId =
            tableData?.table_id ||
            tableData?.id ||
            tableData?.name ||
            candidate.payload.table_id ||
            candidate.payload.id ||
            "table-1";
          window.localStorage.setItem(
            "restaurant-table-id",
            String(nextTableId),
          );
          return String(nextTableId);
        }
      } catch (error) {
        console.warn("Table creation attempt failed", error);
      }
    }

    const fallbackTableId = "table-1";
    window.localStorage.setItem("restaurant-table-id", fallbackTableId);
    return fallbackTableId;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      errorNotification("Your cart is empty.");
      return;
    }

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !customerAddress.trim()
    ) {
      errorNotification("Please add your name, phone number, and address.");
      return;
    }

    setSubmitting(true);
    const details = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join(" | ");

    const tableId = await ensureTableExists();

    const payload = {
      order_id: `ord-${Date.now()}`,
      table_id: tableId,
      order_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_name: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      details,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await apiRequest(ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: payload,
      });

      if (response.ok || response.status === 201) {
        successNotification("Order placed successfully!");
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
      } else {
        const message =
          (response.data && (response.data.message || response.data.error)) ||
          "Could not place the order right now. Please try again.";
        errorNotification(message);
      }
    } catch (error) {
      console.error("Order placement failed", error);
      errorNotification(
        "Could not place the order right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-3 py-24 sm:px-5 lg:px-8 ${
        dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[28px] border border-AppRed/20 bg-gradient-to-br from-AppRed/10 via-white to-AppRed/5 p-6 shadow-sm sm:p-8 dark:border-AppRed/30 dark:from-AppBlack dark:via-AppGray dark:to-AppBlack">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-AppRed">
            Fresh picks
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Food menu</h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base opacity-80">
                Browse our meals, add favorites to your cart, and place your
                order in a few clicks.
              </p>
            </div>
            <div className="rounded-2xl border border-AppRed/20 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-AppRed/20 dark:bg-AppBlack/70">
              <span className="font-semibold">{totalItems}</span> item
              {totalItems === 1 ? "" : "s"} in cart
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
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
                No meals are available yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {foods.map((food, index) => {
                  const itemKey = food.id || food._id || food.name || index;
                  const price = Number(food.price || food.amount || 0);
                  const image =
                    food.image ||
                    food.img ||
                    food.image_url ||
                    "/images/Plantain_srwjur.jpg";

                  return (
                    <article
                      key={itemKey}
                      className={`overflow-hidden rounded-[24px] border shadow-sm ${
                        dark
                          ? "border-slate-800 bg-slate-900/80"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="h-40 overflow-hidden bg-slate-100">
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
                        <button
                          type="button"
                          onClick={() => addToCart(food)}
                          className="mt-4 w-full rounded-2xl bg-AppRed px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-AppRed/90"
                        >
                          Add to cart
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section
              className={`rounded-[24px] border p-5 shadow-sm ${
                dark
                  ? "border-slate-800 bg-slate-900/80"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your cart</h3>
                <span className="rounded-full bg-AppRed/10 px-3 py-1 text-sm font-semibold text-AppRed">
                  {totalItems} item{totalItems === 1 ? "" : "s"}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-AppRed/20 p-4 text-sm opacity-80">
                  Your selected meals will appear here.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                        dark
                          ? "border-slate-800 bg-slate-950/60"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm opacity-70">
                          {currencyFormatter(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, -1)}
                          className="h-8 w-8 rounded-full border border-AppRed/20 text-lg"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, 1)}
                          className="h-8 w-8 rounded-full border border-AppRed/20 text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-AppRed/20 bg-AppRed/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="font-semibold">
                    {currencyFormatter(totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            <section
              className={`rounded-[24px] border p-5 shadow-sm ${
                dark
                  ? "border-slate-800 bg-slate-900/80"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-xl font-semibold">Place your order</h3>
              <form className="mt-4 space-y-3" onSubmit={handlePlaceOrder}>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                />
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Delivery address"
                  rows="4"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-AppBlack px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-AppRed disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
