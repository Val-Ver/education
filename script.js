window.addEventListener("load", main);



function main() {
    addListenerBtnAdminPanel();
    addListenerBtnCloseAdminPanel()
}

function showCountArticles() {
    const articles = document.querySelectorAll("article");

    const counterArticles = document.getElementById("articles-counter");
    counterArticles.textContent = `${articles.length}`;
}

function addListenerBtnAdminPanel() {
    const showStatsBtn = document.getElementById("show-stats-btn");
    const viewStats = document.getElementById("statistics");
    const showViewStats = () => {
        viewStats.showModal();
        showCountArticles();
    }
    showStatsBtn.addEventListener("click", showViewStats);
}
function addListenerBtnCloseAdminPanel() {
    const viewStats = document.getElementById("statistics");
    const btnCloseDialog = document.getElementById("close-dialog");
    const closeViewStats = () => {
        viewStats.close();
    }
    btnCloseDialog.addEventListener("click", closeViewStats);
}