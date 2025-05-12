import { create } from "zustand";

export const useThemeStore = create((set) => {
  return {
    // We can check the theme in localStorage(if user has already selected) before setting the default theme
    theme: localStorage.getItem("linkup-theme") || "dim",
    setTheme: (theme) => {
      localStorage.setItem("linkup-theme", theme);
      set({ theme });
    },
  };
});
