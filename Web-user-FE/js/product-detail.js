// Product Detail Page JavaScript

const API_BASE_URL = 'http://localhost:8080/api';

let currentProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetail(productId);
    } else {
        showError('Không tìm thấy ID sản phẩm');
    }
    
    initializeQuantityControls();
    initializeActionButtons();
});

// Load product detail from API
async function loadProductDetail(productId) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productDetailContent = document.getElementById('productDetailContent');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Sản phẩm không tìm thấy');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const product = await response.json();
        currentProduct = product;
        
        displayProductDetail(product);
        
        // Hide loading and show content
        loadingSpinner.style.display = 'none';
        productDetailContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading product detail:', error);
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
        showError(error.message);
    }
}

// Display product detail
function displayProductDetail(product) {
    currentProduct = product;
    
    // Update breadcrumb
    updateBreadcrumb(product);
    
    // Update page title
    document.title = `${product.name} - HomeStore`;
    
    // Update product category
    const categoryElement = document.getElementById('productCategory');
    if (product.categoryNames && product.categoryNames.length > 0) {
        categoryElement.textContent = product.categoryNames[0];
        categoryElement.style.display = 'inline-block';
    } else {
        categoryElement.style.display = 'none';
    }
    
    // Display product tags
    const tagsContainer = document.getElementById('productTags');
    if (product.tags && product.tags.length > 0) {
        const tagsHtml = product.tags
            .filter(tag => tag.active)
            .map(tag => `
                <span class="badge me-2" style="background-color: ${tag.color}">
                    ${tag.value}
                </span>
            `).join('');
        tagsContainer.innerHTML = tagsHtml;
    } else {
        tagsContainer.style.display = 'none';
    }
    
    // Update product title
    document.getElementById('productTitle').textContent = product.name;
    
    // Update SKU
    document.getElementById('productSku').textContent = product.sku;
    
    // Update product rating
    displayProductRating();
    
    // Update product price
    document.getElementById('productPrice').textContent = formatCurrency(product.price);
    document.getElementById('priceNote').textContent = '(Giá từ)';
    
    // Update product description
    const descriptionElement = document.getElementById('productDescription');
    descriptionElement.textContent = product.description || 'Thông tin chi tiết sản phẩm đang được cập nhật...';
    
    // Update product image
    const productImageContainer = document.querySelector('.product-image');
    if (product.imageId) {
        productImageContainer.innerHTML = `<img src="${API_BASE_URL}/images/${product.imageId}" alt="${product.name}" class="img-fluid">`;
    } else {
        productImageContainer.innerHTML = `<i class="fas fa-shopping-bag"></i>`;
    }
    
    // Update variant selection
    const variantContainer = document.getElementById('variantContainer');
    if (product.variants && product.variants.length > 0) {
        let html = '<div class="mb-3">';
        html += '<label class="form-label">Chọn phiên bản:</label>';
        html += '<select class="form-select" id="variantSelect" required>';
        html += '<option value="">Chọn phiên bản</option>';
        
        // Sort variants by price
        const sortedVariants = [...product.variants]
            .filter(v => v.active)
            .sort((a, b) => (product.price + a.additionalPrice) - (product.price + b.additionalPrice));
        
        sortedVariants.forEach(variant => {
            const variantPrice = product.price + variant.additionalPrice;
            const isOutOfStock = variant.stock <= 0;
            
            html += `
                <option value="${variant.name}" 
                        data-price="${variantPrice}"
                        data-stock="${variant.stock}"
                        data-color="${variant.color}"
                        data-size="${variant.size}"
                        data-material="${variant.material}"
                        data-specs="${variant.specifications}"
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${variant.name} - ${formatCurrency(variantPrice)}
                    ${isOutOfStock ? ' (Hết hàng)' : ` (Còn ${variant.stock} sản phẩm)`}
                </option>
            `;
        });
        
        html += '</select>';
        html += '</div>';
        
        variantContainer.innerHTML = html;
        
        // Add event listener for variant change
        const variantSelect = document.getElementById('variantSelect');
        variantSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const stock = selectedOption.getAttribute('data-stock');
            
            // Update price
            document.getElementById('productPrice').textContent = formatCurrency(price);
            document.getElementById('priceNote').textContent = ''; // Remove "Giá từ" note
            
            // Update stock status
            updateStockStatus(product, this.value);
            
            // Update variant details
            document.getElementById('variantColor').textContent = selectedOption.getAttribute('data-color') || '-';
            document.getElementById('variantSize').textContent = selectedOption.getAttribute('data-size') || '-';
            document.getElementById('variantMaterial').textContent = selectedOption.getAttribute('data-material') || '-';
            document.getElementById('variantSpecs').textContent = selectedOption.getAttribute('data-specs') || '-';
            
            // Update quantity max
            const quantityInput = document.getElementById('quantity');
            if (quantityInput) {
                quantityInput.max = stock;
                if (parseInt(quantityInput.value) > parseInt(stock)) {
                    quantityInput.value = stock;
                }
            }
        });
    } else {
        variantContainer.innerHTML = '<div class="alert alert-warning">Sản phẩm này hiện không có phiên bản nào khả dụng</div>';
    }
    
    // Update stock status
    updateStockStatus(product);
}

// Update breadcrumb
function updateBreadcrumb(product) {
    const breadcrumbContainer = document.getElementById('breadcrumbContainer');
    const productNameBreadcrumb = document.getElementById('productNameBreadcrumb');
    
    // Clear existing breadcrumbs except Home and Products
    while (breadcrumbContainer.children.length > 2) {
        breadcrumbContainer.removeChild(breadcrumbContainer.lastChild);
    }
    
    // Add category breadcrumb if available
    if (product.categoryNames && product.categoryNames.length > 0) {
        const categoryBreadcrumb = document.createElement('li');
        categoryBreadcrumb.className = 'breadcrumb-item';
        categoryBreadcrumb.innerHTML = `<a href="products.html?category=${product.categoryIds[0]}">${product.categoryNames[0]}</a>`;
        breadcrumbContainer.appendChild(categoryBreadcrumb);
    }
    
    // Add product name breadcrumb
    const newProductBreadcrumb = document.createElement('li');
    newProductBreadcrumb.className = 'breadcrumb-item active';
    newProductBreadcrumb.setAttribute('aria-current', 'page');
    newProductBreadcrumb.textContent = product.name;
    breadcrumbContainer.appendChild(newProductBreadcrumb);
}

// Display product rating
function displayProductRating() {
    const ratingContainer = document.getElementById('productRating');
    const rating = 4.5; // Mock rating
    const reviews = Math.floor(Math.random() * 200) + 50;
    
    const stars = generateStarRating(rating);
    ratingContainer.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="stars me-2">${stars}</div>
            <span class="rating-score me-2">(${rating})</span>
            <span class="reviews-count text-muted">${reviews} đánh giá</span>
        </div>
    `;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHtml;
}

// Update stock status
function updateStockStatus(product, variantName = null) {
    const stockStatus = document.getElementById('stockStatus');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (!stockStatus || !addToCartBtn) return;
    
    let variant = null;
    if (variantName) {
        variant = product.variants.find(v => v.name === variantName);
    } else if (product.variants && product.variants.length > 0) {
        variant = product.variants[0];
    }
    
    if (!variant || variant.stock <= 0) {
        stockStatus.innerHTML = '<span class="text-danger">Hết hàng</span>';
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Hết hàng';
    } else {
        stockStatus.innerHTML = `<span class="text-success">Còn ${variant.stock} sản phẩm</span>`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Thêm vào giỏ';
    }
}

// Initialize quantity controls
function initializeQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            const maxValue = parseInt(quantityInput.max) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const min = parseInt(this.min) || 1;
            const max = parseInt(this.max) || 10;
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
}

// Initialize action buttons
function initializeActionButtons() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
    
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            addToWishlist();
        });
    }
}

// Add to cart function
function addToCart() {
    if (!currentProduct) return;
    
    // Get selected variant
    const variantSelect = document.getElementById('variantSelect');
    if (variantSelect && !variantSelect.value) {
        alert('Vui lòng chọn phiên bản sản phẩm');
        return;
    }
    
    const selectedVariant = variantSelect ? 
        currentProduct.variants.find(v => v.name === variantSelect.value) : 
        currentProduct.variants[0];
    
    if (!selectedVariant) {
        alert('Phiên bản sản phẩm không hợp lệ');
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Check stock
    if (selectedVariant.stock < quantity) {
        alert('Số lượng trong kho không đủ');
        return;
    }
    
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price + selectedVariant.additionalPrice,
        image: currentProduct.imageId || 'fas fa-shopping-bag',
        quantity: quantity,
        basePrice: currentProduct.price,
        variantName: selectedVariant.name,
        variantSpecs: {
            size: selectedVariant.size || '',
            color: selectedVariant.color || '',
            material: selectedVariant.material || '',
            specifications: selectedVariant.specifications || ''
        },
        variantPrice: currentProduct.price + selectedVariant.additionalPrice,
        unitPrice: currentProduct.price + selectedVariant.additionalPrice,
        subtotal: (currentProduct.price + selectedVariant.additionalPrice) * quantity,
        thumbnailUrl: currentProduct.imageId || 'fas fa-shopping-bag'
    };
    
    // Get existing cart items
    let cartItems = JSON.parse(localStorage.getItem('homestore_cart')) || [];
    
    // Check if product with same variant already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
        item.id === currentProduct.id && 
        item.variantName === cartItem.variantName
    );
    
    if (existingItemIndex > -1) {
        // Update quantity if product exists
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].subtotal = cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
    } else {
        // Add new item if product doesn't exist
        cartItems.push(cartItem);
    }
    
    // Save updated cart
    localStorage.setItem('homestore_cart', JSON.stringify(cartItems));
    
    // Update cart badge
    updateCartBadge();
    
    // Show success message
    alert(`Đã thêm ${quantity} "${currentProduct.name} - ${selectedVariant.name}" vào giỏ hàng!`);
}

// Add to wishlist function
function addToWishlist() {
    // Implement wishlist functionality here
    alert('Tính năng này đang được phát triển!');
}

// Update cart badge
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('homestore_cart')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorTitle = errorMessage.querySelector('h4');
    const errorDescription = errorMessage.querySelector('p');
    
    if (message === 'Sản phẩm không tìm thấy') {
        errorTitle.textContent = 'Không tìm thấy sản phẩm';
        errorDescription.textContent = 'Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.';
    } else {
        errorTitle.textContent = 'Lỗi tải sản phẩm';
        errorDescription.textContent = message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
    }
    
    errorMessage.style.display = 'block';
}

// Go back to products page
function goBackToProducts() {
    window.history.back();
}

// Global functions for potential external use
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.goBackToProducts = goBackToProducts; 