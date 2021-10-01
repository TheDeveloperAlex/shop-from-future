import { api } from './functions';
import { refs } from './refs';
import Handlebars from '../helpers';
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import swiperConfigCategories from '../configSwiper.json';

import SwiperCore, { Navigation, Pagination } from 'swiper/core';
SwiperCore.use([Navigation, Pagination]);

export const renderCabinet = () => {
  const cabinet = require('../tpl/components/userCabinet.hbs').default;
  refs.content.innerHTML = cabinet({ userData: api.data.user }, Handlebars);
  new Swiper('.swiper-container', swiperConfigCategories.cabinet);
  if (refs.ads.childElementCount > 0) {
    refs.linkPaginationWrapper.classList.add('hidden');
    refs.ads.innerHTML = '';
  }
  if (api.data.user.favourites !== undefined && api.data.user.favourites.length < 1) {
    document.querySelector('.swiper-container.favourite').classList.add('hidden');
    document.querySelector('.empty-favourite').classList.remove('hidden');
  }
  if (api.data.user.calls !== undefined && api.data.user.calls.length < 1) {
    document.querySelector('.swiper-container.calls').classList.add('hidden');
    document.querySelector('.empty-goods').classList.remove('hidden');
  }

  history.pushState(null, null, '/cabinet');
  api.data.content = {};
};

export const userFavourites = data => {
  if (data === 'no access token') {
    refs.content.innerHTML = '<h1>Register before add favourites to cabinet.</h1>';
    return false;
  }
  if (data.favourites.length === 0) {
    refs.content.innerHTML = '<h1>Вы пока не добавили ни одного объявления в избранное.</h1>';
    return false;
  }
  const fauvorites = require('../tpl/category.hbs').default;
  const card = require('../tpl/components/productCard.hbs').default;
  const categoryData = card(api.data.user.favourites, Handlebars);
  refs.content.innerHTML = fauvorites({ nameCategory: 'favourites', categoryData }, Handlebars);
  history.pushState(null, null, '/cabinet/favourites');
};

export const userCalls = data => {
  if (data === 'no access token') {
    refs.content.innerHTML = '<h1>Marty was here. Register before add calls to cabinet.</h1>';
    return false;
  }
  if (data.calls.length === 0) {
    refs.content.innerHTML = '<h1>Вы пока не добавили ни одного объявления.</h1>';
    return false;
  }
  const fauvorites = require('../tpl/category.hbs').default;
  const card = require('../tpl/components/productCard.hbs').default;
  const categoryData = card(api.data.user.calls, Handlebars);
  refs.content.innerHTML = fauvorites({ nameCategory: 'calls', categoryData }, Handlebars);
  const button = refs.content.querySelectorAll('.link-card');
  button.forEach(item => {
    item.dataset.action = 'open-modal-edit';
    item.dataset.value = 'createEditProduct';
  });

  history.pushState(null, null, '/cabinet/calls');
};
