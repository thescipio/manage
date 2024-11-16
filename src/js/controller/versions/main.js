import { versionURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

function showTeams(datas) {
    const tableBody = document.getElementById('version-list');
    tableBody.innerHTML = '';

    datas.forEach(post => {
        const card = document.createElement('tr');
        card.classList.add('border-b', 'table-text');

        card.innerHTML = `
        <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
            ${post.codename}
        </td>
        <td class="px-6 py-4">
            ${post.branch}
        </td>
        <td class="px-6 py-4">
            ${post.android_version}
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

    fetch(versionURL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Failed to fetch version data. Status: ${response.status}`);
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
                container.innerHTML = '<p class="text-white">Failed to load version data. Please try again later.</p>';
                container.classList.add('fade-in');
            });
        });
}

async function initialize() {
    await getTeams();

    const isCore = await isCoreUser();
    console.log("This user is core? " + isCore);

    if (!isCore) {
        const addButton = document.getElementById('addButton');
        if (addButton) {
            addButton.style.display = 'none';
        }
    }
}

window.onload = initialize;
