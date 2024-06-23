import { issueURL } from "../config/url.js";
import { token } from "../config/cookies.js";

async function submitEvent(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const device = document.getElementById('device').value;
    const version = document.getElementById('version').value; // Corrected the case here to 'version'
    const description = document.getElementById('description').value;
    const attachment_url = document.getElementById('attachment_url').value;

    const userDetails = {
        title: title,
        device: device,
        version: version, // Corrected the case here to 'version'
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

document.querySelector('form').addEventListener('submit', submitEvent);
