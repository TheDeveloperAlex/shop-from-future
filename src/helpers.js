import Handlebars from 'handlebars';
import { api, __ } from './js/functions';

Handlebars.registerHelper('__', str => __(str));

Handlebars.registerHelper('isSelectedFavourites', (id) => {
    const favourite = api.data.user.favourites;
    if (favourite === undefined) return false;
    const favouritesOfId = [];
    favourite.forEach(item => favouritesOfId.push(item._id));

    if (favouritesOfId.includes(id)) return true;
    return false;
});


Handlebars.registerHelper('isEnoughSlides', (amount) => {
    return amount > 4;
});



export default Handlebars;