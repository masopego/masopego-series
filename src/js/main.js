'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');
const searchResults = document.querySelector('.js-search__container');
const favouriteResults = document.querySelector('.js-favourite__container');
const resetButton = document.querySelector('.js-reset__button');
const aside = document.querySelector('.js-aside');
const menuHamburger = document.querySelector('.js-hamburger');
const iconClose = document.querySelector('.js-close');
const searchScrolled = document.querySelector('.js-search-scrolled');
const onLinkStart = document.querySelector('.js-on--link');

const printTextListEmpty = `<div class="container__collection">
  <h2 class="collection__title title capitalize">La lista está vacía</h2>
  <p class="collection__text">
    Inicia la búsqueda para agregar series a esta lista.
  </p>
  <div class="collection__link button button--contain">
    <a
      href="#userSearch"
      class="error__link--contain uppercase js-error--link"
    >
      ok
    </a>
  </div>`;

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
menuHamburger.addEventListener('click', onMenuChange);
iconClose.addEventListener('click', onMenuChange);
document.addEventListener('scroll', onScroll);
searchScrolled.addEventListener('click', (ev) => {
  ev.preventDefault();
  searchForm.focus();
});
onLinkStart.addEventListener('click', (ev) => {
  ev.preventDefault();
  searchForm.focus();
  searchForm.value = '';
});

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

function onMenuChange(ev) {
  aside.classList.toggle('js-opened');
}

function onScroll(ev) {
  window.pageYOffset >= 200
    ? (searchScrolled.style.display = 'block')
    : (searchScrolled.style.display = 'none');
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
    <h3 class="title title--list uppercase">${element.name}</h3>
    </li>`;
}

function renderFavouriteElement(element) {
  const image = element.image
    ? element.image.medium
    : `https://via.placeholder.com/210x295/ffffff/666666/?text=${element.name}`;

  const genre =
    element.genres.length > 0 ? element.genres[0] : 'Género no definido';

  const average = element.rating.average
    ? element.rating.average
    : 'No disponible';

  return `<li class="favourite__list--element">
    <div class="favourite__container">
    <img src="${image}" class="favourite__container--image"/>
    </div>
    <div class="favourite__paragrah">
    <h3 class="favourite__paragrah--text title title--small">${element.name}</h3>
    <i class=" icon icon-trash far fa-trash-alt js-favourite__trash" data-id="${element.id}"></i>
    <p class="favourite__paragrah--genres"> ${genre}</p>
    <small class="favourite__paragrah--average"> Puntuación: <span>${average}</span></small>
    </div>
    </li>`;
}

function printNotResults() {
  let textNotResult = document.createElement('p');
  textNotResult.innerHTML = `<div class="container__error">
    <h2 class="error__title title capitalize"> serie no encontrada </h2>
    <p class="error__text"> No hay resultados para el valor introducido. Por favor, revisa la búsqueda. </p>
    <div class="error__link button button--contain"> <a href="#userSearch" class="error__link--contain uppercase js-error--link">ok</a></div>
    </div>`;

  searchResults.appendChild(textNotResult);
  const searchNotFoundLink = document.querySelector('.js-error--link');
  searchNotFoundLink.addEventListener('click', (ev) => {
    ev.preventDefault();
    searchForm.focus();
    searchForm.value = '';
  });
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
  favouriteList.classList.add('favourite__list');
  let favouritElement = '';

  if (favourites.length <= 0) {
    favouriteResults.innerHTML = printTextListEmpty;
  }
  for (const favourite of favourites) {
    favouritElement += renderFavouriteElement(favourite.show);
  }
  favouriteList.innerHTML = favouritElement;
  favouriteResults.appendChild(favouriteList);

  const removedIcons = document.querySelectorAll('.js-favourite__trash');
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
  favouriteResults.innerHTML = printTextListEmpty;
}

function onTrash(ev) {
  const serieIdentifier = parseInt(ev.target.dataset.id);
  let seriesFavouritePosition = favourites.findIndex(
    (element) => element.show.id === serieIdentifier
  );
  favourites.splice(seriesFavouritePosition, 1);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  const yetinList = document.querySelectorAll('.js-selected');
  const yetinListArr = Array.from(yetinList);
  let yetselected = yetinListArr.find(
    (element) => parseInt(element.dataset.id) === serieIdentifier
  );
  if (yetselected) {
    yetselected.classList.remove('js-selected');
  }

  printFavourites();

  if (favourites.length === 0) {
    disableResetButton();
  }
}

function enableResetButton() {
  resetButton.removeAttribute('disabled');
}

function disableResetButton() {
  resetButton.setAttribute('disabled', '');
}
