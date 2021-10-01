import './sass/main.scss';
import { refs } from './js/refs';
import {
  renderContent,
  getMainPage,
  noWorkBtnAddProduct,
  workBtnAddProduct,
  workBtnRegister,
  noWorkBtnRegister,
} from './js/functions';
import { renderModals } from './js/renderModals';
import 'material-icons/iconfont/material-icons.css';
import { animateModal } from './js/animation-modal';
import Handlebars from './helpers';

import {
  addToFavourites,
  createEditPost,
  removeFromFavourites,
  deletePost,
  findGood,
} from './js/productsCRUD';

import validator from 'validator';
import { renderCabinet, userCalls, userFavourites } from './js/renderCabinet';
import { registr, logIn, logOut, signInWithGoogle } from './js/auth';
import { api } from './js/functions';
import config from './config.json';
import { getNextPage } from './js/nextPage';
const sales = '/call/specific/sales';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error, success, info } from '@pnotify/core';
import userDataTpl from './tpl/components/userData.hbs';

const debounce = require('lodash.debounce');

export const pnotify = {
  error,
  success,
  info,
};

const getPath = () => {
  return location.pathname + location.search + location.hash;
};

renderContent(getPath());
let counter = 1;

document.addEventListener('click', e => {
  const linkTag = e.target.closest('a');
  const buttonTag = e.target.closest('button');

  if (e.target.dataset.action === 'close-modal-backdrop') {
    refs.modal.innerHTML = '';
    location.hash = '';
    if (location.pathname === '/cabinet') {
      renderCabinet();
    }
  }

  if (!linkTag && !buttonTag) return false;
  if (linkTag) {
    if (linkTag.dataset.action !== 'sign-in-with-google' && linkTag.dataset.action !== 'github') {
      e.preventDefault();
    }
    if (linkTag.dataset.action === 'open-modal-edit') {
      renderModals.createEditProduct('PATCH', linkTag.dataset.id);
      return false;
    }

    if (linkTag.dataset.action === 'show-main-img') {
      const srcChangeImg = linkTag.firstElementChild.getAttribute('src');
      document.querySelector('#mainImg').setAttribute('src', srcChangeImg);
    }
    if (linkTag.classList.contains('swiper-link__once-category')) {
      window.scrollTo(0, 0);
    }

    if (linkTag.dataset.action === 'open-main')
      refs.linkPaginationWrapper.classList.remove('hidden');
    if (linkTag.dataset.action === 'load-more') {
      const amountCategoriesWithSales = api.data.categories.length + 1;
      const amountCategoriesOnMainPages = Object.keys(api.data.content).length;
      if (amountCategoriesWithSales <= amountCategoriesOnMainPages) {
        refs.linkPaginationWrapper.classList.add('hidden');
        counter = 1;
        api.data.counterMainPage = [counter];
        return false;
      } else {
        counter += 1;
        api.data.counterMainPage = [counter];
        const path = config.componentsTpl.goods.getGoods + counter;
        getNextPage(path);
      }
    } else if (linkTag.dataset.action === 'open-cabinet') {
      renderCabinet();
    } else if (linkTag.dataset.action === 'open-cabinet-mobile') {
      renderCabinet();
      const filterMenuNode = refs.header.querySelector('.mobile-menu');
      filterMenuNode.classList.remove('is-open');
    } else if (linkTag.dataset.id === undefined) {
      if (linkTag.getAttribute('href') === sales) {
        refs.linkPaginationWrapper.classList.add('hidden');
        const categoryTpl = require('./tpl/category.hbs').default;
        const card = require('./tpl/components/productCard.hbs').default;
        refs.ads.innerHTML = '';
        const categoryData = card(api.data.content.sales, Handlebars);
        const nameCategory = 'Распродажа';
        refs.content.innerHTML = categoryTpl({ nameCategory, categoryData }, Handlebars);
      } else if (linkTag.getAttribute('href') === '/cabinet/favourites') {
        userFavourites(api.data.user);
      } else if (linkTag.getAttribute('href') === '/cabinet/calls') {
        userCalls(api.data.user);
      } else {
        const path = linkTag.getAttribute('href');
        renderContent(path);
      }
    } else {
      renderModals.cardOneGood(linkTag.dataset.id, linkTag.dataset.category);
    }
  } else if (buttonTag) {
    e.preventDefault();
    if (buttonTag.dataset.action === 'open-card') {
      renderModals.cardOneGood(buttonTag.dataset.id, buttonTag.dataset.category);
    }
    if (buttonTag.dataset.action === 'edit-post') {
      createEditPost('PATCH', `/${buttonTag.dataset.id}`);
    }
    if (buttonTag.dataset.action === 'open-modal-edit') {
      renderModals.createEditProduct('PATCH', buttonTag.dataset.id);
    }

    if (buttonTag.dataset.action === 'open-modal') {
      renderModals[e.target.closest('button').dataset.value]();
      document.querySelector('.mobile-menu').classList.remove('is-open');
      animateModal();
      noWorkBtnAddProduct();
      if (modal.querySelector('input')) {
        refs.modal.querySelector('input').focus();
      }

      if (document.querySelector('#user-log-in') && document.querySelector('#user-register')) {
        document.querySelector('#user-log-in').disabled = true;
        document.querySelector('#user-register').disabled = true;
      }
    }
    if (buttonTag.dataset.action === 'close-modal') {
      if (location.pathname === '/cabinet') {
        renderCabinet();
      }
      refs.modal.innerHTML = '';
      location.hash = '';
    }
    if (buttonTag.dataset.action === 'delete-post-button') {
      deletePost(buttonTag.dataset.id);
    }
    if (buttonTag.dataset.action === 'sign-in-with-google') {
      signInWithGoogle();
    }

    if (buttonTag.dataset.action === 'user-register') {
      registr();
    }

    if (buttonTag.dataset.action === 'add-post') {
      createEditPost('POST');
    }

    if (e.target.dataset.action === 'user-log-in') {
      logIn();
    }

    if (buttonTag.dataset.action === 'log-out') {
      logOut();
      document.querySelector('.mobile-menu').classList.remove('is-open');
      info({ text: `You log out from user profile`, delay: 1000 });

      const path = '/';
      history.pushState(null, null, path);
      getMainPage();
      refs.modal.innerHTML = '';
    }

    if (buttonTag.dataset.action === 'open-filter') {
      const filterMenuNode = refs.header.querySelector('.mobile-menu');
      filterMenuNode.classList.add('is-open');
    }
    if (buttonTag.dataset.action === 'btn-close') {
      const filterMenuNode = refs.header.querySelector('.mobile-menu');
      filterMenuNode.classList.remove('is-open');
    }
    if (buttonTag.dataset.action === 'close-filter') {
      refs.linkPaginationWrapper.classList.remove('hidden');
      refs.header.querySelector('.mobile-menu').classList.remove('is-open');
      refs.header.querySelector('.tablet-menu').classList.remove('is-open');
      refs.content.innerHTML = '';
      const path = '/';
      history.pushState(null, null, path);
      getMainPage();
    }
    if (buttonTag.dataset.action === 'open-input') {
      document.querySelector('.header__form_mobile').classList.add('is-open');
    }

    if (buttonTag.dataset.action === 'open-cabinet-cabinet') {
      const openMyCabinet = refs.header.querySelector('.modal-cabinet');
      if (openMyCabinet.classList.contains('hidden')) {
        openMyCabinet.classList.remove('hidden');
      } else {
        openMyCabinet.classList.add('hidden');
      }
    }
    if (buttonTag.dataset.action === 'open-filter') {
      const filterMenuNode = refs.header.querySelector('.tablet-menu');
      if (filterMenuNode.classList.contains('is-open')) {
        filterMenuNode.classList.remove('is-open');
      } else {
        filterMenuNode.classList.add('is-open');
      }
    }

    if (buttonTag.dataset.action === 'add-to-favourites') {
      addToFavourites(buttonTag.dataset.id);
    }

    if (buttonTag.dataset.action === 'remove-from-favourites') {
      removeFromFavourites(buttonTag.dataset.id);
    }

    if (buttonTag.dataset.action === 'show-user-data') {
      const path = '/user/' + e.target.closest('button').dataset.userid;
      const buttonUserNode = document.querySelector('.card-goods__btn-information');

      function findUserData() {
        return fetch(config.apiUrl + path)
          .then(response => {
            return response.json();
          })
          .then(userData => {
            document.querySelector('.user-data').innerHTML = userDataTpl(userData);
          });
      }
      findUserData();
      buttonUserNode.classList.add('hidden');
    }

    if (buttonTag.dataset.search === 'search') {
      const input = refs.header.querySelector('.header__find');
      const path = input.dataset.search + input.value;

      findGood(path);

      if (input.value != '') {
        const path = input.dataset.search + input.value;
        renderContent(path);
      } else {
        error({ text: 'Please enter the date', delay: 1500 });
      }
      input.value = '';
    }
    if (buttonTag.dataset.search === 'searchmob') {
      const input = refs.header.querySelector('.header__find_mobile');
      const path = input.dataset.searchmob + input.value;

      findGood(path);
      document.querySelector('.header__form_mobile').classList.remove('is-open');

      if (input.value != '') {
        const path = input.dataset.searchmob + input.value;
        renderContent(path);
      } else {
        error({ text: 'Please enter the date', delay: 1500 });
      }
      input.value = '';
    }
    if (buttonTag.dataset.search === 'searchtab') {
      const input = refs.header.querySelector('.header__find_tablet');
      const path = input.dataset.searchtab + input.value;
      findGood(path);
      if (input.value != '') {
        const path = input.dataset.searchtab + input.value;
        renderContent(path);
      } else {
        error({ text: 'Please enter the date', delay: 1500 });
      }
      input.value = '';
    }
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    refs.modal.innerHTML = '';
  }
  if (e.key === 'Enter') {
  }
});

document.addEventListener(
  'input',
  debounce(e => {
    if (e.target.dataset.action === 'register-email') {
      if (!validator.isEmail(e.target.value)) {
        if (e.target.classList.contains('valid')) {
          e.target.classList.remove('valid');
        }
        e.target.classList.add('invalid');
        noWorkBtnRegister();
        pnotify.error({ text: 'Not correct email', delay: 1000 });
      }
      if (validator.isEmail(e.target.value)) {
        if (e.target.classList.contains('invalid')) {
          e.target.classList.remove('invalid');
        }
        e.target.classList.add('valid');
        workBtnRegister();
      }
    }
    if (e.target.dataset.action === 'register-password') {
      if (e.target.value.length < 4) {
        if (e.target.classList.contains('valid')) {
          e.target.classList.remove('valid');
        }
        e.target.classList.add('invalid');
        noWorkBtnRegister();
        pnotify.error({ text: 'Not correct password. Please enter minimum 4', delay: 1000 });
      }
      if (e.target.value.length >= 4) {
        if (e.target.classList.contains('invalid')) {
          e.target.classList.remove('invalid');
        }
        e.target.classList.add('valid');
        workBtnRegister();
      }
    }
    // Валидация модалки создания товара
    if (e.target.dataset.action === 'name-product') {
      if (e.target.value.length <= 3) {
        if (e.target.classList.contains('valid')) {
          e.target.classList.remove('valid');
          workBtnAddProduct();
        }
        e.target.classList.add('invalid');
        noWorkBtnAddProduct();
        pnotify.error({ text: 'Name-product must be more than 3 characters', delay: 1000 });
      }
      if (e.target.value.length > 3) {
        if (e.target.classList.contains('invalid')) {
          e.target.classList.remove('invalid');
        }
        e.target.classList.add('valid');
        workBtnAddProduct();
      }
    }
    if (e.target.dataset.action === 'description-product') {
      if (e.target.value.length <= 10) {
        if (e.target.classList.contains('valid')) {
          e.target.classList.remove('valid');
        }
        e.target.classList.add('invalid');
        noWorkBtnAddProduct();
        pnotify.error({ text: 'Description must be more than 10 characters', delay: 1000 });
      }
      if (e.target.value.length > 10) {
        if (e.target.classList.contains('invalid')) {
          e.target.classList.remove('invalid');
        }
        e.target.classList.add('valid');
        workBtnAddProduct();
      }
    }
    if (e.target.dataset.action === 'price-product') {
      if (/^[0-9]+$/.test(e.target.value)) {
        if (e.target.classList.contains('invalid')) {
          e.target.classList.remove('invalid');
        }
        e.target.classList.add('valid');
      }
    }
  }, 500),
);
