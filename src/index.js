import './css/styles.css';
import { renderArticles } from './js/renderArticles';
import ArticlesApiService from './js/articles-api-service';
import LoadMoreBtn from './js/components/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallary = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const articlesApiService = new ArticlesApiService();

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(event) {
  event.preventDefault();
  //очищуємо контейнер з картками при новому запиті і додаємо нові картки
  clearArticlesContainer();
  // Забираємо термін для пошуку у set
  articlesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  if (articlesApiService.query === '') {
    return Notify.info(`Enter a word to search for images.`);
  }
  loadMoreBtn.show();
  // При зміні пошуку та сабміті форми робимо пошук з 1 сторінки
  articlesApiService.resetPage();
  fetchArticles();
}

async function fetchArticles() {
  loadMoreBtn.disable();
  try {
    const data = await articlesApiService.fetchArticles();

    if (data.total === 0) {
      Notify.info(
        `Sorry, there are no images matching your search query: ${articlesApiService.query}. Please try again.`
      );
      loadMoreBtn.hide();
      return;
    }
    appendArticlesMarkup(data);
    onPageScrolling();
    lightbox.refresh();

    if (gallary.children.length === data.totalHits) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.hide();
    } else {
      loadMoreBtn.enable();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
  } catch (error) {
    Notify.info(`Error`);
  }
}

// function fetchArticles() {
//   loadMoreBtn.disable();
//   articlesApiService
//     .fetchArticles()
//     .then(data => {
//       if (data.total === 0) {
//         Notify.info(
//           `Sorry, there are no images matching your search query: ${articlesApiService.query}. Please try again.`
//         );
//         loadMoreBtn.hide();
//         return;
//       }
//       appendArticlesMarkup(data);
//       onPageScrolling();
//       lightbox.refresh();

//       if (gallary.children.length === data.totalHits) {
//         Notify.info(
//           `We're sorry, but you've reached the end of search results.`
//         );
//         loadMoreBtn.hide();
//       } else {
//         loadMoreBtn.enable();
//         Notify.success(`Hooray! We found ${data.totalHits} images.`);
//       }
//     })
//     .catch(error => Notify.info(`Error`));
// }

function appendArticlesMarkup(hits) {
  gallary.insertAdjacentHTML('beforeend', renderArticles(hits));
}

function clearArticlesContainer() {
  gallary.innerHTML = '';
}

// Плавна прокрутка сторінки після запиту і рендера кожної наступної групи зображень
function onPageScrolling() {
  const { height: cardHeight } =
    gallary.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
