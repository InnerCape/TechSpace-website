// MOBILE MENU

const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

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

// WHATSAPP CONTACT FORM

if (document.getElementById('enviarBtn')) {
    document.getElementById('enviarBtn').addEventListener('click', function() {
        const nome = document.getElementById('nome').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const area = document.getElementById('area').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || area === '—Escolha uma opção—') {
            alert('Por favor, preencha pelo menos o nome e a área de interesse.');
            return;
        }

        const message = `Olá, meu nome é ${nome}. Empresa: ${empresa}. Email: ${email}. Telefone: ${telefone}. Área de interesse: ${area}. Mensagem: ${mensagem}. Gostaria de solicitar um orçamento.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/27677519907?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });
}

// DARK MODE TOGGLE

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}