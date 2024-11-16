import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

async function submitEvent(event) {
    event.preventDefault();
    const codename = document.getElementById('codename').value;
    const branch = document.getElementById('branch').value;
    const android_version = document.getElementById('android_version').value;

    const versionData = {
        codename: codename,
        branch: branch,
        android_version: android_version,
    };

    try {
        const response = await fetch(versionURL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(versionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const status = response.status;
            const message = errorData.message;
            console.error('Cannot create event.');
            console.error('Status:', status);
            console.error('Error during event creation:', message);
        } else {
            const responseData = await response.json();
            console.log('Event creation succeeded');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error during event creation:', error.message);
    }
}

async function checkAccess() {
    try {
        const isCore = await isCoreUser();

        if (!isCore) {
            window.location.replace("../unauthorized.html");
        } else {
            const spinner = document.getElementById('spinner');
            const container = document.querySelector('.container');
            
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                container.removeAttribute('hidden');
                container.classList.add('fade-in');
            });
        }
    } catch (error) {
        console.error('Error checking access:', error);
        window.location.replace("../unauthorized.html");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAccess();
    document.querySelector('form').addEventListener('submit', submitEvent);
});
