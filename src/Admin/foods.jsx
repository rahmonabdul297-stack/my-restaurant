import { useEffect, useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";

const FOOD_POST_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/food";
const MENUS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/menus";

/** API expects JSON; image must be a string (URL or data URL). File objects cannot be JSON-serialized. */
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const formatTimestamp = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

const Foods = () => {
  const [isPosting, setisPosting] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const [menus, setMenus] = useState([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [warning, setwarning] = useState("");
  const [foodImageInputKey, setFoodImageInputKey] = useState(0);
  const [createdAtDisplay, setCreatedAtDisplay] = useState("");
  const [updatedAtDisplay, setUpdatedAtDisplay] = useState("");
  const [postFood, setpostFood] = useState({
    food_id: "",
    food_image: null,
    menu_id: "",
    name: "",
    price: "",
  });

  useEffect(() => {
    handleLoadMenus();
  }, []);

  const handleLoadMenus = async () => {
    setIsLoadingMenus(true);
    try {
      const request = await fetch(MENUS_URL, {
        headers: { Accept: "application/json" },
      });

      const text = await request.text();
      const data = text ? JSON.parse(text) : null;
      const parsedMenus = Array.isArray(data) ? data : [];
      setMenus(parsedMenus);
      if (!parsedMenus.length) {
        infoNotification(
          "No menus found. Create a menu first, then post food.",
        );
      }
    } catch (err) {
      console.error(err);
      errorNotification("Could not load menus.");
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const handleFoodPosting = async (e) => {
    e.preventDefault();
    const priceNum = Number(postFood.price);
    const hasImage =
      postFood.food_image &&
      (typeof postFood.food_image === "string"
        ? postFood.food_image.trim() !== ""
        : postFood.food_image instanceof File);
    const isValid =
      hasImage &&
      postFood.menu_id?.trim() !== "" &&
      postFood.name?.trim() !== "" &&
      postFood.price !== "" &&
      !Number.isNaN(priceNum);

    if (!isValid) {
      setwarning("All fields are required.");
      infoNotification("Follow the instructions and try again.");
      return;
    }

    setwarning("");
    setisPosting(true);
    try {
      let foodImageStr = postFood.food_image;
      if (foodImageStr instanceof File) {
        foodImageStr = await readFileAsDataUrl(foodImageStr);
      }

      const nowIso = new Date().toISOString();
      setCreatedAtDisplay(nowIso);
      setUpdatedAtDisplay(nowIso);

      const payload = {
        name: postFood.name.trim(),
        price: priceNum,
        food_image: foodImageStr,
        menu_id: postFood.menu_id.trim(),
        created_at: nowIso,
        updated_at: nowIso,
        ...(postFood.food_id?.trim()
          ? { food_id: postFood.food_id.trim() }
          : {}),
      };

      const request = await fetch(FOOD_POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        const text = await request.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (request.ok && request.status >= 200 && request.status < 300) {
        successNotification("Food posted successfully.");
        if (data && typeof data === "object") {
          if (data.created_at) setCreatedAtDisplay(String(data.created_at));
          if (data.updated_at) setUpdatedAtDisplay(String(data.updated_at));
        }
        setpostFood({
          food_id: "",
          food_image: null,
          menu_id: "",
          name: "",
          price: "",
        });
        setFoodImageInputKey((k) => k + 1);
      } else {
        const msg =
          (data && (data.error || data.message)) ||
          `Request failed (${request.status})`;
        errorNotification(msg);
      }
    } catch (err) {
      console.error(err);
      errorNotification("Network error — could not reach the server.");
    } finally {
      setisPosting(false);
    }
  };
  const handleFoodDeleting = async () => {
    setisDeleting(true);
    const isValid = food_id && food_image && menu_id && name && price;
    if (isValid) {
      const payload = {
        food_id,
        food_image,
        menu_id,
        name,
        price: Number(price),
      };
      const request = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const response = await request.json();
      console.log("response", response);
      console.log(
        "data",

        food_id,
        food_image,
        menu_id,
        name,
        price,
      );
      if (request.ok && request.status.toString().includes("20")) {
        successNotification("successful");
      } else {
        errorNotification("something when wrong!");
      }
    } else {
      setwarning("field required!");
      infoNotification("follow the instruction and try again!");
    }
    setisDeleting(false);
  };
  return (
    <div className="py-20 h-screen ">
      <section className="px-10 py-20  ml-20 lg:ml-52   flex flex-col  lg:grid grid-cols-4 gap-5">
        <h4 className="col-span-4">Post Available Meals</h4>
        <section className="col-span-2 flex flex-col gap-5">
          <div className=" flex justify-between items-center">
            <label htmlFor="">Available menus</label>
            <button
              type="button"
              onClick={isLoadingMenus ? null : handleLoadMenus}
              className="bg-AppBlack text-AppWhite py-2 px-3 rounded-xl capitalize text-sm mt-2"
            >
              {isLoadingMenus ? "loading menus..." : "load menu ids"}
            </button>
          </div>
          <div>
            {" "}
            {menus.length > 0 ? (
              <div className="text-xs mt-2 break-all">
                {menus
                  .map((menu) => menu.menu_id || menu.id)
                  .filter(Boolean)
                  .join(" : ")}
              </div>
            ) : null}
          </div>
        </section>
        <div className="col-span-2">
          <label htmlFor="">Food name</label>
          <input
            type="text"
            placeholder="Enter Food name"
            className="w-full"
            onChange={(e) => setpostFood({ ...postFood, name: e.target.value })}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food image</label>
          <input
            key={foodImageInputKey}
            type="file"
            accept="image/*"
            placeholder="upload food image"
            className="w-full"
            onChange={(e) =>
              setpostFood({
                ...postFood,
                food_image: e.target.files?.[0] ?? null,
              })
            }
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food id</label>
          <input
            type="text"
            placeholder="Enter food Id (optional)"
            className="w-full"
            onChange={(e) =>
              setpostFood({ ...postFood, food_id: e.target.value })
            }
          />
          <div className="text-AppRed">{warning}</div>
        </div>
        <div className="col-span-2">
          <label htmlFor="">Food menu id</label>
          {menus.length > 0 ? (
            <select
              className="w-full"
              value={postFood.menu_id}
              onChange={(e) =>
                setpostFood({ ...postFood, menu_id: e.target.value })
              }
            >
              <option value="">Select menu id</option>
              {menus.map((menu) => {
                const menuId = menu.menu_id || menu.id;
                if (!menuId) return null;
                return (
                  <option key={menuId} value={menuId}>
                    {menu.name ? `${menu.name} (${menuId})` : menuId}
                  </option>
                );
              })}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Enter food menu id"
              className="w-full"
              onChange={(e) =>
                setpostFood({ ...postFood, menu_id: e.target.value })
              }
            />
          )}
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food price</label>
          <input
            type="number"
            placeholder="Enter Food price"
            className="w-full"
            onChange={(e) =>
              setpostFood({ ...postFood, price: e.target.value })
            }
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="food-created-at">Created at</label>
          <div
            id="food-created-at"
            className="text-AppBlack/80 font-medium border border-AppBlack/10 rounded-lg px-3 py-2 bg-AppWhite"
          >
            {formatTimestamp(createdAtDisplay)}
          </div>
        </div>
        <div className="col-span-2">
          <label htmlFor="food-updated-at">Updated at</label>
          <div
            id="food-updated-at"
            className="text-AppBlack/80 font-medium border border-AppBlack/10 rounded-lg px-3 py-2 bg-AppWhite"
          >
            {formatTimestamp(updatedAtDisplay)}
          </div>
        </div>
        <button
          type="submit"
          onClick={isPosting ? null : handleFoodPosting}
          className="bg-AppBlack w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isPosting ? "posting..." : "post"}
        </button>

        <button
          type="submit"
          onClick={isDeleting ? null : handleFoodDeleting}
          className="bg-AppRed w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isDeleting ? "deleting..." : "delete"}
        </button>
      </section>
    </div>
  );
};

export default Foods;
