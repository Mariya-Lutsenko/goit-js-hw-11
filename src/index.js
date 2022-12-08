import './css/styles.css';
// import articlesTpl from './templates/articles.hbs';
import ArticlesApiService from './js/articles-api-service';

const searchForm = document.querySelector('.search-form');
const gallary = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');

const articlesApiService = new ArticlesApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  //очищуємо контейнер з картками при новому запиті
  clearArticlesContainer();
  // Забираємо термін для пошуку у set
  articlesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  if (articlesApiService.query === '') {
    return alert('немає даних');
  }
  // При зміні пошуку та сабміті форми робимо пошук з 1 сторінки
  articlesApiService.resetPage();
  // then повертає масив об'єктів hits і передає їх у функцію сворення розмітки appendArticlesMarkup
  articlesApiService.fetchArticles().then(hits => {
    //очищуємо контейнер з картками при новому запиті і додаємо нові картки
    clearArticlesContainer();
    appendArticlesMarkup(hits);
  });
}

function onLoadMore() {
  // викликаємо метод пошуку даних та виводимо картки
  articlesApiService.fetchArticles().then(appendArticlesMarkup);
}
// додаємо картку до gallary
function appendArticlesMarkup(hits) {
  gallary.insertAdjacentHTML('beforeend', renderArticles(hits));
}

// рендерим картку, у функцію приходить масив об'єктів
function renderArticles(hits) {
  return hits
    .map(hit => {
      return `<div class="photo-card">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: </b></br>${hit.likes}
      </p>
      <p class="info-item">
        <b>Views: </b></br>${hit.views}
      </p>
      <p class="info-item">
        <b>Comments: </b></br>${hit.comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b></br>${hit.downloads}
      </p>
    </div>
  </div>
    `;
    })
    .join('');
}
function clearArticlesContainer() {
  gallary.innerHTML = '';
}

// const options = {
//   headers: {
//     key: '31909701-b05a4a73718479a7bf524b9e0',
//   },
// };
