import { issueURL } from "../config/url.js";
import { displayPost } from "../utils/data.js";

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
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function initialize() {
    getOnePost();
}

window.onload = initialize;
