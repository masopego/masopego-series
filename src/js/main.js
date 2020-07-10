'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');

function hunterSeries(ev) {
  ev.preventDefault();
  let userValue = searchForm.value;
  getSeries(userValue);
  clearResults();
}

function clearResults() {
  searchResults.innerHTML = '';
}

function getSeries(name) {
  fetch(`http://api.tvmaze.com/search/shows?q=${name}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.length === 0) {
        let textNotResult = document.createElement('p');
        textNotResult.innerHTML =
          'No hay resultados. Por favor, revisa la búsqueda.';
        searchResults.appendChild(textNotResult);
      } else {
        const seriesList = document.createElement('ul');
        let listElement = '';
        console.log(listElement);

        data.forEach((element) => {
          listElement += renderSingleElement(element.show);
        });
        seriesList.innerHTML = listElement;
        searchResults.appendChild(seriesList);
      }
    });
}

searchButton.addEventListener('click', hunterSeries);

function renderSingleElement(element) {
  const image = element.image ? element.image.medium : 'placeholder';
  return `<li>
    <img src="${image}" class="main--container--image"/>
    <p class="main--container--text">${element.name}</p>
    </li>`;
}
