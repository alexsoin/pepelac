const storageKey = "theme-is-dark";
const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function toggleLocalTheme(isDark) {
	window.localStorage.setItem(storageKey, isDark);
}
function switchTheme(isDark) {
	document.body.classList.toggle("dark-mode", isDark);
}

function themeIsDark() {
	const localDarkTheme = window.localStorage.getItem(storageKey);
	const isLocalDarkTheme = localDarkTheme === "true";

	return localDarkTheme ? isLocalDarkTheme : darkScheme.matches;
}

const isDark = themeIsDark();
switchTheme(isDark);
darkScheme.addEventListener("change", (e) => switchTheme(e.matches) && toggleLocalTheme(e.matches));

document.querySelectorAll(".toggle-theme").forEach((btn) => btn.addEventListener("click", (e) => {
	e.preventDefault();
	const isDarkTheme = !themeIsDark();

	console.log({ isDarkTheme });

	toggleLocalTheme(isDarkTheme);
	switchTheme(isDarkTheme);
}));
