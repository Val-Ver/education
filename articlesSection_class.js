export class ArticlesSection {
    container = null;
    template = document.getElementById('article-template');
    articles = {};

    constructor(elementId, preview = false) {
        this.container = document.getElementById(elementId);
        this.generateArticles();
    }
    generateArticles() {
        this.articles = JSON.parse(localStorage.getItem('articles'));

        for(let key in this.articles) {
            const heading = this.articles[key].heading;
            const content = this.articles[key].content;
            const dateTime = this.articles[key].dateTime;
            const img = this.articles[key].img;
            this.addArticle(heading, content, dateTime, img, key);
        }
    }

    addArticle(heading, content, dateTime, img, id) {
        const clone = this.template.content.cloneNode(true);
        const article = clone.querySelector('article');
        article.dataset.id = `${id}`;

        const imgForArticle = clone.querySelector('.img')
        imgForArticle.style.backgroundImage =`url(${img})`;

        clone.querySelector('h3').textContent = heading;

        const date = clone.querySelector('.text i');
        date.textContent = `опубликовано: ${dateTime}`;

        const paragraphs = clone.querySelectorAll('.text p');
        paragraphs[1].textContent = content;

        this.container.appendChild(clone);
    }
}