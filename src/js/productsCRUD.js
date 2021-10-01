import { api } from './functions';
import config from '../config.json';
import { getUserData } from './auth';
import { renderCabinet, userCalls, userFavourites } from './renderCabinet';
import { refs } from './refs';
import { renderModals } from './renderModals';
import { pnotify } from '../index';

export const addToFavourites = id => {
  if (api.data.user.email === undefined) {
    refs.modal.innerHTML = '';
    renderModals.auth();
    pnotify.error({ text: 'auth first', delay: 1000 });
    return false;
  }
  api.postData(config.favourites_URL + '/' + id, { data: false, auth: true }).then(data => {
    getUserData().then(() => {
      const modalGoods = document.querySelectorAll(
        `button[data-id='${id}'][data-action="add-to-favourites"]`,
      );
      modalGoods.forEach(item => {
        item.querySelector('.card-goods-icon').textContent = 'favorite';
        item.querySelector('.card-goods-icon').classList.add('card-goods-icon-active');
        item.dataset.action = 'remove-from-favourites';
      });
    });
  });
};

export const removeFromFavourites = id => {
  api.deleteData(config.favourites_URL + '/' + id, { data: false, auth: true }).then(data => {
    getUserData().then(data => {
      const modalGoods = document.querySelectorAll(
        `button[data-id='${id}'][data-action="remove-from-favourites"]`,
      );
      modalGoods.forEach(item => {
        item.querySelector('.card-goods-icon').textContent = 'favorite_border';
        item.querySelector('.card-goods-icon').classList.remove('card-goods-icon-active');
        item.dataset.action = 'add-to-favourites';
      });
      if (location.pathname === '/cabinet') {
        refs.modal.innerHTML = '';
        renderCabinet();
      }
      if (location.pathname === '/cabinet/favourites') {
        userFavourites(data);
      }
      if (location.pathname === '/cabinet/calls') {
        userCalls(data);
      }
    });
  });
};

export const editPost = () => {
  const addModalNode = document.querySelector('#add-post-form');
};

export const createEditPost = (method = 'POST', path = '') => {
  const addModalNode = document.querySelector('#add-post-form');
  const images = [];
  let imageCounter = 0;
  addModalNode.querySelectorAll('.inputfile').forEach(item => {
    if (item.files[0] !== undefined) {
      images.push(item.files[0]);
      imageCounter += 1;
    }
  });

  const inputsValueNewProduct = {
    title: addModalNode.querySelector('#product-title').value,
    description: addModalNode.querySelector('#product-description').value,
    category: addModalNode.querySelector('#product-category').value,
    price: addModalNode.querySelector('#product-price').value,
    phone: addModalNode.querySelector('#product-phone').value,
  };
  if (method === 'PATCH') {
    const imagesDataset = [];
    const imagesDatasetNodes = document.querySelector('#add-post-form').querySelectorAll('img');
    imagesDatasetNodes.forEach(item => {
      if (item.dataset.image !== undefined && item.getAttribute('src') !== item.dataset.image) {
        imagesDataset.push(item.dataset.image);
      }
    });

    const postId = path.slice(1);
    const ownProduct = api.data.user.calls.find(item => item._id === postId);
    const imageUrls = ownProduct.imageUrls;
    const newImageUrls = [...imageUrls];
    if (imagesDataset.length !== 0) {
      imagesDataset.forEach(item => {
        if (newImageUrls.includes(item)) {
          imageUrls.splice(imageUrls.indexOf(newImageUrls), 1);
        }
      });
    }

    if (imageUrls.length !== newImageUrls.length) {
      inputsValueNewProduct.imageUrls = JSON.stringify(imageUrls);
    }
  }

  sendData('https://callboard-backend.goit.global/call' + `${path}`, inputsValueNewProduct);
  async function sendData(url, data) {
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    if (images !== 0) {
      images.forEach(item => formData.append('file', item));
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.title === undefined) {
          pnotify.error({ text: data.message, delay: 1000 });
          return false;
        }
        getUserData().then(() => {
          let pnotifyText = 'Товар успешно добавлен!';
          if (method === 'PATCH') {
            pnotifyText = 'Товар успешно изменен!';
          }
          pnotify.success({ text: pnotifyText, delay: 1000 });
          refs.modal.innerHTML = '';
          renderCabinet();
        });
      })
      .then(err => console.log(err));
  }
};

export const deletePost = id => {
  api.deleteData('/call/' + id, { data: false, auth: true }).then(data => {
    refs.modal.innerHTML = '';
    getUserData().then(data => {
      if (location.pathname === '/cabinet/calls') {
        userCalls(data);
        return false;
      }
      renderCabinet();
    });
  });
};

export const findGood = path => {
  api
    .getData(path, { body: false, auth: false })
    .then(res => res.json())
    .then(good => {
      if (good.length < 1) {
        error({ text: 'Your request is incorrect!', delay: 1500 });
        refs.content.innerHTML = 'Your request is incorrect! Please enter the date.';
      }
      if (good.length > 0) {
        success({ text: `Goods were found.`, delay: 1000 });
      }
    });
};
