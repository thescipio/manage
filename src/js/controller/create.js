import { issueURL, deviceURL, versionURL } from "../config/url.js";
import { token } from "../config/cookies.js";

async function populateDeviceOptions() {
    const deviceSelect = document.getElementById('device');
    
    try {
        const response = await fetch(deviceURL);
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
            result.data.forEach(device => {
                const option = document.createElement('option');
                option.value = device.codename;
                option.textContent = device.marketname;
                deviceSelect.appendChild(option);
            });
        } else {
            console.error('Unexpected response format', result);
        }
    } catch (error) {
        console.error('Error fetching device data:', error);
    }
}

async function populateVersionOptions() {
    const versionSelect = document.getElementById('version');
    
    try {
        const response = await fetch(versionURL);
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
            result.data.forEach(version => {
                const option = document.createElement('option');
                option.value = version.branch;
                option.textContent = `${version.codename} ${version.branch}`;
                versionSelect.appendChild(option);
            });
        } else {
            console.error('Unexpected response format', result);
        }
    } catch (error) {
        console.error('Error fetching version data:', error);
    }
}

async function submitEvent(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const device = document.getElementById('device').value;
    const version = document.getElementById('version').value;
    const description = document.getElementById('description').value;
    const attachment_url = document.getElementById('attachment_url').value;

    const userDetails = {
        title: title,
        device: device,
        version: version,
        description: description,
        attachment_url: attachment_url,
    };

    try {
        const response = await fetch(issueURL, {
            method: 'POST',
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
            console.error('Cannot create event.');
            console.error('Status:', status);
            console.error('Error during event creation:', message);
        } else {
            const responseData = await response.json();
            console.log('Event creation succeeded');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error during event creation:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateDeviceOptions();
    populateVersionOptions();
    document.querySelector('form').addEventListener('submit', submitEvent);
});
