const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function () {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});
// TINY SLIDER
var slider = tns({
    container: '.my-slider',
    items: 3,
    slideBy: 'page',
    autoplay: true
});

// var slider = tns({
//     container: '.my-slider',
//     items: 1,
//     responsive: {
//         640: {
//             edgePadding: 20,
//             gutter: 20,
//             items: 2
//         },
//         700: {
//             gutter: 30
//         },
//         900: {
//             items: 3
//         }
//     }
// });
// HOPEFULLY AUTOPLAY
// let autoplay = document.querySelector('#autoplay');

// {
//     "container": "#autoplay",
//     "items": 3,
//     "speed": 300,
//     "autoplay": true,
//     "autoplayHoverPause": true,
//     "autoplayTimeout": 3500,
//     "autoplayText": ["▶",
//         "❚❚"
//     ],
//     "swipeAngle": false
// }
//import { tns } from './src/tiny-slider.js';

