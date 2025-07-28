// Products Page JavaScript

const API_BASE_URL = 'http://localhost:8080/api';

let currentPage = 0;
let currentFilters = {
    search: '',
    categoryId: '',
    page: 0,
    size: 12
};

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.search = urlParams.get('search') || '';
    currentFilters.categoryId = urlParams.get('category') || '';
    
    loadCategories();
    loadProducts();
    initializeFilters();
    initializeSearch();
});

// Load categories for filter sidebar
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        displayCategoriesFilter(categories);
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products with current filters
async function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (!productsContainer) return;
    
    // Show loading
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    
    try {
        let url = `${API_BASE_URL}/products?page=${currentFilters.page}&size=${currentFilters.size}`;
        
        if (currentFilters.search) {
            url += `&search=${encodeURIComponent(currentFilters.search)}`;
        }
        
        if (currentFilters.categoryId) {
            url += `&categoryId=${currentFilters.categoryId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        displayProducts(products, productsContainer);
        updateResultsInfo(products.length);
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">Không thể tải sản phẩm</h4>
                <p class="text-muted">Vui lòng kiểm tra kết nối và thử lại.</p>
                <button class="btn btn-primary" onclick="loadProducts()">Thử lại</button>
            </div>
        `;
    } finally {
        // Hide loading
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Display products grid
function displayProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">Không tìm thấy sản phẩm nào</h4>
                <p class="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += createProductCard(product);
    });
    
    container.innerHTML = html;
    addProductEventListeners();
}

// Create product card HTML
function createProductCard(product) {
    const rating = 4.5;
    const reviews = Math.floor(Math.random() * 200) + 50;
    const stars = generateStarRating(rating);
    
    const productImage = 'fas fa-shopping-bag';
    const imageHtml = `<i class="${productImage}"></i>`;
    
    const categoryName = product.categoryNames && product.categoryNames.length > 0 ? 
        product.categoryNames[0] : '';

    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${imageHtml}
                    <div class="product-overlay">
                        <button class="btn btn-primary btn-sm add-to-cart" 
                                onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${productImage}')">
                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
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
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span class="rating-text">(${reviews})</span>
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
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHtml;
}

// Display categories in filter sidebar
function displayCategoriesFilter(categories) {
    const categoriesFilter = document.querySelector('.filter-group .form-check:first-of-type').parentElement;
    if (!categoriesFilter || !categories) return;
    
    let html = '<h6 class="filter-title">Danh Mục</h6>';
    
    categories.forEach(category => {
        const checked = currentFilters.categoryId === category.id ? 'checked' : '';
        html += `
            <div class="form-check">
                <input class="form-check-input category-filter" type="radio" 
                       name="categoryFilter" value="${category.id}" id="category${category.id}" ${checked}>
                <label class="form-check-label" for="category${category.id}">
                    ${category.name} (${category.productCount || 0})
                </label>
            </div>
        `;
    });
    
    // Add "All categories" option
    const allChecked = !currentFilters.categoryId ? 'checked' : '';
    html = `
        <h6 class="filter-title">Danh Mục</h6>
        <div class="form-check">
            <input class="form-check-input category-filter" type="radio" 
                   name="categoryFilter" value="" id="categoryAll" ${allChecked}>
            <label class="form-check-label" for="categoryAll">
                Tất cả danh mục
            </label>
        </div>
    ` + html;
    
    categoriesFilter.innerHTML = html;
}

// Initialize filters
function initializeFilters() {
    // Category filters
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('category-filter')) {
            currentFilters.categoryId = e.target.value;
            currentFilters.page = 0;
            loadProducts();
            updateURL();
        }
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Implement sorting logic here
            loadProducts();
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Set initial value from URL
        searchInput.value = currentFilters.search;
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Add search button if exists
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentFilters.search = searchInput.value.trim();
        currentFilters.page = 0;
        loadProducts();
        updateURL();
    }
}

// Update URL with current filters
function updateURL() {
    const url = new URL(window.location);
    
    if (currentFilters.search) {
        url.searchParams.set('search', currentFilters.search);
    } else {
        url.searchParams.delete('search');
    }
    
    if (currentFilters.categoryId) {
        url.searchParams.set('category', currentFilters.categoryId);
    } else {
        url.searchParams.delete('category');
    }
    
    window.history.pushState({}, '', url);
}

// Update results info
function updateResultsInfo(count) {
    const resultsInfo = document.getElementById('resultsInfo');
    if (resultsInfo) {
        resultsInfo.textContent = `Hiển thị ${count} sản phẩm`;
    }
}

// Add event listeners to product cards
function addProductEventListeners() {
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
    window.location.href = `product-detail.html?id=${productId}`;
}

// Add to cart function
async function addToCart(productId, productName, price, image) {
    try {
        // Fetch product details to get variants
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Không thể tải thông tin sản phẩm');
        }
        
        const product = await response.json();
        
        // Get first available variant
        const variant = product.variants && product.variants.length > 0 ? 
            product.variants.find(v => v.stock > 0) : null;
            
        if (!variant) {
            alert('Sản phẩm hiện không có phiên bản khả dụng');
            return;
        }
        
        const cartItem = {
            id: productId,
            name: productName,
            price: price + variant.additionalPrice,
            image: image,
            quantity: 1,
            basePrice: price,
            variantName: variant.name,
            variantSpecs: {
                size: variant.size || '',
                color: variant.color || '',
                material: variant.material || '',
                specifications: variant.specifications || ''
            },
            variantPrice: price + variant.additionalPrice,
            unitPrice: price + variant.additionalPrice,
            subtotal: price + variant.additionalPrice,
            thumbnailUrl: image
        };
        
        // Get existing cart items
        let cartItems = JSON.parse(localStorage.getItem('homestore_cart')) || [];
        
        // Check if product with same variant already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
            item.id === productId && 
            item.variantName === cartItem.variantName
        );
        
        if (existingItemIndex > -1) {
            // Check stock before updating quantity
            if (cartItems[existingItemIndex].quantity >= variant.stock) {
                alert('Số lượng trong kho không đủ');
                return;
            }
            // Update quantity if product exists
            cartItems[existingItemIndex].quantity += 1;
            cartItems[existingItemIndex].subtotal = cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
        } else {
            // Add new item if product doesn't exist
            cartItems.push(cartItem);
        }
        
        // Save updated cart
        localStorage.setItem('homestore_cart', JSON.stringify(cartItems));
        
        // Update cart badge
        updateCartBadge();
        
        // Show notification
        showCartNotification(`Đã thêm "${productName} - ${variant.name}" vào giỏ hàng!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
}

// Add to wishlist function
function addToWishlist(productId) {
    console.log('Added to wishlist:', productId);
    alert('Đã thêm vào danh sách yêu thích!');
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