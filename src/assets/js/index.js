// Импортируем jQuery с глобальным доступом используя expose-loader
import "expose-loader?exposes[]=$&exposes[]=jQuery!jquery";

// Импортируем Bootstrap 4
import 'bootstrap';

let aaa = 'Rick';

console.log(`hi, ${aaa}!`);

console.log("Use jQuery:    ", jQuery('h1'));
console.log("Use $:         ", $('h1'));
console.log("Use VanillaJS: ", document.querySelector('h1'));
