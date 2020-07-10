'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');
const favouriteResults = document.querySelector('.js-favourite__container');
let results = [];

const favouritesSaved = JSON.parse(localStorage.getItem('favourites'));
console.log(favouritesSaved);
let favourites = favouritesSaved;
printFavourites();

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
      results = data;
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
  const image = element.image
    ? element.image.medium
    : `https://via.placeholder.com/210x295/ffffff/666666/?text=${element.name}`;
  return `<li class="main--list__element js-list--element" data-id="${element.id}">
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
  const serieIdentifier = parseInt(ev.currentTarget.dataset.id);
  let serie = results.find((e) => e.show.id === serieIdentifier);
  favourites.push(serie);
  localStorage.setItem('favourites', JSON.stringify(favourites));

  printFavourites();
}

function printFavourites() {
  favouriteResults.innerHTML = '';
  let favouriteList = document.createElement('ul');
  let favouritElement = '';
  for (const favourite of favourites) {
    console.log(favourite);
    favouritElement += renderSingleElement(favourite.show);
  }
  favouriteList.innerHTML = favouritElement;
  favouriteResults.appendChild(favouriteList);
}
