import { useContext, useEffect, useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { ThemeContext } from "../context/context";

const MENU_POST_URL = "https://restaurant-management-f9kx.onrender.com/api/v1/menu";
const MENUS_URL = "https://restaurant-management-f9kx.onrender.com/api/v1/menus";

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
        ...(menuForm.menu_id.trim() ? { menu_id: menuForm.menu_id.trim() } : {}),
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
      className={`min-h-screen py-20 `}
    >
      <section className="px-10 py-20 ml-20 lg:ml-52 flex flex-col lg:grid grid-cols-4 gap-5">
        <h4 className="col-span-4">Create Menu IDs For Food Posting</h4>

        <div className="col-span-2">
          <label>Menu name</label>
          <input
            type="text"
            placeholder="Breakfast / Dinner / Drinks..."
            className="w-full"
            value={menuForm.name}
            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label>Menu category</label>
          <input
            type="text"
            placeholder="Main course / Starter / Dessert..."
            className="w-full"
            value={menuForm.category}
            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label>Menu ID (optional)</label>
          <input
            type="text"
            placeholder="Leave empty to generate automatically"
            className="w-full"
            value={menuForm.menu_id}
            onChange={(e) => setMenuForm({ ...menuForm, menu_id: e.target.value })}
          />
        </div>

        <div className="col-span-2 flex items-end">
          <button
            type="submit"
            onClick={isCreating ? null : handleCreateMenu}
            className="bg-AppBlack w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl"
          >
            {isCreating ? "creating..." : "create menu"}
          </button>
        </div>

        <div className="col-span-4 mt-8">
          <div className="flex items-center justify-between">
            <h5 className="font-bold">Reusable Menu IDs</h5>
            <button
              type="button"
              onClick={isLoadingMenus ? null : loadMenus}
              className="bg-AppRed text-AppWhite py-1.5 px-3 rounded-xl text-sm"
            >
              {isLoadingMenus ? "refreshing..." : "refresh list"}
            </button>
          </div>
          {!menus.length ? (
            <div className={`mt-4 text-sm ${dark ? "text-AppGray" : "text-AppBlack/70"}`}>
              No menus yet. Create one above and it will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
              {menus.map((menu, idx) => {
                const menuId = menu.menu_id || menu.id || "";
                return (
                  <div
                    key={menuId || idx}
                    className={`rounded-xl p-3 border ${
                      dark
                        ? "border-AppGray/40 bg-AppBlack/40"
                        : "border-AppBlack/15 bg-AppWhite"
                    }`}
                  >
                    <div className="font-bold">{menu.name || "Unnamed menu"}</div>
                    <div className={`text-sm ${dark ? "text-AppGray" : "text-AppBlack/70"}`}>
                      Category: {menu.category || "-"}
                    </div>
                    <div className="text-sm break-all mt-1">menu_id: {menuId || "-"}</div>
                    <button
                      type="button"
                      onClick={() => copyMenuId(menuId)}
                      className="mt-2 bg-AppBlack text-AppWhite px-2 py-1 rounded-lg text-xs"
                    >
                      copy Id
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminMenu;
