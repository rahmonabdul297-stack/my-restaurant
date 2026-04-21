import { createContext, useLayoutEffect, useState } from "react";
import { loadSession } from "../utils/authSession";

const THEME_STORAGE_KEY = "theme";

const readInitialDark = () => {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch {
    /* ignore */
  }
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

export const ThemeContext = createContext();

const readUserFromStoredSession = () => {
  const s = loadSession();
  if (!s) return { first_name: "", Last_name: "", email: "" };
  return {
    first_name: s.first_name || "",
    Last_name: s.last_name || "",
    email: s.email || "",
  };
};

const AppContextProvider = ({ children }) => {
  const [dark, setDark] = useState(readInitialDark);
  const [drop, setdrop] = useState(false);
  const initialUser = readUserFromStoredSession();
  const [first_name, setFirstName] = useState(initialUser.first_name);
  const [Last_name, setLastName] = useState(initialUser.Last_name);
  const [email, setemail] = useState(initialUser.email);

  useLayoutEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "light";
    root.style.colorScheme = dark ? "dark" : "light";
    root.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        setDark,
        first_name,
        setFirstName,
        drop,
        setdrop,
        email,
        setemail,
        Last_name,
        setLastName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default AppContextProvider;
