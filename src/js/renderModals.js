import { refs } from './refs';
import modalTpl from '../tpl/components/modal.hbs';
import { api, previewFile, stringToCamelCase } from './functions';
import Handlebars from '../helpers';
import { renderCabinet } from './renderCabinet';
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import swiperConfigCategories from '../configSwiper.json';

import SwiperCore, { Navigation, Pagination } from 'swiper/core';
SwiperCore.use([Navigation, Pagination]);

export const renderModals = {
  auth: () => {
    const contentForModal = require('../tpl/components/modals/auth.hbs').default;
    const arr = [1, 2, 3];
    const sprite = require('../images/sprite.svg');

    const modalContent = contentForModal({ arr, sprite });

    refs.modal.innerHTML = modalTpl({ modalContent });
  },
  createEditProduct: (method, id) => {
    if (api.data.user.email === undefined) {
      renderModals.auth();
      return false;
    }
    const contentForModal = require('../tpl/components/modals/createEditProduct.hbs').default;
    const modalContent = contentForModal({ category: api.data.categories }, Handlebars);
    refs.modal.innerHTML = modalTpl({ modalContent });
    if (method === 'PATCH') {
      document.querySelector('#delete-post-button').classList.remove('hidden');
      document.querySelector('.modal-create__heading').textContent = 'Изменить объявление';
      document.querySelector('#addPostProduct').textContent = 'Изменить';
      document.querySelector('#addPostProduct').dataset.action = 'edit-post';
      document.querySelector('#addPostProduct').dataset.id = id;
      document.querySelector('#delete-post-button').dataset.id = id;
      const item = api.data.user.calls.find(item => id === item._id);
      const addModalNode = document.querySelector('#add-post-form');
      addModalNode.querySelector('#product-title').value = item.title;
      addModalNode.querySelector('#product-description').value = item.description;
      addModalNode.querySelector('#product-category').value = item.category;
      addModalNode.querySelector('#product-price').value = item.price;
      addModalNode.querySelector('#product-phone').value = item.phone;
      const images = [];
      item.imageUrls.forEach(item => images.push(item));

      const imagesNodes = addModalNode.querySelectorAll('img');
      const inputNodes = addModalNode.querySelectorAll('.inputfile');
      addModalNode.querySelector('img').setAttribute('src', item.imageUrls[0]);
      for (let i = 0; i < images.length; i++) {
        imagesNodes[i].setAttribute('src', images[i]);
        imagesNodes[i].dataset.image = images[i];
        inputNodes[i].file = images[i];
      }
    }
    refs.modal.querySelectorAll('.inputfile').forEach(input => {
      input.addEventListener('change', previewFile);
    });
  },

  cardOneGood: (id, category) => {
    const contentForModal = require('../tpl/components/modals/cardOneGood.hbs').default;
    const normalizeCategory = stringToCamelCase(category);
    const categories = [];
    Object.keys(api.data.content).forEach(item => categories.push(item));

    let item = {};

    if (location.pathname === '/cabinet' || location.pathname === '/cabinet/favourites' || location.pathname === '/cabinet/calls') {
      if (category === "trade") {
        item = api.data.user.calls.find(item => id === item._id);
      } else {
        item = api.data.user.favourites.find(item => id === item._id);
      }
    } else if (!categories.includes(normalizeCategory) && location.pathname !== '/cabinet') {
      item = api.data.content.sales.find(item => id === item._id);
    } else {
      item = api.data.content[normalizeCategory].find(item => id === item._id);
    }

    const modalContent = contentForModal(item);
    refs.modal.innerHTML = modalTpl({ modalContent });
    new Swiper('.swiper-container', swiperConfigCategories.card);

    if (
      api.data.user.favourites !== undefined &&
      api.data.user.favourites.find(item => id === item._id)
    ) {
      const modalGoods = document.querySelector('#card-goods');
      modalGoods.querySelector('.card-goods-icon').textContent = 'favorite';
      modalGoods.querySelector('.card-goods-icon').classList.add('card-goods-icon-active');
      modalGoods.querySelector('.card-goods__btn-favorites').dataset.action =
        'remove-from-favourites';
    }
    let path = location.pathname + location.search 
    path += `#${id}#${category}`
    history.pushState(null, null, path)
  },

  goItStudents: () => {
    const contentForModal = require('../tpl/components/modals/goItStudents.hbs').default;

    const modalContent = contentForModal();
    refs.modal.innerHTML = modalTpl({ modalContent });
  },
  productCard: () => {
    const contentForModal = require('../tpl/components/modals/productCard.hbs').default;

    const modalContent = contentForModal();
    refs.modal.innerHTML = modalTpl({ modalContent });
  },

  modalExit: () => {
    const contentForModal = require('../tpl/components/modals/modalExit.hbs').default;

    const modalContent = contentForModal();
    refs.modal.innerHTML = modalTpl({ modalContent });
  },

  closeModal: () => {
    refs.modal.innerHTML = '';
  },
  goItStudents: () => {
    const contentForModal = require('../tpl/components/modals/goItStudents.hbs').default;
    const Alexander = require('../images/team/Alexandr.jpg');
    const Aliona = require('../images/team/Aliona.jpeg');
    const Marty = require('../images/team/Marty.jpg');
    const Vladislav = require('../images/team/Vladislav.jpg');
    const Alex = require('../images/team/Alex.jpg');
    const modalContent = contentForModal({ Alexander, Aliona, Marty, Vladislav, Alex });
    const font = require('../fonts/BTTF.ttf');
    refs.modal.innerHTML = modalTpl({ modalContent });
    document.querySelector('#mainModal').style.backgroundColor = 'black';
    document.querySelector('#modalCloseBtn').style.color = 'orange';
  },
};
