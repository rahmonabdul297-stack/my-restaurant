import { useCallback, useContext, useEffect, useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { ThemeContext } from "../context/context";
import { loadSession } from "../utils/authSession";
import useFetch from "../hooks/useFetch";

const FOOD_POST_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/food";
const FOODS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/foods";
const MENUS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/menus";

const normaliseFoodsList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.food_items)) return payload.food_items;
  if (Array.isArray(payload)) return payload;
  return [];
};

/** Update existing meal by id (not the same as POST create). */
const foodItemUrl = (foodId) =>
  `${FOOD_POST_URL}/${encodeURIComponent(String(foodId).trim())}`;

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
  const { dark } = useContext(ThemeContext);
  const [isPosting, setisPosting] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const [menus, setMenus] = useState([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [warning, setwarning] = useState("");
  const [foodImageInputKey, setFoodImageInputKey] = useState(0);
  const [createdAtDisplay, setCreatedAtDisplay] = useState("");
  const [updatedAtDisplay, setUpdatedAtDisplay] = useState("");
  const [postFood, setpostFood] = useState({
    food_image: null,
    menu_id: "",
    name: "",
    price: "",
    food_id: "",
  });
  const [Fieldwarning,setFieldwarning]=useState("")

  const [foodsList, setFoodsList] = useState([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [updateFood, setUpdateFood] = useState({
    food_id: "",
    name: "",
    price: "",
    menu_id: "",
    food_image: null,
    existingFoodImage: "",
    /** Preserve server `created_at` when updating via POST upsert */
    createdAtSnapshot: "",
  });
  const [updateImageInputKey, setUpdateImageInputKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateWarning, setUpdateWarning] = useState("");

  const handleLoadMenus = useCallback(async () => {
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
  }, []);

  const loadPostedFoods = useCallback(async () => {
    setIsLoadingFoods(true);
    try {
      const request = await fetch(FOODS_URL, {
        headers: { Accept: "application/json" },
      });
      const text = await request.text();
      const data = text ? JSON.parse(text) : null;
      const items = normaliseFoodsList(data);
      setFoodsList(items);
    } catch (err) {
      console.error(err);
      errorNotification("Could not load posted foods.");
      setFoodsList([]);
    } finally {
      setIsLoadingFoods(false);
    }
  }, []);

  useEffect(() => {
    handleLoadMenus();
    loadPostedFoods();
  }, [handleLoadMenus, loadPostedFoods]);

  const handleSelectFoodToUpdate = (foodId) => {
    if (!foodId) {
      setUpdateFood({
        food_id: "",
        name: "",
        price: "",
        menu_id: "",
        food_image: null,
        existingFoodImage: "",
        createdAtSnapshot: "",
      });
      setUpdateWarning("");
      setUpdateImageInputKey((k) => k + 1);
      return;
    }
    const item = foodsList.find(
      (f) => String(f.food_id ?? f.id ?? "") === foodId,
    );
    if (!item) return;
    const img =
      typeof item.food_image === "string" ? item.food_image.trim() : "";
    const rawCreated =
      item.created_at ?? item.createdAt ?? item.Created_at ?? "";
    const createdAtSnapshot =
      rawCreated !== null &&
      rawCreated !== undefined &&
      String(rawCreated).trim() !== ""
        ? String(rawCreated).trim()
        : "";
    setUpdateFood({
      food_id: String(item.food_id ?? item.id ?? ""),
      name: String(item.name ?? ""),
      price:
        item.price !== undefined && item.price !== null
          ? String(item.price)
          : "",
      menu_id: String(item.menu_id ?? ""),
      food_image: null,
      existingFoodImage: img,
      createdAtSnapshot,
    });
    setUpdateWarning("");
    setUpdateImageInputKey((k) => k + 1);
  };

  const handleFoodUpdate = async (e) => {
    e.preventDefault();
    const priceNum = Number(updateFood.price);
    let foodImageStr = null;
    if (updateFood.food_image instanceof File) {
      try {
        foodImageStr = await readFileAsDataUrl(updateFood.food_image);
      } catch (err) {
        console.error(err);
        errorNotification("Could not read the new image file.");
        return;
      }
    } else if (updateFood.existingFoodImage?.trim()) {
      foodImageStr = updateFood.existingFoodImage.trim();
    }

    const isValid =
      updateFood.food_id?.trim() !== "" &&
      updateFood.name?.trim() !== "" &&
      updateFood.menu_id?.trim() !== "" &&
      updateFood.price !== "" &&
      !Number.isNaN(priceNum) &&
      foodImageStr;

    if (!isValid) {
      setUpdateWarning(
        "Choose a meal, set name, menu, price, and keep the current image or upload a new one.",
      );
      infoNotification("Complete all update fields.");
      return;
    }

    setUpdateWarning("");
    setIsUpdating(true);
    try {
      const nowIso = new Date().toISOString();
      const id = updateFood.food_id.trim();
      const createdAt = updateFood.createdAtSnapshot?.trim() || nowIso;

      const session = loadSession();
      const token = session?.token?.trim();
      const jsonHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const postUpsertBody = {
        food_id: id,
        name: updateFood.name.trim(),
        price: priceNum,
        menu_id: updateFood.menu_id.trim(),
        food_image: foodImageStr,
        created_at: createdAt,
        updated_at: nowIso,
      };

      const putBody = {
        name: updateFood.name.trim(),
        price: priceNum,
        menu_id: updateFood.menu_id.trim(),
        food_image: foodImageStr,
        updated_at: nowIso,
      };

      const parseResponse = async (res) => {
        const resText = await res.text();
        try {
          return resText ? JSON.parse(resText) : null;
        } catch {
          return null;
        }
      };

      const shouldTryAlternateMethod = (status) =>
        status === 404 || status === 405 || status === 501;

      let request = await fetch(FOOD_POST_URL, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(postUpsertBody),
      });
      let data = await parseResponse(request);

      if (!request.ok && shouldTryAlternateMethod(request.status)) {
        const putRes = await fetch(foodItemUrl(id), {
          method: "PUT",
          headers: jsonHeaders,
          body: JSON.stringify(putBody),
        });
        const putData = await parseResponse(putRes);
        if (putRes.ok) {
          request = putRes;
          data = putData;
        } else if (shouldTryAlternateMethod(putRes.status)) {
          const patchRes = await fetch(FOOD_POST_URL, {
            method: "PUT",
            headers: jsonHeaders,
            body: JSON.stringify({ food_id: id, ...putBody }),
          });
          data = await parseResponse(patchRes);
          request = patchRes;
        } else {
          request = putRes;
          data = putData;
        }
      }

      if (request.ok && request.status >= 200 && request.status < 300) {
        successNotification("Selected meal updated in the catalog.");
        setUpdateFood((prev) => ({
          ...prev,
          food_image: null,
          existingFoodImage: foodImageStr,
        }));
        setUpdateImageInputKey((k) => k + 1);
        await loadPostedFoods();
      } else {
        const msg =
          (data && (data.error || data.message || data.detail)) ||
          (typeof data === "string" ? data : null) ||
          `Update failed (${request.status}).`;
        errorNotification(msg);
      }
    } catch (err) {
      console.error(err);
      errorNotification("Network error — could not save changes.");
    } finally {
      setIsUpdating(false);
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

  const {data,error,loading}=useFetch(FOODS_URL)
  const handleFoodDeleting = async () => {
    setisDeleting(true);

    if (postFood.food_id) {
      const request = await fetch(
        `https://restaurant-management-f9kx.onrender.com/api/v1/food-delete/${postFood.food_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(menu_id)
        },
      );
      const response = await request.json();
      console.log("response", response);
      console.log("food_id:", postFood.food_id);
      if (request.ok) {
        successNotification("successful");
      } else {
        errorNotification("something when wrong!");
      }
    } else {
      setFieldwarning("Food ID is required!");
      infoNotification("follow the instruction and try again!");
    }
    setisDeleting(false);
  };
  return (
    <div
      className={`min-h-screen py-20 lg:ml-20 ${dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"}`}
    >
      <section className="px-10 py-20  ml-20 lg:ml-52   flex flex-col  lg:grid grid-cols-4 gap-5 text-AppBlack">
        <h4 className="col-span-4">Post new meals</h4>
        <p
          className={`col-span-4 -mt-2 mb-2 text-sm normal-case ${
            dark ? "text-AppWhite/70" : "text-AppBlack/65"
          }`}
        >
          Creates a new catalog item only. To change an existing meal, use{" "}
          <span className="font-semibold">Edit posted meals</span> below.
        </p>
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
          <div className="flex flex-col">
            {" "}
            {menus.length > 0 ? (
              <div
                className={`text-xs mt-2 break-all flex flex-col ${dark ? "text-AppBlack" : "text-AppBlack/80"}`}
              >
                <div className="flex flex-col">
                  {menus
                    .map((menu) => menu.menu_id || menu.id)
                    .filter(Boolean)
                    .join(", ")}
                </div>
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
          <label htmlFor="">Food id (optional for posting)</label>
          {
            <select
              className="w-full"
              value={postFood.food_id}
              onChange={(e) =>
                setpostFood({ ...postFood, food_id: e.target.value })
              }
            >
              <option value="">Select food id</option>
              {data?.food_items?.map((itm,_id) => (
                <option key={itm._id} value={itm.food_id}>
              {`${itm.name}(${itm.food_id})`}
                </option>
              ))}
            </select>
          }
          
          <div className="text-AppRed">{Fieldwarning}</div>
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
            className={`font-medium border rounded-lg px-3 py-2 ${
              dark
                ? "border-AppGray/40 bg-AppBlack/40 text-AppWhite"
                : "border-AppBlack/10 bg-AppWhite text-AppBlack/80"
            }`}
          >
            {formatTimestamp(createdAtDisplay)}
          </div>
        </div>
        <div className="col-span-2">
          <label htmlFor="food-updated-at">Updated at</label>
          <div
            id="food-updated-at"
            className={`font-medium border rounded-lg px-3 py-2 ${
              dark
                ? "border-AppGray/40 bg-AppBlack/40 text-AppWhite"
                : "border-AppBlack/10 bg-AppWhite text-AppBlack/80"
            }`}
          >
            {formatTimestamp(updatedAtDisplay)}
          </div>
        </div>
        <button
          type="submit"
          onClick={isPosting ? null : handleFoodPosting}
          className="bg-AppBlack w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isPosting ? "posting..." : "post food"}
        </button>

        <button
          type="submit"
          onClick={
            isDeleting ? null : () => handleFoodDeleting(postFood.menu_id)
          }
          className="bg-AppRed w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isDeleting ? "deleting..." : "delete food"}
        </button>

        <div
          className={`col-span-4 mt-10 border-t pt-10 ${
            dark ? "border-AppGray/50" : "border-AppBlack/10"
          }`}
        >
          <h4 className="mb-2 text-lg font-bold">Edit posted meals</h4>
          <p
            className={`mb-6 text-sm ${dark ? "text-AppWhite/75" : "text-AppBlack/70"}`}
          >
            Choose a meal, change its fields, then update. Sends{" "}
            <span className="font-semibold">POST /food</span> with{" "}
            <span className="font-semibold">food_id</span> and the original{" "}
            <span className="font-semibold">created_at</span> when the API
            provides it (same upsert shape as the server expects). If that route
            returns 404/405, the app tries{" "}
            <span className="font-semibold">PUT</span> then{" "}
            <span className="font-semibold">PATCH</span>. This is separate from{" "}
            <span className="font-semibold">post new meal</span> (no{" "}
            <span className="font-semibold">food_id</span>).
          </p>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={isLoadingFoods ? null : loadPostedFoods}
              className="rounded-xl bg-AppBlack px-4 py-2 text-sm font-semibold text-AppWhite capitalize disabled:opacity-60"
            >
              {isLoadingFoods ? "Loading meals…" : "Refresh posted meals"}
            </button>
            {foodsList.length > 0 ? (
              <span className={`text-sm ${dark ? "text-AppWhite/70" : ""}`}>
                {foodsList.length} meal{foodsList.length === 1 ? "" : "s"}{" "}
                loaded
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="update-food-select">Select meal to update</label>
              <select
                id="update-food-select"
                className="mt-1 w-full rounded-lg border px-2 py-2"
                value={updateFood.food_id}
                onChange={(e) => handleSelectFoodToUpdate(e.target.value)}
              >
                <option value="">— Choose a meal —</option>
                {foodsList.map((f) => {
                  const id = String(f.food_id ?? f.id ?? "");
                  if (!id) return null;
                  const label = f.name ? `${f.name} (${id})` : id;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {updateFood.existingFoodImage ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Current image</span>
                <img
                  src={updateFood.existingFoodImage}
                  alt=""
                  className="h-32 max-w-full rounded-lg border object-cover object-center"
                />
              </div>
            ) : (
              <div
                className={`flex items-center rounded-lg border px-3 py-8 text-center text-sm ${
                  dark
                    ? "border-AppGray/40 text-AppWhite/60"
                    : "border-AppBlack/10 text-AppBlack/60"
                }`}
              >
                Select a meal to preview its image, or upload a new file below.
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="update-food-name">Food name</label>
              <input
                id="update-food-name"
                type="text"
                className="mt-1 w-full rounded-lg border px-2 py-2"
                value={updateFood.name}
                placeholder="Meal name"
                onChange={(e) =>
                  setUpdateFood({ ...updateFood, name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="update-food-price">Price</label>
              <input
                id="update-food-price"
                type="number"
                className="mt-1 w-full rounded-lg border px-2 py-2"
                value={updateFood.price}
                placeholder="Price"
                onChange={(e) =>
                  setUpdateFood({ ...updateFood, price: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="update-food-menu">Menu</label>
              {menus.length > 0 ? (
                <select
                  id="update-food-menu"
                  className="mt-1 w-full rounded-lg border px-2 py-2"
                  value={updateFood.menu_id}
                  onChange={(e) =>
                    setUpdateFood({ ...updateFood, menu_id: e.target.value })
                  }
                >
                  <option value="">Select menu</option>
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
                  id="update-food-menu"
                  type="text"
                  className="mt-1 w-full rounded-lg border px-2 py-2"
                  value={updateFood.menu_id}
                  placeholder="Menu id"
                  onChange={(e) =>
                    setUpdateFood({ ...updateFood, menu_id: e.target.value })
                  }
                />
              )}
            </div>
            <div>
              <label htmlFor="update-food-image">
                Replace image (optional)
              </label>
              <input
                id="update-food-image"
                key={updateImageInputKey}
                type="file"
                accept="image/*"
                className="mt-1 w-full"
                onChange={(e) =>
                  setUpdateFood({
                    ...updateFood,
                    food_image: e.target.files?.[0] ?? null,
                  })
                }
              />
            </div>
          </div>

          <div className="text-AppRed mt-2 text-sm">{updateWarning}</div>

          <button
            type="button"
            onClick={isUpdating ? null : handleFoodUpdate}
            disabled={!updateFood.food_id}
            className="mt-6 w-full max-w-md rounded-2xl bg-AppBlack py-3 text-lg font-bold text-AppWhite capitalize disabled:opacity-50 lg:max-w-xs"
          >
            {isUpdating ? "Updating…" : "Update this meal"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Foods;
