import { useCallback, useContext, useEffect, useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { ThemeContext } from "../context/context";
import { loadSession } from "../utils/authSession";
import useFetch from "../hooks/useFetch";
import { API_ENDPOINTS } from "../config/api";

const FOOD_POST_URL = API_ENDPOINTS.food;
const FOOD_UPDATE_URL = (foodId) => API_ENDPOINTS.foodUpdate(foodId);
const FOODS_URL = API_ENDPOINTS.foods;
const MENUS_URL = API_ENDPOINTS.menus;

const normaliseFoodsList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.food_items)) return payload.food_items;
  if (Array.isArray(payload)) return payload;
  return [];
};

const foodItemUrl = (foodId) => API_ENDPOINTS.foodItem(foodId);

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
  const [Fieldwarning, setFieldwarning] = useState("");

  const [foodsList, setFoodsList] = useState([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [updateFood, setUpdateFood] = useState({
    food_id: "",
    name: "",
    price: "",
    menu_id: "",
    food_image: null,
    existingFoodImage: "",
    createdAtSnapshot: "",
  });
  const [updateImageInputKey, setUpdateImageInputKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateWarning, setUpdateWarning] = useState("");
  const [preview, setPreview] = useState(null);

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
      setFoodsList(normaliseFoodsList(data));
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

  useEffect(() => {
    if (!postFood.food_image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(postFood.food_image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [postFood.food_image]);

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

      let request = await fetch(FOOD_UPDATE_URL(id), {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(putBody),
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
      setwarning(
        "Please complete the meal name, price, menu, and upload an image.",
      );
      infoNotification("Fill the required fields and try again.");
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
          food_id: "",
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

  const { data } = useFetch(FOODS_URL);

  const handleFoodDeleting = async () => {
    setisDeleting(true);
    if (postFood.food_id) {
      try {
        const request = await fetch(
          API_ENDPOINTS.foodDelete(postFood.food_id),
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (request.ok) {
          successNotification("Food deleted successfully.");
          setpostFood((prev) => ({ ...prev, food_id: "" }));
          await loadPostedFoods();
        } else {
          errorNotification("Food with the selected ID does not exist.");
        }
      } catch (err) {
        console.error(err);
        errorNotification("Could not delete this food.");
      }
    } else {
      setFieldwarning("Select a food ID before deleting.");
      infoNotification("Choose a food ID and try again.");
    }
    setisDeleting(false);
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
                Catalog control
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Post and manage meals
              </h2>
              <p
                className={`mt-2 max-w-2xl text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}
              >
                Create a menu first, then use the menu ID to post meals quickly.
                The layout adjusts smoothly on both desktop and mobile.
              </p>
            </div>
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}
            >
              Tip: use the menu page to copy reusable menu IDs.
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleFoodPosting}
            className={`rounded-[24px] border p-4 shadow-sm sm:p-6 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Create a new meal</h3>
                <p
                  className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Add a new dish and keep your catalog updated.
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}
              >
                New entry
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Meal preview
                </label>
                <div
                  className={`flex min-h-40 items-center justify-center overflow-hidden rounded-2xl border ${dark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Meal preview"
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <span
                      className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Upload an image to preview it here
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Meal name
                </label>
                <input
                  type="text"
                  placeholder="Enter food name"
                  className="w-full rounded-2xl border px-3 py-2"
                  value={postFood.name}
                  onChange={(e) =>
                    setpostFood({ ...postFood, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="w-full rounded-2xl border px-3 py-2"
                  value={postFood.price}
                  onChange={(e) =>
                    setpostFood({ ...postFood, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Menu ID
                </label>
                {menus.length > 0 ? (
                  <select
                    className="w-full rounded-2xl border px-3 py-2"
                    value={postFood.menu_id}
                    onChange={(e) =>
                      setpostFood({ ...postFood, menu_id: e.target.value })
                    }
                  >
                    <option value="">Select menu ID</option>
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
                    placeholder="Enter menu ID"
                    className="w-full rounded-2xl border px-3 py-2"
                    value={postFood.menu_id}
                    onChange={(e) =>
                      setpostFood({ ...postFood, menu_id: e.target.value })
                    }
                  />
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Meal image
                </label>
                <input
                  key={foodImageInputKey}
                  type="file"
                  accept="image/*"
                  className="w-full rounded-2xl border border-dashed px-3 py-2"
                  onChange={(e) =>
                    setpostFood({
                      ...postFood,
                      food_image: e.target.files?.[0] ?? null,
                    })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Food ID (optional)
                </label>
                <select
                  className="w-full rounded-2xl border px-3 py-2"
                  value={postFood.food_id}
                  onChange={(e) =>
                    setpostFood({ ...postFood, food_id: e.target.value })
                  }
                >
                  <option value="">Select food ID</option>
                  {data?.food_items?.map((itm) => (
                    <option
                      key={itm._id}
                      value={itm.food_id}
                    >{`${itm.name} (${itm.food_id})`}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Created at
                  </label>
                  <div
                    className={`rounded-2xl border px-3 py-2 text-sm ${dark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
                  >
                    {formatTimestamp(createdAtDisplay)}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Updated at
                  </label>
                  <div
                    className={`rounded-2xl border px-3 py-2 text-sm ${dark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
                  >
                    {formatTimestamp(updatedAtDisplay)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-AppRed">{warning}</div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Post food"}
              </button>
              <button
                type="button"
                onClick={handleFoodDeleting}
                className="flex-1 rounded-2xl bg-AppRed px-4 py-3 font-semibold text-white"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete selected food"}
              </button>
            </div>
            <div className="mt-2 text-sm text-AppRed">{Fieldwarning}</div>
          </form>

          <form
            onSubmit={handleFoodUpdate}
            className={`rounded-[24px] border p-4 shadow-sm sm:p-6 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Edit posted meals</h3>
                <p
                  className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Refresh your list and update existing dishes in a few clicks.
                </p>
              </div>
              <button
                type="button"
                onClick={isLoadingFoods ? null : loadPostedFoods}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold ${dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`}
              >
                {isLoadingFoods ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select meal to update
                </label>
                <select
                  className="w-full rounded-2xl border px-3 py-2"
                  value={updateFood.food_id}
                  onChange={(e) => handleSelectFoodToUpdate(e.target.value)}
                >
                  <option value="">Choose a meal</option>
                  {foodsList.map((f) => {
                    const id = String(f.food_id ?? f.id ?? "");
                    if (!id) return null;
                    return (
                      <option key={id} value={id}>
                        {f.name ? `${f.name} (${id})` : id}
                      </option>
                    );
                  })}
                </select>
              </div>

              {updateFood.existingFoodImage ? (
                <div>
                  <p className="mb-2 text-sm font-medium">Current image</p>
                  <img
                    src={updateFood.existingFoodImage}
                    alt="Current meal"
                    className="h-36 w-full rounded-2xl border object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`rounded-2xl border px-3 py-8 text-center text-sm ${dark ? "border-slate-800 bg-slate-950/70 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}
                >
                  Select a meal to preview its image, or upload a new file
                  below.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Meal name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border px-3 py-2"
                    value={updateFood.name}
                    placeholder="Meal name"
                    onChange={(e) =>
                      setUpdateFood({ ...updateFood, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border px-3 py-2"
                    value={updateFood.price}
                    placeholder="Price"
                    onChange={(e) =>
                      setUpdateFood({ ...updateFood, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Menu</label>
                  {menus.length > 0 ? (
                    <select
                      className="w-full rounded-2xl border px-3 py-2"
                      value={updateFood.menu_id}
                      onChange={(e) =>
                        setUpdateFood({
                          ...updateFood,
                          menu_id: e.target.value,
                        })
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
                      type="text"
                      className="w-full rounded-2xl border px-3 py-2"
                      value={updateFood.menu_id}
                      placeholder="Menu ID"
                      onChange={(e) =>
                        setUpdateFood({
                          ...updateFood,
                          menu_id: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Replace image
                  </label>
                  <input
                    key={updateImageInputKey}
                    type="file"
                    accept="image/*"
                    className="w-full rounded-2xl border border-dashed px-3 py-2"
                    onChange={(e) =>
                      setUpdateFood({
                        ...updateFood,
                        food_image: e.target.files?.[0] ?? null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-sm text-AppRed">{updateWarning}</div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
                disabled={isUpdating || !updateFood.food_id}
              >
                {isUpdating ? "Updating..." : "Update this meal"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Foods;
