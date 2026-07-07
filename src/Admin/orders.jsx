import { useContext } from "react";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";
import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";
import { API_ENDPOINTS } from "../config/api";

const OrdersPage = () => {
  const { dark } = useContext(ThemeContext);
  const { data, error, loading } = useFetch(API_ENDPOINTS.orders);

  const orders = Array.isArray(data) ? data : [];

  return (
    <div
      className={`min-h-screen py-4 sm:py-6 ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <section className="mx-auto max-w-7xl space-y-6 px-1 sm:px-2 lg:px-0">
        <div
          className={`rounded-[24px] border p-5 shadow-sm sm:p-6 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={`text-sm font-semibold uppercase tracking-[0.25em] ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Orders
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Recent order activity
              </h2>
            </div>
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}
            >
              Keep an eye on incoming customer requests.
            </div>
          </div>
        </div>

        {error ? (
          <AppError error={error} />
        ) : loading ? (
          <div
            className={`flex min-h-[280px] items-center justify-center rounded-[24px] border ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <Apploader size={50} />
          </div>
        ) : orders.length ? (
          <div className="grid  gap-4 lg:grid-cols-2">
            {orders.map((order, index) => (
              <div
                key={order.id || index}
                className={`rounded-[24px] border p-5 shadow-sm ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-[0.25em] ${dark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Order #{index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {order.order_date || "Unknown date"}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${dark ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600"}`}
                  >
                    Active
                  </span>
                </div>
                <div
                  className={`mt-4 rounded-2xl border p-4 text-sm ${dark ? "border-slate-800 bg-slate-950/60 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                >
                  {order.details || "No order details provided yet."}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-[24px] border p-8 text-center text-sm ${dark ? "border-slate-800 bg-slate-900/80 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}
          >
            No orders found yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
