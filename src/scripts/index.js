import "@/styles/index.scss";
import * as bootstrap from "bootstrap";
import focusVisible from "./helpers/focus-visible";

window.bootstrap = bootstrap;
focusVisible(); // удаление обводки кнопок при фокусе, если пользователь взаимодействует со страницей не через TAB
