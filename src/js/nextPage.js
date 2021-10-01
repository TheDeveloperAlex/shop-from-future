import config from '../config.json';
import { refs } from './refs';
import { api } from './functions';
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import swiperConfigAds from './adsSwiper';
import swiperConfigCategories from '../configSwiper.json';
import { __ } from './functions';

import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import Handlebars from '../helpers';
SwiperCore.use([Navigation, Pagination]);



export const getNextPage = (path) => {
    api.getData(path).then(data => {
        const obj = {};
        Object.keys(data).forEach(item => {
            obj[item] = data[item];
        });
        api.data.content = { ...api.data.content, ...obj };
        const goodsTpl = require('../tpl/components/goods.hbs').default;

        const goods = [];

        Object.keys(data).forEach(item => {
            const obj = {
                name: '',
                data: [],
            };
            obj.name = item;
            obj.data = data[item];
            goods.push(obj);
        });

        refs.content.insertAdjacentHTML('beforeend', goodsTpl(goods, Handlebars));
        new Swiper('.swiper-container', swiperConfigCategories.card);

    });
};