import { useContext, useEffect, useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { ThemeContext } from "../context/context";
import { API_ENDPOINTS } from "../config/api";

const MENU_POST_URL = API_ENDPOINTS.menu;
const MENUS_URL = API_ENDPOINTS.menus;

const AdminMenu = () => {
  const { dark } = useContext(ThemeContext);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [warning, setWarning] = useState("");
  const [menus, setMenus] = useState([]);
  const [menuForm, setMenuForm] = useState({
    menu_id: "",
    name: "",
    category: "",
  });

  const loadMenus = async () => {
    setIsLoadingMenus(true);
    try {
      const request = await fetch(MENUS_URL, {
        headers: { Accept: "application/json" },
      });
      const text = await request.text();
      const data = text ? JSON.parse(text) : null;
      setMenus(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      errorNotification("Could not load menus.");
    } finally {
      setIsLoadingMenus(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    const isValid = menuForm.name.trim() && menuForm.category.trim();
    if (!isValid) {
      setWarning("Menu name and category are required.");
      infoNotification("Fill all required fields.");
      return;
    }

    setWarning("");
    setIsCreating(true);
    try {
      const payload = {
        name: menuForm.name.trim(),
        category: menuForm.category.trim(),
        ...(menuForm.menu_id.trim()
          ? { menu_id: menuForm.menu_id.trim() }
          : {}),
      };

      const request = await fetch(MENU_POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await request.text();
      const data = text ? JSON.parse(text) : null;

      if (request.ok && request.status >= 200 && request.status < 300) {
        successNotification("Menu created successfully.");
        setMenuForm({ menu_id: "", name: "", category: "" });
        await loadMenus();
      } else {
        errorNotification(
          (data && (data.error || data.message)) ||
            `Request failed (${request.status})`,
        );
      }
    } catch (err) {
      console.error(err);
      errorNotification("Network error - could not create menu.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyMenuId = async (id) => {
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
      successNotification("Menu ID copied.");
    } catch {
      infoNotification(`Menu ID: ${id}`);
    }
  };

  return (
    <div
      className={`min-h-screen py-4 sm:py-6 ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <section className="mx-auto max-w-7xl space-y-6 px-1 sm:px-2 lg:px-0">
        <div
          className={`rounded-[24px] border p-5 shadow-sm sm:p-6 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className={`text-sm font-semibold uppercase tracking-[0.25em] ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Menu setup
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Create menu IDs for food posting
              </h2>
              <p
                className={`mt-2 max-w-2xl text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}
              >
                Build reusable menu categories so your food posting form stays
                quick and organized.
              </p>
            </div>
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}
            >
              Tip: copy a menu ID and reuse it while posting meals.
            </div>
          </div>
        </div>

        <div
          className={`grid gap-6 rounded-[24px] border p-4 shadow-sm sm:p-6 lg:grid-cols-[0.95fr_1.05fr] ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
        >
          <form onSubmit={handleCreateMenu} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Create a new menu</h3>
              <p
                className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                A clear menu structure helps your admin dashboard stay easy to
                manage.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Menu name
                </label>
                <input
                  type="text"
                  placeholder="Breakfast / Dinner / Drinks..."
                  className="w-full rounded-2xl border px-3 py-2"
                  value={menuForm.name}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, name: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Menu category
                </label>
                <input
                  type="text"
                  placeholder="Main course / Starter / Dessert..."
                  className="w-full rounded-2xl border px-3 py-2"
                  value={menuForm.category}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, category: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Menu ID (optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to generate automatically"
                  className="w-full rounded-2xl border px-3 py-2"
                  value={menuForm.menu_id}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, menu_id: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-sm text-AppRed">{warning}</div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create menu"}
            </button>
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reusable menu IDs</h3>
              <button
                type="button"
                onClick={isLoadingMenus ? null : loadMenus}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
              >
                {isLoadingMenus ? "Refreshing..." : "Refresh list"}
              </button>
            </div>
            {!menus.length ? (
              <div
                className={`rounded-2xl border px-4 py-8 text-sm ${dark ? "border-slate-800 bg-slate-950/60 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}
              >
                No menus yet. Create one above and it will appear here.
              </div>
            ) : (
              <div className="grid gap-3">
                {menus.map((menu, idx) => {
                  const menuId = menu.menu_id || menu.id || "";
                  return (
                    <div
                      key={menuId || idx}
                      className={`rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold">
                            {menu.name || "Unnamed menu"}
                          </div>
                          <div
                            className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            Category: {menu.category || "-"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyMenuId(menuId)}
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Copy ID
                        </button>
                      </div>
                      <div
                        className={`mt-3 break-all text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        menu_id: {menuId || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMenu;
