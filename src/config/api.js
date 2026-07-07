const normalizeBaseUrl = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
};

const normalizePath = (path) => {
  if (typeof path !== "string") return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ||
    "https://restaurant-management-f9kx.onrender.com/api/v1",
);

export const buildApiUrl = (path = "") => {
  if (!API_BASE_URL) return "";
  return `${API_BASE_URL}${normalizePath(path)}`;
};

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  foods: buildApiUrl("/foods"),
  food: buildApiUrl("/food"),
  foodDelete: (foodId) =>
    buildApiUrl(`/food-delete/${encodeURIComponent(String(foodId).trim())}`),
  foodUpdate: (foodId) =>
    buildApiUrl(`/food-update/${encodeURIComponent(String(foodId).trim())}`),
  foodItem: (foodId) =>
    buildApiUrl(`/food/${encodeURIComponent(String(foodId).trim())}`),
  table: buildApiUrl(import.meta.env.VITE_TABLE_ENDPOINT || "/table"),
  tables: buildApiUrl(import.meta.env.VITE_TABLES_ENDPOINT || "/tables"),
  order: buildApiUrl("/order"),
  orders: buildApiUrl("/orders"),
  user: buildApiUrl("/user"),
  userLogin: buildApiUrl("/user-login"),
  users: buildApiUrl("/users"),
  userUpdate: (userId) =>
    buildApiUrl(`/user-update/${encodeURIComponent(String(userId).trim())}`),
  notes: buildApiUrl("/notes"),
  note: buildApiUrl("/note"),
  menus: buildApiUrl("/menus"),
  menu: buildApiUrl("/menu"),
};
