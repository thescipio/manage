import { maintainerURL, applicantsURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

async function populateAccOptions() {
    const accountSelect = document.getElementById('teleid');

    try {
        const response = await fetch(applicantsURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
            result.data.forEach(account => {
                const option = document.createElement('option');
                option.value = account.userid;
                option.textContent = account.username;
                accountSelect.appendChild(option);
            });
        } else {
            console.error('Unexpected response format', result);
        }
    } catch (error) {
        console.error('Error fetching device data:', error);
    }
}

async function submitEvent(event) {
    event.preventDefault();
    const teleid = document.getElementById('teleid').value;
    const name = document.getElementById('name').value;
    const github = document.getElementById('github').value;
    const gitlab = document.getElementById('gitlab').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    const teamData = {
        teleid: teleid,
        name: name,
        github: github,
        gitlab: gitlab,
        email: email,
        role: role,
    };

    console.log("Data di input: ", teamData)
    try {
        const response = await fetch(maintainerURL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
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
    populateAccOptions();
    document.querySelector('form').addEventListener('submit', submitEvent);
});
