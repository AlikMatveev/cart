const coffeesContainer = document.querySelector('.coffees-container');
const cartElem = document.querySelector('.cart__elem');
const modal = new Modal({maxWidth: '600px'});

const func = (function(){
  return cart = {
    cart: (localStorage.cart!=undefined)?JSON.parse(localStorage.cart):{},
    addToCart({id, name, img, price}){
      if(this.cart[id] == undefined) {
        this.cart[id] = {id, name, img, price};
        this.cart[id].count = 1;
      }
      else{
        ++this.cart[id].count;
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    allSum(){
      return (Object.values(this.cart).map(el => el.count * el.price)).reduce((a,b) => a+b);
    },
    allCount(){
      return (Object.values(this.cart).map(el => el.count)).reduce((a,b) => a+b)
    }
  }
})();

fetch('products.json')
.then (json => json.json())
.then (data => {
  data.forEach(({id, name, img, price}) => {
    coffeesContainer.insertAdjacentHTML('beforeend', 
    `<div data-id="${id}" class="coffee">
      <img class="coffee__img"src=${img}>
      <div class="coffee__block">
        <h3 class="coffee__name">${name}</h3>
        <h3 class="coffee__price">${price} դրամ</h3>
        <button class="btn">Купить!</button>
        </div>
    </div>`)
  })
}).catch(alert);

coffeesContainer.addEventListener('click', (e) => {
  if(!e.target.classList.contains('btn')) return null;

  const elem = e.target.closest('.coffee');
  cart.addToCart({
    id: elem.dataset.id,
    name: elem.querySelector('.coffee__name').textContent,
    img: elem.querySelector('.coffee__img').src,
    price: parseFloat(elem.querySelector('.coffee__price').textContent)
  });
  openCart();
});

const openCart = () => {
  modal.open();
  if(Object.values(cart.cart).length == 0){
    return modal.setContent('<div class="cart">Товаров нет</div>');
  }

  modal.setContent('');
  Object.values(cart.cart).forEach(({id, name, img, price, count}) => {
  modal.insertAdjacentHTML('beforeend', 
    `<div data-id="${id}" class="cart__coffee">
      <img class="cart__coffee-img"src=${img}>
      <h3 class="cart__coffee-item">${name}</h3>
      <h3 class="cart__coffee-item">${price}</h3>
      <h3 class="cart__coffee-item">${count}</h3>
      <p class="cart__coffee-item remove">&#10006</p>
    </div>`);
  });

  modal.insertAdjacentHTML('beforeend', 
  `<div class="info">
    <p class="info__sum">Общяя сумма: ${cart.allSum()},</p>
    <p class="info__count">Количество: ${cart.allCount()}</p>
  <button class="btn buy">Оформить</button>
  </div>`);

  document.querySelector('.buy').addEventListener('click', () => {
    modal.setContent(
    `<form class="buy-form">
      <input type="text" name="name" placeholder="Имя:" required>
      <input type="text" name="surname" placeholder="Фамилия:" required>
      <input type="text" name="address" placeholder="Адрес:" required>
      <button type="submit" class="btn" id="submit-buy">Оформить!</button>
    </form>`);

      document.querySelector('.buy-form').onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("products", JSON.stringify(cart));

        fetch("post.php", {
          method: "POST",
          body: formData
        }).then(function (res) {
          modal.setContent(`<div class="cart">Ваш заказ получен!!!</div>`);
          localStorage.clear();
          cart.cart = {};
      }).catch(alert);
    }
  });
}

cartElem.addEventListener('click', () => openCart());