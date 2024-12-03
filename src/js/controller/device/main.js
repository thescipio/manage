import { deviceURL, maintainerURL, brandURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

function showTeams(devices, maintainers, brands) {
    const tableBody = document.getElementById('device-data');
    tableBody.innerHTML = '';

    devices.forEach(device => {
        const maintainerNames = device.maintainer
            .map(m => maintainers.find(maintainer => maintainer.teleid === m.userid)?.name)
            .filter(name => name)
            .join(', '); // Join multiple maintainers with a comma

        const brandName = brands.find(brand => brand.brand_lower === device.brand_lower)?.brand || device.brand_lower;

        const card = document.createElement('tr');
        card.classList.add('border-b', 'table-text');

        card.innerHTML = `
        <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
            ${brandName}
        </td>
        <td class="px-6 py-4">
            ${device.marketname}
        </td>
        <td class="px-6 py-4">
            ${device.codename}
        </td>
        <td class="px-6 py-4">
            ${maintainerNames || 'Unknown'}
        </td>
        `;
        tableBody.appendChild(card);
    });
}

async function getTeams() {
    const spinner = document.getElementById('spinner');
    const container = document.querySelector('.container');

    try {
        const [deviceResponse, maintainerResponse, brandResponse] = await Promise.all([
            fetch(deviceURL, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } }),
            fetch(maintainerURL, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } }),
            fetch(brandURL, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } }),
        ]);

        if (!deviceResponse.ok || !maintainerResponse.ok || !brandResponse.ok) {
            throw new Error('Failed to fetch one or more data sources.');
        }

        const [deviceData, maintainerData, brandData] = await Promise.all([
            deviceResponse.json(),
            maintainerResponse.json(),
            brandResponse.json(),
        ]);

        showTeams(deviceData.data, maintainerData.data, brandData.data);

        spinner.classList.add('fade-out');
        spinner.addEventListener('animationend', () => {
            spinner.style.display = 'none';
            container.removeAttribute('hidden');
            container.classList.add('fade-in');
        });
    } catch (error) {
        console.error('Fetch Error:', error);
        spinner.classList.add('fade-out');
        spinner.addEventListener('animationend', () => {
            spinner.style.display = 'none';
            container.removeAttribute('hidden');
            container.innerHTML = '<p class="text-white">Failed to load version data. Please try again later.</p>';
            container.classList.add('fade-in');
        });
    }
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