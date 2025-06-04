// Función de búsqueda de bebidas
function buscarBebida() {
    const entrada = document.getElementById("busqueda").value.trim().toLowerCase();
    const rutas = {
        "moca helado": "mocahelado.html",
        "americano": "americano.html",
        "expreso": "expreso.html",
        "capuchino": "capuchino.html",
        "frapuccino": "frapuccino.html",
        "afogato": "afogato.html"
    };
    
    if (rutas[entrada]) {
        window.location.href = rutas[entrada];
    } else {
        alert("Bebida no encontrada");
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            window.open('https://wa.me/+51948738012', '_blank');
        });
    }

    let hasAnimated = false;
    function animateOnScroll() {
        if (!hasAnimated && window.scrollY > 300) {
            if (whatsappFloat) {
                whatsappFloat.style.animation = 'pulse 2s infinite, slideInRight 0.5s ease-out';
                hasAnimated = true;
            }
        }
    }
    window.addEventListener('scroll', animateOnScroll);

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeTooltip = themeToggle.querySelector('.theme-tooltip');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcon(newTheme);
        
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeTooltip.textContent = 'Modo claro';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeTooltip.textContent = 'Modo oscuro';
        }
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const productCards = document.querySelectorAll('.card-product');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    const categoryCards = document.querySelectorAll('.card-category');
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    const featureCards = document.querySelectorAll('.card-feature');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });
});

const slideInRightKeyframes = `
@keyframes slideInRight {
    from {
        transform: translateX(100px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = slideInRightKeyframes;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', function() {
    const filterOptions = document.querySelectorAll('.container-options span');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            console.log('Filtro seleccionado:', filterType);
        });
    });
});

class ConnectionMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineMessage = document.getElementById('offline-message');
        this.retryButton = document.getElementById('retry-connection');
        this.connectionText = document.getElementById('connection-text');
        
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        this.retryButton?.addEventListener('click', () => this.retryConnection());
        
        if (!this.isOnline) {
            this.showOfflineMessage();
        }
    }

    handleOnline() {
        this.isOnline = true;
        this.hideOfflineMessage();
        console.log('Conexión restaurada');
    }

    handleOffline() {
        this.isOnline = false;
        this.showOfflineMessage();
        console.log('Conexión perdida');
    }

    showOfflineMessage() {
        if (this.offlineMessage) {
            this.offlineMessage.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideOfflineMessage() {
        if (this.offlineMessage) {
            this.offlineMessage.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    async retryConnection() {
        this.retryButton.classList.add('loading');
        this.connectionText.textContent = 'Verificando conexión...';
        
        try {
            const response = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            
            this.connectionText.textContent = '¡Conexión restaurada!';
            setTimeout(() => {
                this.handleOnline();
                this.retryButton.classList.remove('loading');
            }, 1000);
            
        } catch (error) {
            this.connectionText.textContent = 'Sin conexión. Inténtalo de nuevo.';
            this.retryButton.classList.remove('loading');
            
            setTimeout(() => {
                this.connectionText.textContent = 'Verificando conexión...';
            }, 2000);
        }
    }
}

class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }
}

function buscarBebida() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const bebidas = {
        'moca helado': 'mocahelado.html',
        'americano': 'americano.html',
        'expreso': 'expreso.html',
        'capuchino': 'capuchino.html',
        'frapuccino': 'frapuccino.html',
        'afogato': 'afogato.html'
    };

    if (bebidas[busqueda]) {
        window.location.href = bebidas[busqueda];
    } else if (busqueda.trim() !== '') {
        alert('Bebida no encontrada. Intenta con: Moca Helado, Americano, Expreso, Capuchino, Frapuccino o Afogato');
    }
    
    return false;
}

function setupWhatsApp() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    whatsappFloat?.addEventListener('click', () => {
        const mensaje = encodeURIComponent('¡Hola! Me interesa hacer un pedido en su cafetería.');
        const numero = '948738012';
        window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectionMonitor();
    new ThemeToggle();
    setupWhatsApp();
    
    const elements = document.querySelectorAll('.card-feature, .card-category, .card-product');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('animate-in');
    });
});