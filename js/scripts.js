const filtersElement = document.getElementById('filters');
const galleryElement = document.getElementById('gallery');
const cartProductsElement = document.getElementById('cart-products');
const cartImageElement = document.getElementById('cart-image');
const cartQuantityElement = document.getElementById('cart-quantity');
const totalOrderContainerElement = document.getElementById('total-order-container');
const totalOrderElement = document.getElementById('total-order');

let cartContent = [];

const updateTotalOrderInDOM = () => {
  const totalOrder = cartContent.reduce((acc, product) => product.price * product.quantity + acc, 0);
  totalOrderElement.textContent = '$' + totalOrder.toFixed(2);
};

const updateProductsQuantityInDOM = () => {
  const totalQuantity = cartContent.reduce((acc, product) => product.quantity + acc, 0);
  cartQuantityElement.textContent = totalQuantity;
  updateTotalOrderInDOM();
};

const updateCartInDOM = () => {
  const fragment = document.createDocumentFragment();
  if (cartContent.length === 0) {
    cartImageElement.classList.remove('hide');
    totalOrderContainerElement.classList.add('hide');
  } else {
    cartImageElement.classList.add('hide');
    totalOrderContainerElement.classList.remove('hide');
  }

  cartContent.forEach(product => {
    const newCartProduct = document.createElement('div');
    newCartProduct.classList.add('cart-product');

    const newCartProductName = document.createElement('p');
    newCartProduct.classList.add('cart-product-name');
    newCartProductName.textContent = product.name;

    newCartProduct.append(newCartProductName);

    const newCartProductInfo = document.createElement('div');
    newCartProductInfo.classList.add('cart-product-info');

    const newCartProductQuantity = document.createElement('span');
    newCartProductQuantity.classList.add('cart-product-quantity');
    newCartProductQuantity.textContent = product.quantity + 'x';

    const newCartProductPriceSingle = document.createElement('span');
    newCartProductPriceSingle.classList.add('cart-product-price-single');
    newCartProductPriceSingle.textContent = '@' + product.price;

    const newCartProductPriceTotal = document.createElement('span');
    newCartProductPriceTotal.classList.add('cart-product-price-total');
    const totalPrice = product.price * product.quantity;
    newCartProductPriceTotal.textContent = '$' + totalPrice.toFixed(2);

    const newCartProductIconRemove = document.createElement('img');
    newCartProductIconRemove.classList.add('cart-product-icon-remove');
    newCartProductIconRemove.src = './assets/images/icon-remove-item.svg';

    newCartProductIconRemove.addEventListener('click', () => removeProductFromCart(product.name));

    newCartProductInfo.append(
      newCartProductQuantity,
      newCartProductPriceSingle,
      newCartProductPriceTotal,
      newCartProductIconRemove
    );

    newCartProduct.append(newCartProductInfo);

    fragment.append(newCartProduct);
  });

  console.log(cartContent);

  cartProductsElement.textContent = '';
  cartProductsElement.append(fragment);
  updateProductsQuantityInDOM();
};

const addProductToCart = (name, price) => {
  cartContent.push({ name: name, price: price, quantity: 1 });
  updateCartInDOM();
};

const incrementProductQuantity = (name, element) => {
  const productSelected = cartContent.find(product => product.name === name);
  productSelected.quantity++;
  element.textContent = productSelected.quantity;
  updateCartInDOM();
};

const setRemoveProductEffect = element => {
  const productContainer = element.parentElement.parentElement;
  element.classList.remove('show-button');
  productContainer.classList.remove('product-image-container-selected');
};

const removeProductFromCart = (name, element) => {
  cartContent = cartContent.filter(product => product.name !== name);
  const productButtons = document.querySelectorAll(`[data-name="${name}"]`);
  productButtons[1].classList.remove('show-button');
  productButtons[1].parentElement.parentElement.classList.remove('product-image-container-selected');
  productButtons[1].children[1].textContent = 1;
  updateCartInDOM();
  if (!element) return;

  setRemoveProductEffect(element);
};

const decrementProductQuantity = (name, element) => {
  const productSelected = cartContent.find(product => product.name === name);

  if (productSelected.quantity === 1) {
    removeProductFromCart(name, element);
  } else {
    productSelected.quantity--;
    element.textContent = productSelected.quantity;
  }

  updateCartInDOM();
};

const setAddProductEffect = element => {
  const buttonQuantity = element.nextElementSibling;
  const productContainer = element.parentElement.parentElement;
  buttonQuantity.classList.add('show-button');
  productContainer.classList.add('product-image-container-selected');
  addProductToCart(element.dataset.name, element.dataset.price);
};

const handleGalleryClick = event => {
  const type = event.target.dataset.type;

  if (!type) return;

  if (type === 'add') {
    setAddProductEffect(event.target);
    return;
  }

  const name = event.target.parentElement.dataset.name;

  if (type === 'increment') {
    incrementProductQuantity(name, event.target.previousElementSibling);
  } else if (type === 'decrement') {
    decrementProductQuantity(name, event.target.nextElementSibling);
  }
};

const setFilters = event => {
  const filter = event.target.dataset.filter;

  if (!filter) return;

  for (const filter of filtersElement.children) {
    filter.classList.remove('filter-active');
  }

  event.target.classList.add('filter-active');
};

filtersElement.addEventListener('click', setFilters);
galleryElement.addEventListener('click', handleGalleryClick);
