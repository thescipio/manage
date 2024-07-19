import { issueURL } from "../config/url.js";
import { displayIssues } from "../utils/data.js";
import { getParameterByName } from "../utils/url_query.js";

var statusQuery = getParameterByName('open');

function getIssues() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    if (statusQuery === "false") {
        var fetchURL = issueURL + "?open=false"
    } else {
        var fetchURL = issueURL + "?open=true"
    }

    console.log("API URL :" + fetchURL)
    var status = getParameterByName('open');
    fetch(fetchURL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .then(data => {
            displayIssues(data.data);
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
                container.innerHTML = '<p class="text-white">Failed to load issues. Please try again later.</p>';
                container.classList.add('fade-in');
            });
        });
}

function initialize() {
    getIssues();
}

window.onload = initialize;
