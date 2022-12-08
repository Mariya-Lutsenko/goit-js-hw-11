const API_KEY = '31909701-b05a4a73718479a7bf524b9e0';
const BASE_URL = 'https://pixabay.com/api/';

export default class ArticlesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchArticles() {
    // console.log(this);

    // повертаємо проміс
    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&${this.page}=1&per_page=40`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.incrementPage();
        // дані у data, у консолі прийшов масив hits з об'єктами
        return data.hits;
      });
  }
  //   Після запиту збільшуємо сторінку на 1
  incrementPage() {
    this.page += 1;
  }
  // метод, який збрасує сторінку на 1
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
