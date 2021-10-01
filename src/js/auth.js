import config from '../config.json';
import { api, rerenderLogIn, rerenderLogOut } from './functions';
import { refs } from './refs';
import { renderCabinet } from './renderCabinet';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error, success, info } from '@pnotify/core';

const getInputData = () => {
  const inputEmailValue = document.querySelector('#email').value.trim();
  const inputPasswordValue = document.querySelector('#password').value.trim();

  return {
    body: {
      email: inputEmailValue,
      password: inputPasswordValue,
    },
    auth: false,
  };
};

export const getUserData = () => {
  if (!localStorage.getItem('accessToken')) return Promise.resolve('no access token');
  return api
    .getData('/user', {
      auth: true,
      body: false,
    })
    .then(data => {
      api.data.user = data;
      return data;
    });
};

const loginRegistr = dataUser => {
  api.postData(config.auth.login.link, dataUser).then(data => {
    if (data.accessToken) {
      refs.modal.innerHTML = '';
    }
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('sid', data.sid);
    api.data.user = data.user;

    rerenderLogIn();
    renderCabinet();
  });
};

export function registr() {
  api.postData(config.auth.register.link, getInputData()).then(data => {
    if (data.registrationDate && data.email && data.id) {
      success({ text: `You created an account`, delay: 1000 });
      const dataUserREgister = getInputData();
      loginRegistr(dataUserREgister);
    }
    if (data.message) {
      error({ text: data.message, delay: 1500 });
    }
  });
}

export const logIn = () => {
  api.postData(config.auth.login.link, getInputData()).then(data => {
    if (data.message) {
      error({ text: data.message, delay: 1500 });
    }
    if (data.accessToken) {
      refs.modal.innerHTML = '';
      success({ text: `You enter in your user profile`, delay: 1000 });
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('sid', data.sid);
      api.data.user = data.user;
      rerenderLogIn();
      renderCabinet();
    }
  });
};
export const logOut = () => {
  const objLogOut = {
    auth: true,
    body: false,
  };
  api.postData(config.auth.logout.link, objLogOut).then(data => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sid');
    api.data.user = {};
    rerenderLogOut();
  });
};

export const signInWithGoogle = () => {
  fetch(config.apiUrl + '/auth/google')
    .then(res => {
      return res.json();
    })
    // .then(data => console.log(data))
    .catch(err => console.log(err));
};
