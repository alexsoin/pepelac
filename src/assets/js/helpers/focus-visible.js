const classFocusVisible = "focus-visible";

// Удалите класс из всех элементов, которые его содержат.
function removeFocusedClass() {
	const previouslyFocusedElement = document.getElementsByClassName(classFocusVisible)[0];
	if (previouslyFocusedElement) previouslyFocusedElement.classList.remove(classFocusVisible);
}

// Добавить прослушиватель событий при нажатии tab
document.addEventListener("keyup", (event) => {
	if (event.keyCode !== 9) return;

	removeFocusedClass();
	document.activeElement.classList.add(classFocusVisible); // Добавить класс к элементу, находящемуся в фокусе.
});

// Удалите класс, когда пользователь взаимодействует со страницей с помощью мыши или когда страница теряет фокус.
document.addEventListener("click", removeFocusedClass);
document.addEventListener("focusout", removeFocusedClass);
