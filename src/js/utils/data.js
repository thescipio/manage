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
                    <div class="mt-3 text-1xl text-white font-bold text-left">
                    ${post.title}
                    </div>
                    <div class="issue-details mt-2">
                        <span>${post.author_name}</span>
                        <span class="dot-separator"> • </span>
                        <span>${post.device}</span>
                    </div>
                    <div class="issue-details">
                        <span class="text-sm">${formattedDate}</span>
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
