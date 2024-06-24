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

async function fetchIssueAndPopulateForm() {
    try {
        const response = await fetch(issueURL + "/post/" + idValue, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            const status = response.status;
            const message = errorData.message;
            console.error('Failed to fetch issue details.');
            console.error('Status:', status);
            console.error('Error:', message);
            return;
        }

        const responseData = await response.json();
        const issueData = responseData.data;

        document.getElementById('title').value = issueData.title;
        document.getElementById('device').value = issueData.device;
        document.getElementById('version').value = issueData.Version;
        document.getElementById('description').value = issueData.description;
        document.getElementById('attachment_url').value = issueData.attachment_url;

    } catch (error) {
        console.error('Error fetching issue details:', error.message);
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
        Version: version,
        description: description,
        attachment_url: attachment_url,
        allow_notify: false,
    };

    try {
        const response = await fetch(issueURL + "/post/" + idValue, {
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

        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error updating issue:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchIssueAndPopulateForm);

document.addEventListener('DOMContentLoaded', () => {
    populateDeviceOptions();
    populateVersionOptions();
    document.querySelector('form').addEventListener('submit', submitEvent);
});
