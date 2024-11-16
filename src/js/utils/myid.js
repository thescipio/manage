import { myidURL } from "../config/url.js";
import { token } from "../config/cookies.js";

export async function getMyID() { // Note the async keyword here
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };

    try {
        const response = await fetch(myidURL, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const data = await response.json();
        return data.userid;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export async function isCoreUser() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };
    
    try {
        const response = await fetch(myidURL, requestOptions);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.isCore === true;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
}