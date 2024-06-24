import { issueURL } from "../config/url.js";
import { displayPost } from "../utils/data.js";
import { token } from "../config/cookies.js";

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

function getOnePost() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(issueURL + "/post/" + idValue, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .then(data => {
            displayPost(data.data);
            setupEventListeners(); // Call setupEventListeners after displayPost
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function deletePost(postId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };

    fetch(issueURL + "/post/" + postId, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Post deleted successfully');
            // Redirect to index.html if request is successful
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('There was a problem deleting the post:', error);
        });
}


function initialize() {
    getOnePost();
}

function setupEventListeners() {
    // Add event listeners for buttons here
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            deletePost(idValue);
        });
    });
}

window.onload = initialize;

