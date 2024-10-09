let currencySymbol = '$';

// Draws product list
function drawProducts() {
    let productList = document.querySelector('.products');
    let productItems = '';
    products.forEach((element) => {
        productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}' alt='${element.name}'>
                <h3>${element.name}</h3>
                <p>Price: ${currencySymbol}${convertCurrency(element.price)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
    // use innerHTML so that products are only drawn once
    productList.innerHTML = productItems;
}

// Draws cart
function drawCart() {
    let cartList = document.querySelector('.cart');
    let cartItems = '';
    cart.forEach((element) => {
        let itemTotal = element.price * element.quantity;

        cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>Price: ${currencySymbol}${convertCurrency(element.price)}</p>
                <p>Quantity: ${element.quantity}</p>
                <p>Total: ${currencySymbol}${convertCurrency(itemTotal)}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">Remove</button>
            </div>
        `;
    });
    cart.length
        ? (cartList.innerHTML = cartItems)
        : (cartList.innerHTML = 'Cart Empty');
}

// Draws checkout
function drawCheckout() {
    let checkout = document.querySelector('.cart-total');
    checkout.innerHTML = '';

    let cartSum = cartTotal(); // run cartTotal() from script.js

    let div = document.createElement('div');
    div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum}</p>`;
    checkout.append(div);
}

// Initialize store with products, cart, and checkout
document.addEventListener('DOMContentLoaded', function() {
    drawProducts();
    drawCart();
    drawCheckout();
});

document.querySelector('.products').addEventListener('click', (e) => {
    let productId = e.target.parentNode.getAttribute('data-productId');
    productId *= 1;
    addProductToCart(productId);

    // Clear the previous receipt because the cart has changed
    clearReceipt();

    drawCart();
    drawCheckout();
});

// Event delegation used to support dynamically added cart items
document.querySelector('.cart').addEventListener('click', (e) => {
    function runCartFunction(fn) {
        let productId = e.target.parentNode.getAttribute('data-productId');
        productId *= 1;
        for (let i = cart.length - 1; i > -1; i--) {
            if (cart[i].productId === productId) {
                fn(productId);
            }
        }
        drawCart();
        drawCheckout();
    }

    if (e.target.classList.contains('remove')) {
        runCartFunction(removeProductFromCart);
    } else if (e.target.classList.contains('qup')) {
        runCartFunction(increaseQuantity);
    } else if (e.target.classList.contains('qdown')) {
        runCartFunction(decreaseQuantity);
    }
});

// Payment functionality - updated to prevent submission if cart is empty and show success animation
document.querySelector('.pay').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission refresh

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before paying.');
        return;
    }

    let amount = parseFloat(document.querySelector('.received').value); // Get cash input
    let cashReturn = pay(amount); // Calculate based on total amount due

    // Clear previous receipts
    clearReceipt();

    let paymentSummary = document.querySelector('.pay-summary');
    let div = document.createElement('div');

    // Correct calculation for receipt output
    if (cashReturn === 0) {
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount.toFixed(2)}</p>
            <p>Thank you!</p>
        `;
    } else if (cashReturn > 0) {
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount.toFixed(2)}</p>
            <p>Cash Returned: ${currencySymbol}${cashReturn.toFixed(2)}</p>
            <p>Thank you!</p>
        `;
    } else {
        // Handle the case where the balance is still due
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount.toFixed(2)}</p>
            <p>Remaining Balance: ${currencySymbol}${cashReturn.toFixed(2)}</p>
            <p>Please pay the remaining amount.</p>
        `;
    }

    paymentSummary.append(div);
});

// Clear receipt when the cart is updated
function clearReceipt() {
  document.querySelector('.pay-summary').innerHTML = '';
}

// Function to show a green circular animation on payment success
function startPaymentSuccessAnimation() {
  let overlay = document.createElement('div');
  overlay.className = 'payment-success-overlay';
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove(); // Remove the overlay after 2 seconds
  }, 2000);
}

// Currency converter
function currencyBuilder() {
    let currencyPicker = document.querySelector('.currency-selector');
    let select = document.createElement('select');
    select.classList.add('currency-select');
    select.innerHTML = `
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="YEN">YEN</option>
    `;
    currencyPicker.append(select);
}
currencyBuilder();

document.querySelector('.currency-select').addEventListener('change', function handleChange(event) {
    switch (event.target.value) {
        case 'EUR':
            currencySymbol = '€';
            break;
        case 'YEN':
            currencySymbol = '¥';
            break;
        default:
            currencySymbol = '$';
            break;
    }
    currency(event.target.value);
    drawProducts();
    drawCart();
    drawCheckout();
});
