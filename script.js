window.addEventListener("load", main);

const headingInput = document.getElementById('create-heading');
const contentTextarea = document.getElementById('create-content');

const modal = document.getElementById("modal-statistics");

const container = document.getElementById('articles-container');
const articleForm = document.getElementById('article-form');
const form = document.getElementById("form");

let counter = 0
let closeModal = null;


function main() {
    addListenerDeleteArticle();
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
    counter = articles.length
    counterArticles.textContent = `${counter}`;
}

function addListenerBtnCloseModal() {
    const btnCloseDialog = document.getElementById("close-dialog");
    closeModal = () => {
        modal.close();
        btnCloseDialog.removeEventListener("click", closeModal);
    }
    btnCloseDialog.addEventListener("click", closeModal);
}

function addListenerBtnShowCreateArticle() {
    const createPostBtn = document.getElementById("create-post-btn");
    const createArticle = () => {
        form.removeAttribute('hidden');
        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        addListenerBtnCloseForm();
        addListenerFormAddArticle();
    }
    createPostBtn.addEventListener("click", createArticle);
}

function addListenerBtnCloseForm() {
    const btnCancel = document.getElementById("cancel");

    const closeForm = () => {
        articleForm.reset();
        form.setAttribute('hidden', '');
        btnCancel.removeEventListener("click", closeForm);
    }
    btnCancel.addEventListener("click", closeForm);
}

function addListenerFormAddArticle() {
    const addArticle = (e) => {
        e.preventDefault();

        const heading = headingInput.value.trim();
        const content = contentTextarea.value.trim();
        const publishTime = getCurrentDateTime();

        addArticleFromForm(heading, content, publishTime);
        articleForm.reset();
        form.setAttribute('hidden', '');

        articleForm.removeEventListener("submit", addArticle);
    }
    articleForm.addEventListener("submit", addArticle);
}

function addArticleFromForm(heading, content, dateTime) {
    const template = document.getElementById('article-template');
    const clone = template.content.cloneNode(true);

    const imgForArticle = clone.querySelector('.img-for-article')
    imgForArticle.id = `img-for-article-${counter + 1}`;
    imgForArticle.style.backgroundImage ='url(img/goblin.png)';

    clone.querySelector('h3').textContent = heading;

    const date = clone.querySelectorAll('.text-for-article i');
    date[0].textContent = `опубликовано: ${dateTime}`;

    const paragraphs = clone.querySelectorAll('.text-for-article p');
    paragraphs[1].textContent = content;

    container.appendChild(clone);
}

function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function addListenerDeleteArticle() {
    container.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-article');
        if (deleteButton) {
            const article = deleteButton.closest('article');
            if (article) {
                article.remove();
            }
        }
    });
}