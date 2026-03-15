// Theme store — light/dark mode management

export type Theme = "light" | "dark";

let currentTheme: Theme = "dark";
let themeListeners: (() => void)[] = [];

const applyTheme = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Apply initial theme
applyTheme(currentTheme);

export const themeStore = {
  getTheme: () => currentTheme,
  setTheme: (theme: Theme) => {
    currentTheme = theme;
    applyTheme(theme);
    themeListeners.forEach((fn) => fn());
  },
  toggle: () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    currentTheme = next;
    applyTheme(next);
    themeListeners.forEach((fn) => fn());
  },
  subscribe: (fn: () => void) => {
    themeListeners.push(fn);
    return () => {
      themeListeners = themeListeners.filter((l) => l !== fn);
    };
  },
};
