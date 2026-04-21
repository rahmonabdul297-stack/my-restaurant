import { useContext, useMemo } from "react";
import { Link } from "react-router";
import { ClipLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";

const USERS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/users";
const FOODS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/foods";
const ORDERS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/orders";
const MENUS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/menus";

/** Normalise list endpoints that may return an array or `{ key: [] }`. */
const countListPayload = (payload, nestedKeys = []) => {
  if (!payload) return 0;
  if (Array.isArray(payload)) return payload.length;
  for (const key of nestedKeys) {
    if (Array.isArray(payload[key])) return payload[key].length;
  }
  return 0;
};

/** Matches overview cards: meals, users, orders, menus */
const CHART_COLORS = ["#22c55e", "#ec190e", "#3b82f6", "#a855f7"];

const AdminDashboard = () => {
  const { dark } = useContext(ThemeContext);
  const { data: usersData, loading: usersLoading } = useFetch(USERS_URL);
  const { data: foodsData, loading: foodsLoading } = useFetch(FOODS_URL);
  const { data: ordersData, loading: ordersLoading } = useFetch(ORDERS_URL);
  const { data: menusData, loading: menusLoading } = useFetch(MENUS_URL);

  const listedFoodsCount = useMemo(
    () => countListPayload(foodsData, ["food_items"]),
    [foodsData],
  );
  const listedOrdersCount = useMemo(
    () => countListPayload(ordersData, ["orders"]),
    [ordersData],
  );
  const listedMenusCount = useMemo(
    () => countListPayload(menusData, ["menus"]),
    [menusData],
  );
  const usersCount = useMemo(() => countListPayload(usersData), [usersData]);

  const chartData = useMemo(
    () => [
      { name: "Meals", value: listedFoodsCount },
      { name: "Users", value: usersCount },
      { name: "Orders", value: listedOrdersCount },
      { name: "Menus", value: listedMenusCount },
    ],
    [
      listedFoodsCount,
      usersCount,
      listedOrdersCount,
      listedMenusCount,
    ],
  );

  const metricsTotal = useMemo(
    () => chartData.reduce((sum, row) => sum + row.value, 0),
    [chartData],
  );

  const chartsLoading =
    usersLoading || foodsLoading || ordersLoading || menusLoading;

  const linkClass =
    dark
      ? "rounded-xl border border-AppGray bg-AppBlack/40 px-4 py-2 text-sm font-semibold capitalize text-AppWhite hover:bg-AppGray/30 transition-colors"
      : "rounded-xl border border-AppRed/40 bg-AppWhite px-4 py-2 text-sm font-semibold capitalize text-AppBlack hover:bg-AppRed/10 transition-colors";
  return (
    <div className="py-40 flex justify-center items-center">
      <section className="ml-[100px] lg:ml-[100px]">
        <h5
          className={
            dark
              ? "text-AppBlack font-bold capitalize text-2xl  lg:text-4xl px-8 py-4"
              : "text-AppRed  font-bold capitalize  text-2xl lg:text-4xl px-8 py-4"
          }
        >
          dashboard overviews
        </h5>
        <nav
          className="mb-4 flex flex-wrap gap-2 px-8"
          aria-label="Admin quick links"
        >
          <Link to="/foods" className={linkClass}>
            Meals
          </Link>
          <Link to="/users" className={linkClass}>
            Users
          </Link>
          <Link to="/orders" className={linkClass}>
            Orders
          </Link>
          <Link to="/menu" className={linkClass}>
            Menus
          </Link>
        </nav>
        <section className="flex justify-between gap-3 px-8  flex-col lg:flex-row">
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total meals available
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              {foodsLoading ? "…" : listedFoodsCount}
            </div>
          </div>
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total users
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              {usersLoading ? "…" : usersCount}
            </div>
          </div>  
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total orders listed
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              {ordersLoading ? "…" : listedOrdersCount}
            </div>
          </div>
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total menus listed
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              {menusLoading ? "…" : listedMenusCount}
            </div>
          </div>
        </section>
        <h5
          className={
            dark
              ? "text-AppBlack font-bold capitalize text-2xl  lg:text-4xl px-8 py-4"
              : "text-AppRed  font-bold capitalize  text-2xl  lg:text-4xl px-8 py-4"
          }
        >
          chart overviews
        </h5>
        <p
          className={
            dark
              ? "px-8 pb-2 text-sm text-AppWhite/70"
              : "px-8 pb-2 text-sm text-AppBlack/70"
          }
        >
          Bar chart compares raw counts; pie chart shows each metric&apos;s
          share of the combined total (same numbers as the cards above).
        </p>
        <section className="flex flex-col items-stretch justify-between gap-5 px-8 lg:flex-row">
          {chartsLoading ? (
            <div
              className={
                dark
                  ? "flex min-h-[320px] w-full items-center justify-center rounded-xl border-2 border-AppGray bg-AppBlack/55"
                  : "flex min-h-[320px] w-full items-center justify-center rounded-xl border-2 border-AppRed bg-AppWhite"
              }
            >
              <ClipLoader
                color={dark ? "#ffffff" : "#ec190e"}
                aria-label="Loading charts"
              />
            </div>
          ) : (
            <>
              <div
                className={
                  dark
                    ? "w-full min-w-0 flex-1 rounded-xl border-2 border-AppGray bg-AppBlack/55 p-4 pt-6 lg:w-[50%]"
                    : "w-full min-w-0 flex-1 rounded-xl border-2 border-AppRed bg-AppWhite p-4 pt-6 lg:w-[50%]"
                }
              >
                <h6
                  className={
                    dark
                      ? "mb-2 text-center text-sm font-bold uppercase tracking-wide text-AppWhite"
                      : "mb-2 text-center text-sm font-bold uppercase tracking-wide text-AppBlack"
                  }
                >
                  Counts by category
                </h6>
                <div className="h-[280px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={dark ? "#4b5563" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: dark ? "#f9fafb" : "#111827", fontSize: 12 }}
                        axisLine={{ stroke: dark ? "#6b7280" : "#9ca3af" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: dark ? "#f9fafb" : "#111827", fontSize: 12 }}
                        axisLine={{ stroke: dark ? "#6b7280" : "#9ca3af" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: dark ? "#111827" : "#ffffff",
                          border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "0.5rem",
                          color: dark ? "#f9fafb" : "#111827",
                        }}
                        formatter={(value) => [
                          `${value} (${metricsTotal ? Math.round((Number(value) / metricsTotal) * 100) : 0}% of total)`,
                          "Listed",
                        ]}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Listed">
                        {chartData.map((_, index) => (
                          <Cell
                            key={`bar-${index}`}
                            fill={CHART_COLORS[index]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div
                className={
                  dark
                    ? "w-full min-w-0 flex-1 rounded-xl border-2 border-AppGray bg-AppBlack/55 p-4 pt-6 lg:w-[50%]"
                    : "w-full min-w-0 flex-1 rounded-xl border-2 border-AppRed bg-AppWhite p-4 pt-6 lg:w-[50%]"
                }
              >
                <h6
                  className={
                    dark
                      ? "mb-2 text-center text-sm font-bold uppercase tracking-wide text-AppWhite"
                      : "mb-2 text-center text-sm font-bold uppercase tracking-wide text-AppBlack"
                  }
                >
                  Share of combined total
                </h6>
                <div className="h-[280px] w-full min-w-0">
                  {metricsTotal > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={88}
                          paddingAngle={2}
                          labelLine={false}
                          label={false}
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`pie-${index}`}
                              fill={CHART_COLORS[index]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: dark ? "#111827" : "#ffffff",
                            border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "0.5rem",
                            color: dark ? "#f9fafb" : "#111827",
                          }}
                          formatter={(value, _name, item) => {
                            const pct = metricsTotal
                              ? Math.round(
                                  (Number(value) / metricsTotal) * 100,
                                )
                              : 0;
                            return [`${value} listed (${pct}%)`, item.payload.name];
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: dark ? "#f9fafb" : "#111827",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div
                      className={
                        dark
                          ? "flex h-full items-center justify-center px-4 text-center text-sm text-AppWhite/70"
                          : "flex h-full items-center justify-center px-4 text-center text-sm text-AppBlack/70"
                      }
                    >
                      Add meals, users, orders, or menus so the share chart
                      has a non-zero total.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </div>
  );
};

export default AdminDashboard;
