// post.js
import { issueURL, commentURL } from "../config/url.js";
import { displayPost, displayComments } from "../utils/data.js";
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
            // Fade out the spinner and unhide the container
            const spinner = document.getElementById('spinner');
            const container = document.querySelector('.container');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                container.removeAttribute('hidden');
                container.classList.add('fade-in');
            });
            setupEventListeners(); // Call setupEventListeners after displayPost
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

function getComments() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(commentURL + "/" + idValue, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .then(data => {
            if (data.data !== null) {
                displayComments(data.data);
            } else {
                console.log('No comments to display.');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

async function submitComment() {
    const description = document.getElementById('comment_box').value;

    const userDetails = {
        description: description,
    };

    try {
        const response = await fetch(commentURL + "/" + idValue, {
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
            if (description == "/close") {
                window.location.href = 'index.html';
            } else {
                window.location.reload();
            }
        }
    } catch (error) {
        console.error('Error during event creation:', error.message);
    }
}

function initialize() {
    getOnePost();
    getComments();
}

function setupEventListeners() {
    // Add event listeners for buttons here
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            deletePost(idValue);
        });
    });

    const submitCommentButton = document.getElementById('submit_comment_button');
    if (submitCommentButton) {
        submitCommentButton.addEventListener('click', submitComment);  // Add event listener for comment submission
    } else {
        console.error('Submit comment button not found');
    }

    const commentBox = document.getElementById('comment_box');
    commentBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitComment();
        }
    });
}

window.onload = initialize;
