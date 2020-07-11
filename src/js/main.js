'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');
const favouriteResults = document.querySelector('.js-favourite__container');
const resetButton = document.querySelector('.js-reset__button');
let results = [];
let favourites = [];

function getfavourites() {
  const favouritesSaved = JSON.parse(localStorage.getItem('favourites'));
  if (favouritesSaved && favouritesSaved.length > 0) {
    favourites = favouritesSaved;
    printFavourites();
    enableResetButton();
  }
}
getfavourites();

searchButton.addEventListener('click', onSearch);
resetButton.addEventListener('click', onReset);

function onSearch(ev) {
  ev.preventDefault();
  clearResults();
  getSeries(searchForm.value);
}

function onReset(ev) {
  favourites = [];
  localStorage.removeItem('favourites');
  clearFavourites();
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

  let additionalClass = '';
  let isInFavourite = favourites.find((e) => e.show.id === element.id);
  if (isInFavourite) {
    additionalClass = 'js-selected';
  }

  return `<li class="list__element js-list--element ${additionalClass}" data-id="${element.id}">
    <div class="list__container">
    <img src="${image}" class="list__container--image"/>
    <i class="list__container--icon icon icon-star fas fa-star"></i>
    <div>
    <p class="list__element--text">${element.name}</p>
    </li>`;
}

function renderFavouriteElement(element) {
  const image = element.image
    ? element.image.medium
    : `https://via.placeholder.com/210x295/ffffff/666666/?text=${element.name}`;

  return `<li class="list__element js-list--element" data-id="${element.id}">
    <div class="list__container">
    <img src="${image}" class="list__container--image"/>
    <i class=" icon icon-trash far fa-trash-alt js-favourite__trash"></i>
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

  let seriesInFavourite = favourites.findIndex(
    (element) => element.show.id === serieIdentifier
  );
  if (seriesInFavourite === -1) {
    favourites.push(serie);
    enableResetButton();
  } else {
    favourites.splice(seriesInFavourite, 1);
    if (favourites.length === 0) {
      disableResetButton();
    }
  }
  localStorage.setItem('favourites', JSON.stringify(favourites));
  printFavourites();
}

function printFavourites() {
  favouriteResults.innerHTML = '';
  let favouriteList = document.createElement('ul');
  let favouritElement = '';
  for (const favourite of favourites) {
    favouritElement += renderFavouriteElement(favourite.show);
  }
  favouriteList.innerHTML = favouritElement;
  favouriteResults.appendChild(favouriteList);

  const removedIcons = document.querySelectorAll('.js-favourite__trash');
  console.log(removedIcons);
  removedIcons.forEach((element) => {
    element.addEventListener('click', onTrash);
  });
}

function clearFavourites() {
  favouriteResults.innerHTML = '';
  const yetSelectedFavourites = document.querySelectorAll('.js-selected');
  yetSelectedFavourites.forEach((element) => {
    element.classList.remove('js-selected');
  });
  disableResetButton();
}

function onTrash(ev) {
  alert('Holiiiiiiiss');
}

function enableResetButton() {
  resetButton.removeAttribute('disabled');
}

function disableResetButton() {
  resetButton.setAttribute('disabled', '');
}
