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
import MetricCard from "./components/MetricCard";
import ActivityPanel from "./components/ActivityPanel";
import { API_ENDPOINTS } from "../config/api";

const USERS_URL = API_ENDPOINTS.users;
const FOODS_URL = API_ENDPOINTS.foods;
const ORDERS_URL = API_ENDPOINTS.orders;
const MENUS_URL = API_ENDPOINTS.menus;

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
    [listedFoodsCount, usersCount, listedOrdersCount, listedMenusCount],
  );

  const metricsTotal = useMemo(
    () => chartData.reduce((sum, row) => sum + row.value, 0),
    [chartData],
  );

  const chartsLoading =
    usersLoading || foodsLoading || ordersLoading || menusLoading;

  const linkClass = dark
    ? "rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-semibold capitalize text-slate-100 transition-colors hover:bg-slate-800"
    : "rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 transition-colors hover:bg-indigo-50";

  const statCards = [
    {
      title: "Meals",
      value: foodsLoading ? "…" : listedFoodsCount,
      subtitle: "Available for customers",
      accent: dark
        ? "from-emerald-500 to-teal-500"
        : "from-emerald-500 to-teal-500",
      icon: "🍽️",
    },
    {
      title: "Users",
      value: usersLoading ? "…" : usersCount,
      subtitle: "Registered accounts",
      accent: dark ? "from-sky-500 to-cyan-500" : "from-sky-500 to-cyan-500",
      icon: "👥",
    },
    {
      title: "Orders",
      value: ordersLoading ? "…" : listedOrdersCount,
      subtitle: "Active order entries",
      accent: dark
        ? "from-amber-500 to-orange-500"
        : "from-amber-500 to-orange-500",
      icon: "🛒",
    },
    {
      title: "Menus",
      value: menusLoading ? "…" : listedMenusCount,
      subtitle: "Curated collections",
      accent: dark
        ? "from-violet-500 to-fuchsia-500"
        : "from-violet-500 to-fuchsia-500",
      icon: "📋",
    },
  ];

  const activityItems = useMemo(
    () => [
      {
        label: "Latest meals",
        detail: listedFoodsCount
          ? `${listedFoodsCount} menu items are ready for customers`
          : "Add a meal to start the catalog",
        value: foodsLoading ? "…" : listedFoodsCount,
      },
      {
        label: "Customer accounts",
        detail: usersCount
          ? `${usersCount} accounts registered`
          : "No users fetched yet",
        value: usersLoading ? "…" : usersCount,
      },
      {
        label: "Pending orders",
        detail: listedOrdersCount
          ? `${listedOrdersCount} orders in the backend`
          : "No order data yet",
        value: ordersLoading ? "…" : listedOrdersCount,
      },
    ],
    [
      foodsLoading,
      listedFoodsCount,
      listedOrdersCount,
      ordersLoading,
      usersCount,
      usersLoading,
    ],
  );

  const quickActions = useMemo(
    () => [
      {
        label: "Create a meal",
        href: "/foods",
        detail: "Post new dishes and upload images",
      },
      {
        label: "Create a menu",
        href: "/menu",
        detail: "Organize reusable menu IDs",
      },
      {
        label: "Review users",
        href: "/users",
        detail: "Track account activity",
      },
      {
        label: "Manage orders",
        href: "/orders",
        detail: "Monitor purchase requests",
      },
    ],
    [],
  );

  return (
    <div
      className={`min-h-screen overflow-x-hidden px-3 py-6 sm:px-4 lg:px-6 ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <section className="mx-auto w-full max-w-7xl rounded-[28px] border border-slate-200/70 bg-white/80 p-3 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5 lg:p-7 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)]">
        <div
          className={`rounded-[24px] border p-6 sm:p-8 ${dark ? "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" : "border-indigo-100 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white"}`}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${dark ? "bg-white/10 text-slate-200" : "bg-white/15 text-slate-100"}`}
              >
                Operations Center
              </div>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Ecommerce Admin Dashboard
              </h2>
              <p
                className={`mt-3 text-sm sm:text-base ${dark ? "text-slate-300" : "text-slate-200"}`}
              >
                Monitor meals, customers, orders, and menus from one polished
                control panel.
              </p>
            </div>
            <nav
              className="flex flex-wrap gap-2"
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
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <MetricCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              accent={card.accent}
              dark={dark}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div
            className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.24em] ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Inventory overview
                </p>
                <h3
                  className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  Category distribution
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}
              >
                Live data
              </span>
            </div>
            {chartsLoading ? (
              <div
                className={`flex min-h-[320px] items-center justify-center rounded-xl border ${dark ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"}`}
              >
                <ClipLoader
                  color={dark ? "#ffffff" : "#4f46e5"}
                  aria-label="Loading charts"
                />
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={dark ? "#334155" : "#e2e8f0"}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: dark ? "#f8fafc" : "#0f172a",
                        fontSize: 12,
                      }}
                      axisLine={{ stroke: dark ? "#64748b" : "#94a3b8" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: dark ? "#f8fafc" : "#0f172a",
                        fontSize: 12,
                      }}
                      axisLine={{ stroke: dark ? "#64748b" : "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dark ? "#020617" : "#ffffff",
                        border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                        borderRadius: "0.75rem",
                        color: dark ? "#f8fafc" : "#0f172a",
                      }}
                      formatter={(value) => [
                        `${value} (${metricsTotal ? Math.round((Number(value) / metricsTotal) * 100) : 0}% of total)`,
                        "Listed",
                      ]}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Listed">
                      {chartData.map((_, index) => (
                        <Cell key={`bar-${index}`} fill={CHART_COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div
            className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.24em] ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Business health
                </p>
                <h3
                  className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  Share of total activity
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${dark ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600"}`}
              >
                Balanced view
              </span>
            </div>
            {chartsLoading ? (
              <div
                className={`flex min-h-[320px] items-center justify-center rounded-xl border ${dark ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"}`}
              >
                <ClipLoader
                  color={dark ? "#ffffff" : "#4f46e5"}
                  aria-label="Loading charts"
                />
              </div>
            ) : (
              <div className="h-[300px] w-full">
                {metricsTotal > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={92}
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
                          backgroundColor: dark ? "#020617" : "#ffffff",
                          border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                          borderRadius: "0.75rem",
                          color: dark ? "#f8fafc" : "#0f172a",
                        }}
                        formatter={(value, _name, item) => {
                          const pct = metricsTotal
                            ? Math.round((Number(value) / metricsTotal) * 100)
                            : 0;
                          return [
                            `${value} listed (${pct}%)`,
                            item.payload.name,
                          ];
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          color: dark ? "#f8fafc" : "#0f172a",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    className={`flex h-full items-center justify-center px-4 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Add meals, users, orders, or menus so the share chart has a
                    non-zero total.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ActivityPanel
            dark={dark}
            title="Operations snapshot"
            subtitle="At a glance"
            items={activityItems}
            emptyLabel="No activity items are available yet."
          />

          <div
            className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.24em] ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Quick actions
                </p>
                <h3
                  className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  Keep the store moving
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${dark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}
              >
                Suggested
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${dark ? "border-slate-800 bg-slate-950/60 hover:border-slate-700" : "border-slate-200 bg-slate-50 hover:border-indigo-200"}`}
                >
                  <p
                    className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}
                  >
                    {action.label}
                  </p>
                  <p
                    className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {action.detail}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
