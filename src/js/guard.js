import { token } from "./controller/cookies.js";

if (token === "") {
    window.location.replace("http://scipio.hlcyn.co/login/");
}