'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');

let results = [];

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
      results = data;
      console.log(data);

      if (data.length === 0) {
        gettextNotResult();
      } else {
        const seriesList = document.createElement('ul');
        seriesList.classList.add('main--list');
        let listElement = '';
        console.log(listElement);

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

      function onClickSeries(ev) {
        ev.currentTarget.classList.toggle('js-selected');
        console.log('Me han clicado', ev, ev.target.getAttribute('data-id'));
      }
    });
}

searchButton.addEventListener('click', hunterSeries);

function renderSingleElement(element) {
  const image = element.image ? element.image.medium : 'placeholder';
  return `<li class="main--list__element js-list--element" data-id="${element}">
    <div class="list__container">
    <img src="${image}" class="list__container--image"/>
    <i class="list__container--icon icon icon-star fas fa-star"></i>
    <div>
    <p class="list__element--text">${element.name}</p>
    </li>`;
}

function gettextNotResult() {
  let textNotResult = document.createElement('p');
  textNotResult.innerHTML = 'No hay resultados. Por favor, revisa la búsqueda.';
  searchResults.appendChild(textNotResult);
}
