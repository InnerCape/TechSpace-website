// THEME TOGGLE

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// LOAD THEME ON PAGE LOAD

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
});

// MOBILE MENU

const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

function toggleMenu() {
    const menu = document.getElementById("menu");
    const nav = document.querySelector("nav");
    menu.classList.toggle("show");
    nav.classList.toggle("show");
    menuToggle.classList.toggle("active");
}

// SCROLL ANIMATION INITIALIZATION

if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({
        duration: 1000,
        once: true
    });
}

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
        const whatsappUrl = `https://wa.me/5583883341499?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });
}

// STICKY WHATSAPP BUTTON (MOBILE)

function createStickyWhatsAppButton() {
    const button = document.createElement('a');
    button.href = 'https://wa.me/5583883341499';
    button.target = '_blank';
    button.className = 'sticky-whatsapp-btn';
    button.title = 'Fale conosco no WhatsApp';
    button.innerHTML = '💬 WhatsApp';
    document.body.appendChild(button);

    // Show button after scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
}

// Initialize sticky button on mobile screens
window.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        createStickyWhatsAppButton();
    }
});

// DARK MODE TOGGLE

const form = document.getElementById("contactForm");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");
const popup = document.getElementById("successPopup");

if (popup) {
    popup.classList.add("hidden");
}

if (form && btnText && loader && popup) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        btnText.textContent = "Enviando...";
        loader.classList.remove("hidden");

        const data = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                Accept: "application/json",
            },
        });

        loader.classList.add("hidden");
        btnText.textContent = "Enviar Mensagem";

        if (response.ok) {
            form.reset();
            popup.classList.remove("hidden");
        } else {
            alert("Erro ao enviar. Tente novamente.");
        }
    });
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted && form) {
        form.reset();
    }
});

function closePopup() {
    const popupEl = document.getElementById("successPopup");
    if (popupEl) {
        popupEl.classList.add("hidden");
    }
    if (form) {
        form.reset();
    }
}