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
        <td class="px-4 py-4 text-sm whitespace-nowrap relative">
                <button class="px-1 py-1 text duration-200 rounded-lg focus:outline-none dropdown-toggle" onclick="toggleDropdown(event)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
               <div class="dropdown-menu hidden z-10 absolute w-15 top-3 sm:top-2 transform translate-x-4 -left-24">
                <ul class="py-2 text-sm text button-lock flex justify-between divide-x">
                    <a href="edit-paid.html?airdropId=#EDIT#" class="w-full">
                    <li class="flex items-center px-4 py-2 cursor-pointer w-full action-color ">
                        <i class="fa-solid fa-pen text-white"></i>
                    </li>
                    </a>
                    <li id="deleteButton" class="flex items-center px-4 py-2 cursor-pointer w-full action-color " onclick="confirmDelete('#DELETE#')">
                        <i class="fa-solid fa-trash text-white"></i> 
                    </li>
                </ul>
            </div>
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

    if (isCore) {
        const addButton = document.getElementById('addButton');
        if (addButton) {
            addButton.removeAttribute('hidden');
            addButton.classList.add('fade-in');
        }
    }
}



window.onload = initialize;
