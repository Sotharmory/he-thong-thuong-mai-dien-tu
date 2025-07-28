// Home Page Specific JavaScript

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadFeaturedProducts();
    initializeHeroCarousel();
    initializeCategoryAnimations();
});

// Load categories from API
async function loadCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        displayCategories(categories, categoriesContainer);
        
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">Không thể tải danh mục</h4>
                <p class="text-muted">Vui lòng kiểm tra kết nối backend.</p>
                <button class="btn btn-primary" onclick="loadCategories()">Thử lại</button>
            </div>
        `;
    }
}

// Load featured products for the homepage
async function loadFeaturedProducts() {
    const productsByCategoryContainer = document.getElementById('productsByCategoryContainer');
    if (!productsByCategoryContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products?page=0&size=8`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        if (products && products.length > 0) {
            displayFeaturedProducts(products, productsByCategoryContainer);
        } else {
            productsByCategoryContainer.innerHTML = `
                <div class="col-12 text-center">
                    <h4 class="text-muted">Chưa có sản phẩm nào để hiển thị</h4>
                    <p class="text-muted">Vui lòng thêm sản phẩm vào hệ thống.</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        productsByCategoryContainer.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">Không thể tải sản phẩm</h4>
                <p class="text-muted">Vui lòng kiểm tra kết nối và thử lại.</p>
                <button class="btn btn-primary" onclick="loadFeaturedProducts()">Thử lại</button>
            </div>
        `;
    }
}

// Display featured products
function displayFeaturedProducts(products, container) {
    let html = '<div class="row g-4">';
    
    products.forEach(product => {
        html += createProductCard(product);
    });
    
    html += '</div>';
    container.innerHTML = html;
    addProductEventListeners();
}

// Create product card HTML
function createProductCard(product) {
    // Generate random rating for display
    const rating = 4.5;
    const reviews = Math.floor(Math.random() * 200) + 50;
    const stars = generateStarRating(rating);
    
    // Get product image or use default icon
    const imageUrl = product.imageId ? `${API_BASE_URL}/images/${product.imageId}` : null;
    const imageHtml = imageUrl ? 
        `<img src="${imageUrl}" alt="${product.name}" class="product-img">` : 
        `<i class="fas fa-shopping-bag"></i>`;

    // Get first category name for display
    const categoryName = product.categoryNames && product.categoryNames.length > 0 ? 
        product.categoryNames[0] : '';

    // Get first available variant
    const firstVariant = product.variants && product.variants.length > 0 ? 
        product.variants.find(v => v.stock > 0) : null;

    // Check if product is out of stock
    const isOutOfStock = !firstVariant || firstVariant.stock <= 0;
    const badgeHtml = isOutOfStock ? 
        '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Hết hàng</span>' : '';

    return `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                ${badgeHtml}
                <div class="product-image">
                    ${imageHtml}
                    <div class="product-overlay">
                        ${!isOutOfStock ? `
                            <button class="btn btn-primary btn-sm add-to-cart" 
                                    onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.imageId || ''}')">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-primary btn-sm add-to-wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm quick-view" 
                                onclick="viewProductDetail('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h6>${product.name}</h6>
                    <div class="product-price">
                        ${formatCurrency(product.price)}
                        ${firstVariant && firstVariant.additionalPrice > 0 ? 
                            `<small class="text-muted">Từ</small>` : ''}
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span class="rating-text">(${reviews} đánh giá)</span>
                    </div>
                    ${categoryName ? `<div class="product-category text-muted small">${categoryName}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHtml;
}

// Add event listeners to product cards
function addProductEventListeners() {
    // Add to wishlist
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            addToWishlist(productId);
        });
    });
}

// View product detail
function viewProductDetail(productId) {
    window.location.href = `pages/product-detail.html?id=${productId}`;
}

// Add to cart function
function addToCart(productId, productName, price, image) {
    // Implement cart functionality
    console.log('Added to cart:', { productId, productName, price, image });
    
    // Show notification
    alert(`Đã thêm "${productName}" vào giỏ hàng!`);
}

// Add to wishlist function
function addToWishlist(productId) {
    // Implement wishlist functionality
    console.log('Added to wishlist:', productId);
    
    // Show notification
    alert('Đã thêm vào danh sách yêu thích!');
}

// Initialize hero carousel
function initializeHeroCarousel() {
    const carousel = document.querySelector('#heroCarousel');
    if (carousel) {
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const carouselInstance = bootstrap.Carousel.getInstance(carousel);
            if (startX > endX + 50) {
                carouselInstance.next();
            } else if (startX < endX - 50) {
                carouselInstance.prev();
            }
        }
    }
}

// Initialize category animations
function initializeCategoryAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Format currency
function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Display categories
function displayCategories(categories, container) {
    if (!categories || categories.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">Không có danh mục nào</h4>
                <p class="text-muted">Vui lòng thêm danh mục vào hệ thống.</p>
            </div>
        `;
        return;
    }

    let html = '';
    categories.forEach(category => {
        html += `
            <div class="col-lg-3 col-md-6">
                <div class="category-card text-center" onclick="goToCategory('${category.id}')">
                    <div class="category-icon mb-3">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h5>${category.name}</h5>
                    <p class="text-muted">${category.description || ''}</p>
                    <span class="category-count">${category.productCount || 0} sản phẩm</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Go to category page
function goToCategory(categoryId) {
    window.location.href = `pages/products.html?category=${categoryId}`;
}

// Export functions for global use
window.loadCategories = loadCategories;
window.loadFeaturedProducts = loadFeaturedProducts;
window.addToWishlist = addToWishlist; 