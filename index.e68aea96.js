const e=document.querySelector(".search-form"),t=document.querySelector(".gallery"),n=document.querySelector('[data-action="load-more"]'),r=new class{fetchArticles(){return fetch(`https://pixabay.com/api/?key=31909701-b05a4a73718479a7bf524b9e0&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&${this.page}=1&per_page=40`).then((e=>e.json())).then((e=>(console.log(e),this.incrementPage(),e.hits)))}incrementPage(){this.page+=1}resetPage(){this.page=1}get query(){return this.searchQuery}set query(e){this.searchQuery=e}constructor(){this.searchQuery="",this.page=1}};function s(e){t.insertAdjacentHTML("beforeend",function(e){return e.map((e=>`<div class="photo-card">\n    <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" />\n    <div class="info">\n      <p class="info-item">\n        <b>Likes: </b></br>${e.likes}\n      </p>\n      <p class="info-item">\n        <b>Views: </b></br>${e.views}\n      </p>\n      <p class="info-item">\n        <b>Comments: </b></br>${e.comments}\n      </p>\n      <p class="info-item">\n        <b>Downloads: </b></br>${e.downloads}\n      </p>\n    </div>\n  </div>\n    `)).join("")}(e))}function i(){t.innerHTML=""}e.addEventListener("submit",(function(e){if(e.preventDefault(),i(),r.query=e.currentTarget.elements.searchQuery.value.trim(),""===r.query)return alert("немає даних");r.resetPage(),r.fetchArticles().then((e=>{i(),s(e)}))})),n.addEventListener("click",(function(){r.fetchArticles().then(s)}));
//# sourceMappingURL=index.e68aea96.js.map
