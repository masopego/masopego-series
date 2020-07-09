'use strict';

const searchForm = document.querySelector('.js-search__form');
const searchButton = document.querySelector('.js-search__button');

function hunterSeries(ev) {
  ev.preventDefault();
  let userValue = searchForm.value;
  getSeries(userValue);
}

function getSeries(name) {
  fetch(`http://api.tvmaze.com/search/shows?q=${name}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

searchButton.addEventListener('click', hunterSeries);
