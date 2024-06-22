import { token } from "./config/cookies.js";

if (token === "") {
    window.location.replace("http://scipio.hlcyn.co/login/");
}