/** Переход по якорным ссылкам  */
document.querySelectorAll('a[href*="#"]').forEach((anchor) => anchor.addEventListener('click', function (e) {
	const anchorTargetID = anchor.getAttribute('href')?.substring(1);
	const $anchorTarget = document.getElementById(anchorTargetID || '');

	if (!$anchorTarget) return;

	e.preventDefault();
	$anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
