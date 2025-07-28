// Global JavaScript Functions for HomeStore

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all global functions
    initializeScrollAnimations();
    initializeNavigation();
    initializeSearch();
    initializeCartFunctionality();
    initializeNewsletterForm();
    initializeSmoothScroll();
});

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.category-card, .service-item, .product-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggler = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('.navbar-collapse');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navCollapse.classList.contains('show')) {
                navToggler.click();
            }
        });
    });

    // Active navigation highlighting
    highlightActiveNavigation();
}

// Highlight active navigation based on current page
function highlightActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results position-absolute bg-white border rounded shadow-lg d-none';
    searchResults.style.top = '100%';
    searchResults.style.left = '0';
    searchResults.style.right = '0';
    searchResults.style.zIndex = '1000';
    searchResults.style.maxHeight = '300px';
    searchResults.style.overflowY = 'auto';

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(searchResults);

        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();

            if (query.length >= 2) {
                searchTimeout = setTimeout(() => performSearch(query, searchResults), 300);
            } else {
                searchResults.classList.add('d-none');
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.parentElement.contains(e.target)) {
                searchResults.classList.add('d-none');
            }
        });
    }
}

// Perform search function
function performSearch(query, resultsContainer) {
    // Mock search results - in a real application, this would be an API call
    const mockResults = [
        { name: 'Áo thun nam', category: 'Nam', price: '299.000đ', url: 'pages/product-detail.html' },
        { name: 'Váy nữ', category: 'Nữ', price: '450.000đ', url: 'pages/product-detail.html' },
        { name: 'Giày thể thao', category: 'Giày', price: '899.000đ', url: 'pages/product-detail.html' },
        { name: 'Túi xách', category: 'Phụ kiện', price: '650.000đ', url: 'pages/product-detail.html' }
    ];

    const filteredResults = mockResults.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    let html = '';
    if (filteredResults.length > 0) {
        filteredResults.forEach(item => {
            html += `
                <div class="search-result-item p-3 border-bottom">
                    <a href="${item.url}" class="text-decoration-none text-dark d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="fw-semibold">${item.name}</div>
                            <small class="text-muted">${item.category}</small>
                        </div>
                        <div class="text-primary fw-bold">${item.price}</div>
                    </a>
                </div>
            `;
        });
    } else {
        html = '<div class="p-3 text-center text-muted">Không tìm thấy sản phẩm nào</div>';
    }

    resultsContainer.innerHTML = html;
    resultsContainer.classList.remove('d-none');
}

// Cart functionality
function initializeCartFunctionality() {
    let cartItems = JSON.parse(localStorage.getItem('homestore_cart')) || [];
    updateCartBadge();

    // Add to cart function (global)
    window.addToCart = function(productId, productName, productPrice, productImage) {
        // Ensure price is a number
        const price = typeof productPrice === 'string' ? parseFloat(productPrice) : productPrice;
        
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: productId,
                name: productName,
                price: price,
                image: productImage || 'fas fa-shopping-bag',
                quantity: 1
            });
        }

        localStorage.setItem('homestore_cart', JSON.stringify(cartItems));
        updateCartBadge();
        showCartNotification(`Đã thêm "${productName}" vào giỏ hàng!`);
    };

    // Remove from cart function (global)
    window.removeFromCart = function(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('homestore_cart', JSON.stringify(cartItems));
        updateCartBadge();
    };

    // Update cart badge
    function updateCartBadge() {
        const cartBadge = document.querySelector('.badge');
        if (cartBadge) {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
        }
    }

    // Show cart notification
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification position-fixed bg-success text-white p-3 rounded shadow';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter .input-group');
    if (newsletterForm) {
        const button = newsletterForm.querySelector('button');
        button.addEventListener('click', function() {
            const email = newsletterForm.querySelector('input').value;
            if (validateEmail(email)) {
                showNotification('Cảm ơn bạn đã đăng ký!', 'success');
                newsletterForm.querySelector('input').value = '';
            } else {
                showNotification('Vui lòng nhập email hợp lệ!', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification position-fixed p-3 rounded text-white`;
    
    switch(type) {
        case 'success':
            notification.classList.add('bg-success');
            break;
        case 'error':
            notification.classList.add('bg-danger');
            break;
        default:
            notification.classList.add('bg-info');
    }

    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Format currency function (global)
window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Get cart items function (global)
window.getCartItems = function() {
    return JSON.parse(localStorage.getItem('homestore_cart')) || [];
};

// Clear cart function (global)
window.clearCart = function() {
    localStorage.removeItem('homestore_cart');
    const cartBadge = document.querySelector('.badge');
    if (cartBadge) {
        cartBadge.textContent = '0';
    }
};

// Loading animation
window.showLoading = function(element) {
    if (element) {
        const originalContent = element.innerHTML;
        element.innerHTML = '<span class="loading"></span> Đang tải...';
        element.disabled = true;
        return originalContent;
    }
};

window.hideLoading = function(element, originalContent) {
    if (element && originalContent) {
        element.innerHTML = originalContent;
        element.disabled = false;
    }
};

// CSS for additional animations and effects
const additionalStyles = `
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .cart-notification,
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .search-results {
        border-top: 3px solid var(--primary-color);
    }
    
    .search-result-item:hover {
        background-color: var(--light-color);
    }
    
    .search-result-item:last-child {
        border-bottom: none !important;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 