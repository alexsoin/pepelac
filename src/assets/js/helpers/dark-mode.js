const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const storageKeyTheme = "color-mode";
const nameBtnToggleTheme = ".js--toggle-theme";
const themeToggle = { dark: "light", light: "dark" };

const setTheme = (theme) => {
	document.documentElement.setAttribute(storageKeyTheme, theme);
	localStorage.setItem(storageKeyTheme, theme);
};

const toggleColorMode = (setSystemTheme) => {
	setTheme(setSystemTheme ? systemTheme : themeToggle[localStorage.getItem(storageKeyTheme)]);
};

document.addEventListener("DOMContentLoaded", () => {
	const storageTheme = localStorage.getItem(storageKeyTheme) || false;
	const toggleThemeButtons = document.querySelectorAll(nameBtnToggleTheme);

	setTheme(storageTheme || systemTheme);
	toggleThemeButtons.forEach((btn) => btn.addEventListener("click", () => toggleColorMode(btn.dataset.systemTheme)));
});
