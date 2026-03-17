// MOBILE MENU

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

// SCROLL ANIMATION INITIALIZATION

AOS.init({
    duration: 1000,
    once: true
});

// NAVBAR SCROLL EFFECT

window.addEventListener("scroll", function(){

const nav = document.querySelector("nav");

if(window.scrollY > 50){
    nav.classList.add("nav-scrolled");
}
else{
    nav.classList.remove("nav-scrolled");
}

});

// SMOOTH SCROLL FOR LINKS

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({
behavior: 'smooth'
});

});

});