import { formatDate } from "./parse.js";
import { getMyID } from "./myid.js";

export function displayIssues(datas) {
    const tableBody = document.getElementById('content_body');
    tableBody.innerHTML = '';

    datas.forEach(post => {
        if (post.status === "open") {
            const card = document.createElement('div');
            const formattedDate = formatDate(post.date);

            card.innerHTML = `
            <div class="issue-container flex items-center mt-6">
                <div class="issue-content">
                    <a href="post.html?id=${post.issue_id}">
                        <div class="mt-3 text-1xl text-white font-bold text-left">
                        ${post.title}
                        </div>
                    </a>
                    <div class="issue-details mt-2">
                        <span class="issue-info">
                            <span class="text-xs material-symbols-outlined mr-2">face</span>
                            ${post.author_name}
                        </span>
                        <span class="issue-info">
                            <span class="text-xs material-symbols-outlined mr-2">smartphone</span>
                            ${post.device_parsed}
                        </span>
                    </div>
                    <div class="issue-details">
                        <span class="text-sm">${formattedDate}</span>
                    </div>
                </div>
                <a href="post.html?id=${post.issue_id}" class="chevron-button ml-auto bg-pink-300 hover:bg-pink-500 text-black py-1 px-6 rounded-3xl" style="background-color: #660025; color: #ffd9de; text-decoration: none;">
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

export async function displayPost(data) {
    const tableBody = document.getElementById('mainpost_body');
    tableBody.innerHTML = '';

    try {
        const myID = await getMyID(); // Fetch current user's ID

        if (data.status === "open") {
            const card = document.createElement('div');
            const formattedDate = formatDate(data.date);

            card.innerHTML = `
            <div class="flex items-center mb-6">
                <div>
                    <a onclick="window.history.back()" class="text-4xl">‹</a>
                    <h1 class="text-white text-4xl font-semibold">${data.title}</h1>
                    <span class="issue-info">
                        <span class="text-xs material-symbols-outlined">face</span>
                        ${data.author_name}
                        <span class="text-lg">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                        <span class="text-xs material-symbols-outlined">smartphone</span>
                        ${data.device_parsed}
                    </span>
                    <span class="text-sm">${formattedDate}</span>
                </div>
                <div id="postctrls" class="ml-auto py-1 px-6 rounded-3xl">
                    <button class="delete-button">
                        <span class="text-xs material-symbols-outlined">delete</span>
                    </button>
                    <span class="text-lg">&nbsp;&nbsp;</span>
                    <a href="edit.html?id=${data.issue_id}">
                        <span class="text-xs material-symbols-outlined">edit</span>
                    </a>
                </div>
            </div>

            <div>
                <h3 class="text-white font-bold">Issue Details</h3>
                <p>
                    ${data.description}
                </p>
            </div>
            `;

            // Check if data.userid matches current user's ID
            if (data.user_id !== myID) {
                // If not matching, hide the postctrls div
                const postctrlsDiv = card.querySelector('#postctrls');
                if (postctrlsDiv) {
                    postctrlsDiv.style.display = 'none';
                }
            }

            tableBody.appendChild(card);
        }
    } catch (error) {
        console.error('Error displaying post:', error);
    }
}