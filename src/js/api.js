import config from '../config.json';
import { isJSON } from './functions';

export default class Api {
  #data = {
    content: {},
    user: {},
  };

  constructor(name, path, obj = {}) {
    this.name = name;
    this.path = path;
    this.obj = obj;
  }

  async send(path = this.path, method = 'GET', obj = {}) {
    const options = {
      headers: { 'Content-Type': 'application/json' },
    };

    if (method !== 'GET') {
      options.method = method;
    }

    if (obj.body) {
      options.body = JSON.stringify(obj.body);
    }
    if (obj.auth) {
      options.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      };
    }
    return await fetch(config.apiUrl + path, options)
      .then(res => {
        if (!isJSON(res)) {
          return res.json();
        } else {
          return res;
        }
      })
      .catch(err => console.log(err));
  }

  async getData(path = this.path, obj = this.obj) {
    const res = await this.send(path, 'GET', obj);
    if (res === undefined || res.length < 1) return Promise.reject('Нет данных');

    return res;
  }
  async postData(path = this.path, obj = this.obj) {
    const res = await this.send(path, 'POST', obj);
    return res;
  }
  async deleteData(path = this.path, obj = this.obj) {
    const res = await this.send(path, 'DELETE', obj);
    return res;
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    return (this.#data = data);
  }
}
