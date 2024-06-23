import { formatDate } from "./parse.js";

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
                            <span class="text-xs material-icons">face</span>
                            ${post.author_name}
                        </span>
                        <span class="issue-info">
                            <span class="text-xs material-icons">smartphone</span>
                            ${post.device_parsed}
                        </span>
                    </div>
                    <div class="issue-details">
                        <span class="text-sm">${formattedDate}</span>
                    </div>
                </div>
                <a href="post.html?id=${post.issue_id}" class="chevron-button ml-auto bg-pink-300 hover:bg-pink-500 text-black py-1 px-6 rounded-3xl" style="background-color: rgb(124, 66, 73); color: #fac5cc; text-decoration: none;">
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

export function displayPost(data) {
    const tableBody = document.getElementById('mainpost_body');
    tableBody.innerHTML = '';

    if (data.status === "open") {
        const card = document.createElement('div');
        const formattedDate = formatDate(data.date);

        card.innerHTML = `
        <div class="flex items-center mb-6">
            <div>
                <a href="../" class="text-4xl">‹</a>
                <h1 class="text-white text-4xl font-semibold">${data.title}</h1>
                <span class="issue-info">
                    <span class="text-xs material-icons">face</span>
                    ${data.author_name}
                    <span class="text-lg">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                    <span class="text-xs material-icons">smartphone</span>
                    ${data.device_parsed}
                </span>
                <span class="text-sm">${formattedDate}</span>
            </div>
        </div>

        <div>
            <h3 class="text-white font-bold">Issue Details</h3>
            <p>
                ${data.description}
            </p>
        </div>
        `;
        tableBody.appendChild(card);
    }
}