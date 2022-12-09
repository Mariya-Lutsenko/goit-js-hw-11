import './css/styles.css';
import ArticlesApiService from './js/articles-api-service';
import LoadMoreBtn from './js/components/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const searchForm = document.querySelector('.search-form');
const gallary = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const articlesApiService = new ArticlesApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(event) {
  event.preventDefault();
  // Забираємо термін для пошуку у set
  articlesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  if (articlesApiService.query === '') {
    return Notify.info(`Enter a word to search for images.`);
  }
  loadMoreBtn.show();
  // При зміні пошуку та сабміті форми робимо пошук з 1 сторінки
  articlesApiService.resetPage();
  //очищуємо контейнер з картками при новому запиті і додаємо нові картки
  clearArticlesContainer();
  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disable();
  articlesApiService
    .fetchArticles()
    .then(data => {
      if (data.total === 0) {
        Notify.info(
          `Sorry, there are no images matching your search query: ${articlesApiService.query}. Please try again.`
        );
        loadMoreBtn.hide();
        return;
      }
      appendArticlesMarkup(data);

      if (gallary.children.length === data.totalHits) {
        Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        loadMoreBtn.hide();
      } else {
        loadMoreBtn.enable();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));
}

function appendArticlesMarkup(hits) {
  gallary.insertAdjacentHTML('beforeend', renderArticles(hits));
}
function renderArticles({ hits }) {
  return hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallary-link" href=${hit.largeImageURL}>
    <img class ="gallary-image"src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
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
