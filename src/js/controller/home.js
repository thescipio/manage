import { issueURL } from "../config/url.js";
import { formatDate } from "../utils/parse.js";
import { displayIssues } from "../utils/data.js";

function getIssues() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(issueURL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .then(data => {
            displayIssues(data.data);
            // Fade out the spinner and unhide the container
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
            // Even in case of error, remove the spinner and show an error message if needed
            const spinner = document.getElementById('spinner');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                // Show an error message in the container
                const container = document.querySelector('.container');
                container.removeAttribute('hidden');
                container.innerHTML = '<p class="text-white">Failed to load issues. Please try again later.</p>';
                container.classList.add('fade-in');
            });
        });
}

function initialize() {
    getIssues();
}

window.onload = initialize;
