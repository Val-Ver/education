import { ARTICLES } from './articles.js';
import { ArticlesSection } from "./articlesSection_class.js";

//window.addEventListener("load", main);

const headingInput = document.getElementById('create-heading');
const contentTextarea = document.getElementById('create-content');

const modal = document.getElementById("modal-statistics");

const container = document.getElementById('articles-container');
const articleForm = document.getElementById('article-form');
const form = document.getElementById("form");

let counter = 0
let closeModal = null;

const loader = document.getElementsByClassName('loader')[0];

let articles = JSON.parse(localStorage.getItem('articles'));
if(!articles) {
    localStorage.setItem('articles', JSON.stringify(ARTICLES));
    articles = JSON.parse(localStorage.getItem('articles'));
}

let sectionArticles = null;

(function main() {
    checkArticles();

    addListenerDeleteArticle();
    addListenerBtnShowStatistics();
    addListenerBtnShowCreateArticle();

    showLoader();
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },1000)
    })
    promise
        .then(() => {
            hideLoader();
            sectionArticles = new ArticlesSection('articles-container');
        })
})()


function showLoader() {
    loader.classList.add('show');
}
function hideLoader() {
    loader.classList.remove('show');
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

        showLoader();
        formDisable(true);

        const promise = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            },1000)
        })

        promise
            .then(() => {
                addArticleFromForm(heading, content, publishTime);
            })
            .finally(() => {
                formDisable(false);
                articleForm.reset();
                form.setAttribute('hidden', '');
                hideLoader();
            })

        articleForm.removeEventListener("submit", addArticle);
    }
    articleForm.addEventListener("submit", addArticle);
}

function formDisable(disabled) {
    const elements = articleForm.elements
    for(let element of elements) {
        element.disabled = disabled;
    }
}

function addArticleFromForm(heading, content, dateTime) {
    const id = generateId();
    articles[id] = {
            img: 'img/goblin.jpeg',
            heading: heading,
            dateTime: dateTime,
            content: content
    }
    localStorage.setItem('articles', JSON.stringify(articles));
    checkArticles();
    sectionArticles.addArticle(heading, content, dateTime, 'img/goblin.jpeg', id);
}

function generateId() {
    const lengthId = 5;
    let p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ!@#$%^&*()';
    let id = '';
    for (let i = 0; i < lengthId; i++) {
        id += p[Math.floor(Math.random()*p.length)];
    }
    return id;
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
            const id = article.dataset.id;
            if (article) {
                article.remove();
                delete articles[id];
                localStorage.setItem('articles', JSON.stringify(articles));
                checkArticles();
            }
        }
    });
}

function checkArticles() {
    const isEmpty = Object.keys(articles).length === 0;
    if (isEmpty) {
        const emptyPage = document.createElement('div');
        emptyPage.id = 'empty-page';
        emptyPage.className = 'empty-page';

        const text = document.createElement('h2');
        text.textContent = 'Пока нет ни одной статьи';

        emptyPage.appendChild(text);
        container.appendChild(emptyPage);
    } else {
        const emptyPage = document.getElementById('empty-page');
        if (emptyPage) {
            emptyPage.remove();
        }
    }
}