import { maintainerURL, brandURL, deviceURL } from "../../config/url.js";
import { token } from "../../config/cookies.js";
import { isCoreUser } from "../../utils/myid.js";

async function populateAccOptions() {
    const selectTemplate = document.querySelector('#maintainer');
    
    try {
        const response = await fetch(maintainerURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
            result.data
                .filter(account => account.role !== "contributor")
                .forEach(account => {
                    const option = document.createElement('option');
                    option.value = account.teleid;
                    option.textContent = account.name;
                    selectTemplate.appendChild(option);
                });
        } else {
            console.error('Unexpected response format', result);
        }
    } catch (error) {
        console.error('Error fetching maintainer data:', error);
    }
}


function addMaintainerField() {
    const container = document.getElementById('maintainers-container');
    const template = document.querySelector('.maintainer-field');
    const newField = template.cloneNode(true);
    const newSelect = newField.querySelector('select');
    newSelect.value = '';
    container.appendChild(newField);
}


async function populateBrandOptions() {
    const brandSelect = document.getElementById('brandlower');

    try {
        const response = await fetch(brandURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
            result.data.forEach(payload => {
                const option = document.createElement('option');
                option.value = payload.brand_lower;
                option.textContent = payload.brand;
                brandSelect.appendChild(option);
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

    const brandlower = document.getElementById('brandlower').value;
    const marketname = document.getElementById('marketname').value;
    const codename = document.getElementById('codename').value;
    
    const maintainerFields = document.querySelectorAll('#maintainers-container select');
    const userids = Array.from(maintainerFields)
        .map(select => select.value)
        .filter(userid => userid);

    if (userids.length === 0) {
        alert('Please select at least one maintainer.');
        return;
    }

    const deviceData = {
        marketname: marketname,
        codename: codename,
        brand_lower: brandlower,
        deprecated: false,
        maintainer: userids.map(userid => ({ userid })),
    };

    try {
        const response = await fetch(deviceURL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deviceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cannot create event.');
            console.error('Status:', response.status);
            console.error('Error during event creation:', errorData.message);
        } else {
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
    populateBrandOptions();
    document.querySelector('form').addEventListener('submit', submitEvent);

    const addMaintainerButton = document.getElementById('add-maintainer-button');
    addMaintainerButton.addEventListener('click', addMaintainerField);
});