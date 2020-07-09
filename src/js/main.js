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
      const seriesList = document.createElement('ul');
      let listElement;
      data.forEach((element) => {
        listElement += renderSingleElement(element);
      });
      seriesList.innerHTML = listElement;
      searchResults.appendChild(seriesList);
    });
}

searchButton.addEventListener('click', hunterSeries);

function renderSingleElement(element) {
  return `<li>
    <img src="${element.show.image.medium}"/>
    <p>${element.show.name}</p>
    </li>`;
}
