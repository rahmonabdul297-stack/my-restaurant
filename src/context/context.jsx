import { useState } from "react";
import { createContext } from "react";

export const ThemeContext = createContext();
const AppContextProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [drop, setdrop] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [Last_name, setLastName] = useState("");
  const [email, setemail] = useState("");
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
