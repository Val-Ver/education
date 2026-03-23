window.addEventListener("load", main);

const modal = document.getElementById("modal-statistics");

let closeModal = null;


function main() {
    addListenerBtnShowStatistics();
    addListenerBtnShowCreateArticle();


}

function addListenerBtnShowStatistics() {
    const showStatsBtn = document.getElementById("show-stats-btn");
    const showViewStats = () => {
        modal.showModal();
        showCountArticles();
        addListenerBtnCloseModal();
    }
    showStatsBtn.addEventListener("click", showViewStats);
}

function showCountArticles() {
    const articles = document.querySelectorAll("article");
    const counterArticles = document.getElementById("articles-counter");
    counterArticles.textContent = `${articles.length}`;
}

function addListenerBtnCloseModal() {
    const btnCloseDialog = document.getElementById("close-dialog");
    closeModal = () => {
        modal.close();
        btnCloseDialog.removeEventListener("click", closeModal);
    }
    btnCloseDialog.addEventListener("click", closeModal);
}



const form = document.getElementById("form");

function addListenerBtnShowCreateArticle() {
    const createPostBtn = document.getElementById("create-post-btn");
    const createArticle = () => {
        form.removeAttribute('hidden');
        addListenerBtnCloseForm();
        addListenerBtnAddArticle();
    }
    createPostBtn.addEventListener("click", createArticle);
}

function addListenerBtnCloseForm() {
    btnCancel = document.getElementById("cancel");

    const closeForm = () => {
        form.setAttribute('hidden', '');
        btnCancel.removeEventListener("click", closeForm);
    }
    btnCancel.addEventListener("click", closeForm);
}

function addListenerBtnAddArticle() {
    const btnAddArticle = document.getElementById('submit');

    const addArticle = () => {
        addArticleFromTemtlate();
        form.setAttribute('hidden', '');
        btnAddArticle.removeEventListener("click", addArticle);
    }

    btnAddArticle.addEventListener("click", addArticle);
}

function addArticleFromTemtlate() {
    const template = document.getElementById('article-template');
    const clone = template.content.cloneNode(true);

    const container = document.getElementById('articles-container');
    container.appendChild(clone);
}