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
            displayComments(data.data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

async function submitComment() {  // Corrected function name
    const description = document.getElementById('comment_box').value;

    const userDetails = {
        description: description,
    };

    try {
        const response = await fetch(commentURL + "/" + idValue, {  // Use correct idValue
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
            window.location.reload()
        }
    } catch (error) {
        console.error('Error during event creation:', error.message);
    }
}

function initialize() {
    if (token == "") {
        document.getElementById('commentbox').style.display = 'none';
    } else {
        document.getElementById('login2comment').style.display = 'none';
    }
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
}

window.onload = initialize;
