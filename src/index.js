import './css/styles.css';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const input = document.querySelector('#search-box');

// 'aruba'

input.addEventListener('input', Debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  surchCountry = input.value.trim();

  if (surchCountry !== '') {
    fetchCountries(surchCountry).then(renderCounry).catch(errorCountry);
  }
}

function renderCounry(countries) {
  if (countries.status === 404) {
    errorCountry();
  }
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countries.length > 1) {
    foundCountries(countries);
  }

  if (countries.length === 1) {
    foundCountry(countries);
    console.log(countries)
  }
}

function foundCountries(countriesInfo) {
  let arr = [];
  countriesInfo.map(el =>
    arr.push(
      `
      <li class="flex">
        <img class="image" src=${el.flags.svg} width="40" heigh="20"/>
        <p>${el.name.common}</p>
      </li>
      `
    )
  );

  countryList.innerHTML = arr.join('');
}

function foundCountry(country) {
  let arr = [];
  country.map(el =>  {
    let langs = Object.values(el.languages)
    arr.push(
      `
      <ul class="country-list">
        <li class="flex">
          <img class="image" src=${el.flags.svg} width="40" heigh="20"/>
          <p>${el.name.common}</p>
        </li>
        <li>
          <p><b>Capital:</b> ${el.capital}</p>
        </li>
        <li>
          <p><b>Population:</b> ${el.population}</p>
        </li>
        <li>
          <p><b>Languages:</b> ${langs}</p>
        </li>
      </ul>
      `
    )
  }
  );

  countryInfo.innerHTML = arr.join('');
}

function errorCountry(error) {
  Notify.failure('Oops, there is no country with that name');
}
