import { maintainerURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

function showTeams(datas) {
    const tableBody = document.getElementById('user-list');
    tableBody.innerHTML = '';

    datas.forEach(post => {
        const card = document.createElement('tr');
        card.classList.add('border-b', 'table-text');

        let role;
        if (post.role === "core") {
            role = "Core Developer";
        } else if (post.role === "maintainer") {
            role = "Device Maintainer";
        } else if (post.role === "contributor") {
            role = "Project Contributor";
        } else {
            role = "Unknown Role";
        }

        card.innerHTML = `
        <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
            ${post.name}
        </td>
        <td class="px-6 py-4">
            ${post.email}
        </td>
        <td class="px-6 py-4">
            ${role}
        </td>
        `;
        tableBody.appendChild(card);
    });
}

function getTeams() {
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    };

    fetch(maintainerURL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch team data. Status: ' + response.status);
            }
        })
        .then(data => {
            showTeams(data.data);
            const spinner = document.getElementById('spinner');
            const container = document.querySelector('.container');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                container.removeAttribute('hidden');
                container.classList.add('fade-in');
            });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            const spinner = document.getElementById('spinner');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                const container = document.querySelector('.container');
                container.removeAttribute('hidden');
                container.innerHTML = '<p class="text-white">Failed to load team data. Please try again later.</p>';
                container.classList.add('fade-in');
            });
        });
}

async function initialize() {
    await getTeams();

    const isCore = await isCoreUser();

    if (!isCore) {
        const addButton = document.getElementById('addButton');
        if (addButton) { // Ensure the element exists
            addButton.style.display = 'none';
        }
    }
}

window.onload = initialize;
