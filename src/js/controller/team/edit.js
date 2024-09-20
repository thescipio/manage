import { versionURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";

var currentURL = window.location.href;

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var idValue = getParameterByName('id', currentURL);

async function submitEvent(event) {
    const codename = document.getElementById('codename').value;
    const branch = document.getElementById('branch').value;
    const android_version = document.getElementById('android_version').value;

    const versionData = {
        codename: codename,
        branch: branch,
        android_version: android_version,
    };

    try {
        const response = await fetch(versionURL + "/" + idValue, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const status = response.status;
            const message = errorData.message;
            return;
        }

        window.location.href = '/index.html';

    } catch (error) {
        console.error('Error updating issue:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', submitEvent);
});
