class ThemeManager {
    constructor() {
        this.themeKey = 'cafeteria_theme';
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = this.getStoredTheme() || 'light';
        this.items = [];
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        this.animateButton();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            const tooltip = this.themeToggle.querySelector('.theme-tooltip');
            
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fa-solid fa-sun';
                    if (tooltip) tooltip.textContent = 'Modo claro';
                } else {
                    icon.className = 'fa-solid fa-moon';
                    if (tooltip) tooltip.textContent = 'Modo oscuro';
                }
            }
        }
    }

    animateButton() {
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }

    saveTheme(theme) {
        this.storedTheme = theme;
    }

    getStoredTheme() {
        return this.storedTheme || null;
    }
}

function buscarBebida() {
    const entrada = document.getElementById("busqueda")?.value.trim().toLowerCase();
    if (!entrada) return false;
    
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
        alert("Bebida no encontrada. Opciones disponibles: " + Object.keys(rutas).join(', '));
    }
    return false;
}

function setupWhatsApp() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    whatsappFloat.addEventListener('click', function() {
        const numero = '51948738012';
        const mensaje = encodeURIComponent('¡Hola! Me interesa hacer un pedido en su cafetería.');
        window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
    });

    let hasAnimated = false;
    function animateOnScroll() {
        if (!hasAnimated && window.scrollY > 300) {
            whatsappFloat.style.animation = 'pulse 2s infinite, slideInRight 0.5s ease-out';
            hasAnimated = true;
        }
    }
    window.addEventListener('scroll', animateOnScroll);
}

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
    }

    handleOffline() {
        this.isOnline = false;
        this.showOfflineMessage();
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

class ShoppingCart {
    constructor() {
        this.items = [];
        this.shippingCost = 5.00;
        this.freeShippingThreshold = 50.00;
        this.storageKey = 'cafeteria_cart';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCartFromMemory();
        this.updateCartDisplay();
    }

    bindEvents() {
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const closeCartBtn = document.getElementById('close-cart');
        const clearCartBtn = document.getElementById('clear-cart');
        const checkoutBtn = document.getElementById('checkout-btn');

        cartIcon?.addEventListener('click', () => this.openCart());
        closeCartBtn?.addEventListener('click', () => this.closeCart());
        cartModal?.addEventListener('click', (e) => {
            if (e.target === cartModal) this.closeCart();
        });
        clearCartBtn?.addEventListener('click', () => this.clearCart());
        checkoutBtn?.addEventListener('click', () => this.checkout());

        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-cart')) {
                const button = e.target.closest('.add-cart');
                const productData = button.getAttribute('data-product');
                if (productData) {
                    try {
                        const product = JSON.parse(productData);
                        this.addItem(product);
                        this.showNotification(`${product.name} agregado al carrito`);
                    } catch (error) {
                        console.error('Error al agregar producto:', error);
                    }
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCart();
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.saveCartToMemory();
        this.animateCartIcon();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.saveCartToMemory();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.updateCartDisplay();
            this.saveCartToMemory();
        }
    }

    clearCart() {
        if (this.items.length === 0) return;

        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.items = [];
            this.updateCartDisplay();
            this.saveCartToMemory();
            this.showNotification('Carrito vaciado');
        }
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        return subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
    }

    calculateTotal() {
        return this.calculateSubtotal() + this.calculateShipping();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartDisplayCount = document.getElementById('cart-display-count');
        const totalItems = this.getTotalItems();
        
        if (cartCount) cartCount.textContent = totalItems;
        if (cartDisplayCount) cartDisplayCount.textContent = `(${totalItems})`;

        this.updateModalContent();
    }

    updateModalContent() {
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cartItems.style.display = 'block';
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (checkoutBtn) checkoutBtn.disabled = false;
        }

        cartItems.innerHTML = this.items.map(item => this.renderCartItem(item)).join('');

        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const total = this.calculateTotal();

        if (cartSubtotal) cartSubtotal.textContent = `S/${subtotal.toFixed(2)}`;
        if (cartShipping) {
            cartShipping.textContent = shipping === 0 ? 'GRATIS' : `S/${shipping.toFixed(2)}`;
            cartShipping.style.color = shipping === 0 ? '#28a745' : '#666';
        }
        if (cartTotal) cartTotal.textContent = `S/${total.toFixed(2)}`;

        this.bindQuantityEvents();
    }

    renderCartItem(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">S/${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindQuantityEvents() {
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.increase-btn').getAttribute('data-id');
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.decrease-btn').getAttribute('data-id');
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').getAttribute('data-id');
                this.removeItem(productId);
                this.showNotification('Producto eliminado del carrito');
            });
        });
    }

    openCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.hideFloatingButtons();
        }
    }

    closeCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.showFloatingButtons();
        }
    }

    hideFloatingButtons() {
        const themeToggle = document.getElementById('theme-toggle');
        const whatsappFloat = document.getElementById('whatsapp-float');
        
        if (themeToggle) {
            themeToggle.style.opacity = '0';
            themeToggle.style.pointerEvents = 'none';
            themeToggle.style.transform = 'translateX(100px)';
        }
        
        if (whatsappFloat) {
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.pointerEvents = 'none';
            whatsappFloat.style.transform = 'translateX(100px)';
        }
    }

    showFloatingButtons() {
        const themeToggle = document.getElementById('theme-toggle');
        const whatsappFloat = document.getElementById('whatsapp-float');
        
        if (themeToggle) {
            themeToggle.style.opacity = '1';
            themeToggle.style.pointerEvents = 'auto';
            themeToggle.style.transform = 'translateX(0)';
        }
        
        if (whatsappFloat) {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.pointerEvents = 'auto';
            whatsappFloat.style.transform = 'translateX(0)';
        }
    }

    animateCartIcon() {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('cart-animation');
            setTimeout(() => {
                cartIcon.classList.remove('cart-animation');
            }, 300);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    checkout() {
        if (this.items.length === 0) return;

        const total = this.calculateTotal();
        const itemCount = this.getTotalItems();
        
        const message = `¡Pedido confirmado!\n\nProductos: ${itemCount}\nTotal: S/${total.toFixed(2)}\n\n¿Te gustaría realizar el pedido por WhatsApp?`;
        
        if (confirm(message)) {
            this.sendWhatsAppOrder();
        }
    }

    sendWhatsAppOrder() {
        const phoneNumber = '51948738012';
        let message = '¡Hola! Me gustaría hacer un pedido:\n\n';
        
        this.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - S/${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const total = this.calculateTotal();
        
        message += `\nSubtotal: S/${subtotal.toFixed(2)}\n`;
        message += `Envío: ${shipping === 0 ? 'GRATIS' : `S/${shipping.toFixed(2)}`}\n`;
        message += `Total: S/${total.toFixed(2)}`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        this.clearCart();
        this.closeCart();
    }

    saveCartToMemory() {
    }

    loadCartFromMemory() {
    }
}

function setupAnimations() {
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
}

function setupFilters() {
    const filterOptions = document.querySelectorAll('.container-options span');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            console.log('Filtro seleccionado:', filterType);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    new ConnectionMonitor();
    window.cart = new ShoppingCart();
    
    setupWhatsApp();
    setupAnimations();
    setupFilters();
    
    const elements = document.querySelectorAll('.card-feature, .card-category, .card-product');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('animate-in');
    });
});

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('.card-product, .card-feature, .card-category').forEach(card => {
        observer.observe(card);
    });
}

window.addEventListener('load', () => {
    animateOnScroll();
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const whatsappFloat = document.getElementById('whatsapp-float');
    const retryBtn = document.getElementById('retry-connection');
    const offlineMessage = document.getElementById('offline-message');

    let cart = [];
    const shippingCost = 5.00;

    mobileMenuBtn.addEventListener('click', function() {
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('show');
            icon.className = 'fa-solid fa-times';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            icon.className = 'fa-solid fa-bars';
        }
    });

    cartIcon.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
        updateCartDisplay();
    });

    closeCart.addEventListener('click', function() {
        cartModal.classList.add('hidden');
    });

    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-cart')) {
            const productData = JSON.parse(e.target.closest('.add-cart').getAttribute('data-product'));
            addToCart(productData);
        }
    });

    clearCartBtn.addEventListener('click', function() {
        cart = [];
        updateCartCount();
        updateCartDisplay();
    });

    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Redirigiendo al proceso de pago...');
        }
    });

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });

    whatsappFloat.addEventListener('click', function() {
        const phoneNumber = '51948738012';
        let message = 'Hola! Me interesa hacer un pedido:\n\n';
        
        if (cart.length > 0) {
            cart.forEach(item => {
                message += `• ${item.name} x${item.quantity} - S/${(item.price * item.quantity).toFixed(2)}\n`;
            });
            message += `\nTotal: S/${calculateTotal().toFixed(2)}`;
        } else {
            message += 'Quisiera ver su carta de productos disponibles.';
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    retryBtn.addEventListener('click', function() {
        checkConnection();
    });

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        showAddedToCartMessage(product.name);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        updateCartDisplay();
    }

    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                updateCartCount();
                updateCartDisplay();
            }
        }
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        const displayCount = document.getElementById('cart-display-count');
        if (displayCount) {
            displayCount.textContent = `(${totalItems})`;
        }
    }

    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            
            cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-3 p-3 border rounded">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-coffee font-bold">S/${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <i class="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <i class="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" 
                            class="text-red-500 hover:text-red-700">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
        
        updateCartSummary();
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = cart.length > 0 ? subtotal + shippingCost : 0;
        
        cartSubtotal.textContent = `S/${subtotal.toFixed(2)}`;
        cartTotal.textContent = `S/${total.toFixed(2)}`;
    }

    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return cart.length > 0 ? subtotal + shippingCost : 0;
    }

    function showAddedToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        message.textContent = `${productName} agregado al carrito`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    function checkConnection() {
        const connectionText = document.getElementById('connection-text');
        connectionText.textContent = 'Verificando conexión...';
        
        if (navigator.onLine) {
            setTimeout(() => {
                offlineMessage.classList.remove('show');
                connectionText.textContent = 'Conexión restaurada';
            }, 1000);
        } else {
            setTimeout(() => {
                connectionText.textContent = 'Sin conexión a internet';
            }, 1000);
        }
    }

    window.addEventListener('online', function() {
        offlineMessage.classList.remove('show');
    });

    window.addEventListener('offline', function() {
        offlineMessage.classList.add('show');
    });

    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
});

function buscarBebida() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const busquedaMobile = document.getElementById('busqueda-mobile');
    
    if (busquedaMobile && busquedaMobile.value) {
        busqueda = busquedaMobile.value.toLowerCase();
    }
    
    const paginas = {
        'moca helado': 'mocahelado.html',
        'americano': 'americano.html',
        'expreso': 'expreso.html',
        'capuchino': 'capuchino.html',
        'frapuccino': 'frapuccino.html',
        'afogato': 'afogato.html'
    };
    
    if (paginas[busqueda]) {
        window.location.href = paginas[busqueda];
        return false;
    } else {
        alert('Producto no encontrado. Intenta con: Moca Helado, Americano, Expreso, Capuchino, Frapuccino o Afogato.');
        return false;
    }
}