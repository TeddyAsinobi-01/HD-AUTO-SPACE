// PAGINATION FOR FILTERS

var btn = document.getElementsByClassName("btn");
var slide = document.getElementById("slide");


btn[0].onclick = function () {
    slide.style.transform = "translatex(0px)";
    for (i = 0; i < 4; i++) {
        btn[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn[1].onclick = function () {
    slide.style.transform = "translatex(-870px)";
    for (i = 0; i < 4; i++) {
        btn[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn[2].onclick = function () {
    slide.style.transform = "translatex(-1800px)";
    for (i = 0; i < 4; i++) {
        btn[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn[3].onclick = function () {
    slide.style.transform = "translatex(-2700px)";
    for (i = 0; i < 4; i++) {
        btn[i].classList.remove("active");
    }
    this.classList.add("active");
}

// PAGINATION FOR ENGINE PARTS
var btn2 = document.getElementsByClassName("btn2");
var slide2 = document.getElementById("slide2");

btn2[0].onclick = function () {
    slide2.style.transform = "translatex(0px)";
    for (i = 0; i < 5; i++) {
        btn2[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn2[1].onclick = function () {
    slide2.style.transform = "translatex(-870px)";
    for (i = 0; i < 5; i++) {
        btn2[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn2[2].onclick = function () {
    slide2.style.transform = "translatex(-1800px)";
    for (i = 0; i < 5; i++) {
        btn2[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn2[3].onclick = function () {
    slide2.style.transform = "translatex(-2700px)";
    for (i = 0; i < 5; i++) {
        btn2[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn2[4].onclick = function () {
    slide2.style.transform = "translatex(-3600px)";
    for (i = 0; i < 5; i++) {
        btn2[i].classList.remove("active");
    }
    this.classList.add("active");
}

//PAGINATION FOR VALVES AND CLUTCH
var btn3 = document.getElementsByClassName("btn3");
var slide3 = document.getElementById("slide3");

btn3[0].onclick = function () {
    slide3.style.transform = "translatex(0px)";
    for (i = 0; i < 3; i++) {
        btn3[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn3[1].onclick = function () {
    slide3.style.transform = "translatex(-870px)";
    for (i = 0; i < 3; i++) {
        btn3[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn3[2].onclick = function () {
    slide3.style.transform = "translatex(-1800px)";
    for (i = 0; i < 3; i++) {
        btn3[i].classList.remove("active");
    }
    this.classList.add("active");
}

//PAGINATION FOR ELECTRICALS
var btn4 = document.getElementsByClassName("btn4");
var slide4 = document.getElementById("slide4");

btn4[0].onclick = function () {
    slide4.style.transform = "translatex(0px)";
    for (i = 0; i < 3; i++) {
        btn4[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn4[1].onclick = function () {
    slide4.style.transform = "translatex(-870px)";
    for (i = 0; i < 3; i++) {
        btn4[i].classList.remove("active");
    }
    this.classList.add("active");
}
btn4[2].onclick = function () {
    slide4.style.transform = "translatex(-1800px)";
    for (i = 0; i < 3; i++) {
        btn4[i].classList.remove("active");
    }
    this.classList.add("active");
}