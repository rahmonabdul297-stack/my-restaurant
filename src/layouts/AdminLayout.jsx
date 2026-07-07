import { Link, Navigate, Outlet, useLocation } from "react-router";
import Logo from "../components/Logo";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/context";
import { AdminDashboardArr } from "../components/Arrays";
import { IoIosNotifications, IoMdContact } from "react-icons/io";
import { CiLight } from "react-icons/ci";
import { MdLightMode } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";

const AdminLayout = () => {
  const { dark, setDark, email } = useContext(ThemeContext);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  const isAdminAuthenticated = (() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem("restaurant_admin_session");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed?.isAdmin === true;
    } catch {
      return false;
    }
  })();

  const isActiveLink = (path) => location.pathname === path;

  const renderNavLinks = (mobile = false) => (
    <div className="flex flex-col gap-1">
      {AdminDashboardArr.map((nav) => {
        const active = isActiveLink(nav.Link);
        return (
          <Link
            to={nav.Link}
            key={nav.id}
            onClick={() => setIsMobileNavOpen(false)}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              active
                ? dark
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "bg-indigo-50 text-indigo-700"
                : dark
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="text-base">{nav.icon}</span>
            <span className="capitalize">{nav.nav}</span>
          </Link>
        );
      })}
    </div>
  );

  if (!isAdminAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }

  return (
    <div
      className={`min-h-screen ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <header
        className={`fixed top-0 z-40 w-full border-b ${dark ? "border-slate-800 bg-slate-900/95" : "border-slate-200 bg-white/95"} backdrop-blur`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              className={`rounded-xl p-2 lg:hidden ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setDark((prev) => !prev)}
              className={`rounded-xl p-2 ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
              aria-label="Toggle theme"
            >
              {dark ? <CiLight size={20} /> : <MdLightMode size={20} />}
            </button>
            <div
              className={`hidden rounded-xl p-2 sm:flex ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
            >
              <IoIosNotifications size={20} />
            </div>
          </div>
        </div>
      </header>

      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r px-3 py-5 lg:flex ${dark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
      >
        <div className="space-y-3">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-slate-800 bg-slate-800/70" : "border-slate-200 bg-slate-50"}`}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Admin panel
            </p>
            <p className="mt-1 font-semibold">Manage your store</p>
          </div>
          {renderNavLinks()}
        </div>

        <div
          className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${dark ? "border-slate-800 bg-slate-800/70" : "border-slate-200 bg-slate-50"}`}
        >
          <div
            className={`rounded-full p-2 ${dark ? "bg-slate-700" : "bg-white"}`}
          >
            <IoMdContact size={22} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {email ? email.slice(0,14) : "Unknown user"}
            </div>
            <div
              className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Administrator
            </div>
          </div>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-72 transform border-r px-4 py-5 transition-transform duration-200 lg:hidden ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"} ${dark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Menu</p>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className={`rounded-xl p-2 ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
          >
            <FiX size={16} />
          </button>
        </div>
        <div className="mt-4 space-y-3">{renderNavLinks(true)}</div>
      </aside>

      <main className="w-[80%] pt-16 lg:ml-64">
        <div className="mx-auto max-w-7xl overflow-x-hidden px-3 py-4 sm:px-4 lg:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
