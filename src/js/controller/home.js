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
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}



function initialize() {
    getIssues();
}

window.onload = initialize;
