'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');

searchButton.addEventListener('click', onSearch);

function onSearch(ev) {
  ev.preventDefault();
  clearResults();
  getSeries(searchForm.value);
}

function clearResults() {
  searchResults.innerHTML = '';
}

function getSeries(search) {
  fetch(`http://api.tvmaze.com/search/shows?q=${search}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Results', data);
      if (data.length === 0) {
        printNotResults();
      } else {
        printSeries(data);
      }
    });
}

function printSeries(data) {
  const seriesList = document.createElement('ul');
  seriesList.classList.add('main--list');
  let listElement = '';

  data.forEach((element) => {
    listElement += renderSingleElement(element.show);
  });
  seriesList.innerHTML = listElement;
  searchResults.appendChild(seriesList);

  let seriesElement = document.querySelectorAll('.js-list--element');
  seriesElement.forEach((element) => {
    element.addEventListener('click', onClickSeries);
  });
}

function renderSingleElement(element) {
  const image = element.image ? element.image.medium : 'placeholder';
  return `<li class="main--list__element js-list--element">
    <div class="list__container">
    <img src="${image}" class="list__container--image"/>
    <i class="list__container--icon icon icon-star fas fa-star"></i>
    <div>
    <p class="list__element--text">${element.name}</p>
    </li>`;
}

function printNotResults() {
  let textNotResult = document.createElement('p');
  textNotResult.innerHTML = 'No hay resultados. Por favor, revisa la búsqueda.';
  searchResults.appendChild(textNotResult);
}

function onClickSeries(ev) {
  ev.currentTarget.classList.toggle('js-selected');
}
