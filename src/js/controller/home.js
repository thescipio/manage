import { issueURL } from "../config/url.js";

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
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}


function displayIssues(issues) {
    const tableBody = document.getElementById('content_body');
    tableBody.innerHTML = '';

    issues.forEach(post => {
        if (post.status == "open") {
            const card = document.createElement('div');
            card.innerHTML = `
            <div class="issue-container flex items-center mt-6">
                <div class="issue-content">
                    <div class="mt-3 text-1xl text-white font-bold text-left">
                    ${post.title}
                    </div>
                    <div class="issue-details mt-2">
                        <span>${post.author_name}</span>
                        <span class="dot-separator"> • </span>
                        <span>${post.device}</span>
                    </div>
                </div>
                <a href="" class="chevron-button ml-auto bg-pink-300 hover:bg-pink-500 text-black py-1 px-6 rounded-3xl" style="background-color: rgb(124, 66, 73); color: #fac5cc; text-decoration: none;">
                    ›
                </a>
            </div>

            <div class="flex items-center mt-4">
                <div class="w-full" style="height: 2px; background-color: #514245;"></div>
            </div>
            `;
            tableBody.appendChild(card);
        }
    });
}


function initialize() {
    getIssues();
}

window.onload = initialize;