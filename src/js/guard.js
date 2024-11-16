import { token } from "./config/cookies.js";
import { isCoreUser } from "./utils/myid.js";

const isCore = await isCoreUser();

if (token === "") {
    window.location.replace("http://scipio.hlcyn.co/login/");
}

if (!isCore) {
    window.location.replace("/manage/unauthorized.html");
}