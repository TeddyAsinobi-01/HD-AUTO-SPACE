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
function liveSearch() {
    // Locate the card elements
    let cards = document.querySelectorAll('.cards')
    // Locate the search input
    let search_query = document.getElementById("searchbox").value;
    // Loop through the cards
    for (var i = 0; i < cards.length; i++) {
        // If the text is within the card...
        if (cards[i].innerText.toLowerCase()
            // ...and the text matches the search query...
            .includes(search_query.toLowerCase())) {
            // ...remove the `.is-hidden` class.
            cards[i].classList.remove("is-hidden");
        } else {
            // Otherwise, add the class.
            cards[i].classList.add("is-hidden");
        }
    }
}
// JavaScript code
// function search_items() {
//     let input = document.getElementsByClassName('search-bar').value
//     input = input.toLowerCase();
//     let x = document.getElementsByTagName("h5");

//     for (i = 0; i < x.length; i++) {
//         if (!x[i].innerHTML.toLowerCase().includes(input)) {
//             x[i].style.display = "none";
//         }
//         else {
//             x[i].style.display = "list-item";
//         }
//     }
// }
// function search_animal() {
//     let input = document.getElementById('searchbar').value
//     input = input.toLowerCase();
//     let x = document.getElementsByClassName('animals');

//     for (i = 0; i < x.length; i++) {
//         if (!x[i].innerHTML.toLowerCase().includes(input)) {
//             x[i].style.display = "none";
//         }
//         else {
//             x[i].style.display = "list-item";
//         }
//     }
// }