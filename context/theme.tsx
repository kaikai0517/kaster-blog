import { createContext, useContext, useState } from "react";

const Context = createContext("" as any);

export function ThemeProvider({ children }: any) {
  const [theme, setTheme] = useState("light");
  return (
    <Context.Provider value={[theme, setTheme]}>{children}</Context.Provider>
  );
}

export function useThemeContext() {
  return useContext(Context);
}
