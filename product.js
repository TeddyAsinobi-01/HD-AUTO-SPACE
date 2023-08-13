var btn = document.getElementsByClassName("btn");
var slide = document.getElementById("slide");
btn[0].onclick = function () {
    slide.style.transform = "translatex(0px)";
}
btn[1].onclick = function () {
    slide.style.transform = "translatex(-870px)";
}
btn[2].onclick = function () {
    slide.style.transform = "translatex(-1800px)";
}
btn[3].onclick = function () {
    slide.style.transform = "translatex(-2700px)";
}