// Array of product objects - making it globally accessible with window.products
window.products = [
  {
    name: "Carton of Cherries",
    price: 4,
    quantity: 0,
    productId: 100,
    image: "./images/cherry.jpg"
  },
  {
    name: "Carton of Strawberries",
    price: 5,
    quantity: 0,
    productId: 101,
    image: "./images/strawberry.jpg"
  },
  {
    name: "Bag of Oranges",
    price: 10,
    quantity: 0,
    productId: 102,
    image: "./images/orange.jpg"
  }
];

// Empty array to hold cart items
window.cart = [];

// Currency rates (relative to USD)
let currencyRates = {
  USD: 1,
  EUR: 0.85,
  YEN: 110.53
};

let currentCurrency = 'USD';

/**
 * Add a product to the cart
 */
function addProductToCart(productId) {
  let product = products.find(item => item.productId === productId);
  let cartItem = cart.find(item => item.productId === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
}

/**
 * Increase product quantity in the cart
 */
function increaseQuantity(productId) {
  let cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity++;
  }
}

/**
 * Decrease product quantity or remove from cart if it reaches 0
 */
function decreaseQuantity(productId) {
  let cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      removeProductFromCart(productId);
    }
  }
}

/**
 * Remove product from cart
 */
function removeProductFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
}

/**
 * Calculate the total cost of products in the cart in the current currency
 */
function cartTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  return convertCurrency(total);
}

/**
 * Convert cart total to the selected currency
 */
function convertCurrency(amount) {
  return (amount * currencyRates[currentCurrency]).toFixed(2);
}

/**
 * Empty the cart
 */
function emptyCart() {
  cart = [];
}

/**
 * Pay the required amount
 */
let totalPaid = 0;

function pay(amount) {
  totalPaid += amount;
  let totalCost = cartTotal();
  let difference = totalPaid - totalCost;

  if (difference >= 0) {
    totalPaid = 0;
  }
  return difference;
}

/**
 * Set the currency for the store and recalculate product prices
 */
function currency(currencyCode) {
  currentCurrency = currencyCode;
}
