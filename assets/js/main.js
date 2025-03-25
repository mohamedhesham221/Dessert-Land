// Function to fetch and render products
const getProducts = async () => {
  try {
    // Fetch product data from a JSON file
    const response = await fetch('./assets/products.json');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const menu = document.getElementById('menu');
    const filters = document.querySelectorAll('#filter input');
    // Cart and counter states
    let cart = []
    const counters = {}
    let finalOrder = []
    /**
 * Renders the product list in the menu section
 * @param {Array} products - Array of product objects
 */
    const renderProducts = (products) => {
      menu.innerHTML = products.map(item => `
            <div class="shadow-sm card w-96 md:w-5/12 flex-grow">
          <figure>
            <img src="${item.image}" alt="${item.name}" class="object-cover" style="height: 255px; width: 100%"; />
          </figure>
          <div class="text-center border card-body border-Pale-Green font-DM">
            <p class="text-2xl font-bold text-Deep-Red">${item.price}</p>
            <p class="text-Dark-Gray text-lg">${item.category}</p>
            <h2 class="block text-base font-bold card-title text-Dark-Olive-Green">${item.name}</h2>
            <div class="flex justify-between items-center card-actions border border-Deep-Red rounded">

              <button class="bg-transparent drop-shadow-none btn btn-primary text-Dark-Olive-Green border-0 shadow-none decrease" data-id="${item.id}">-</button>


                <span class="text-Dark-Olive-Green font-medium" id="counter-${item.id}">0</span>


              <button class=" bg-transparent border-0 shadow-none btn btn-primary text-Dark-Olive-Green increase" data-id="${item.id}">
                +
                </button>
            </div>
          </div>
        </div>
`).join('')

      // Event listeners for increasing product quantity
      document.querySelectorAll(".increase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id)
          if (!id) return;
          // Increase product counter
          counters[id] = (counters[id] || 0) + 1;
          document.getElementById(`counter-${id}`).innerText = counters[id];

          // Add product to cart or update quantity
          if (!cart.some(item => item.product.id === id)) {
            cart.push({
              product: products.find(p => p.id == id),
              quantity: 1,
            });
            renderCartItems(cart)
            cartCounter(cart.length)
            counterIcon(cart.length)
          } else {
            const exicitingItem = cart.find(item => item.product.id === id)
            if (exicitingItem) {
              cart = cart.map((cartItem) => cartItem.product.id === id ? { ...cartItem, quantity: counters[id] } : cartItem)
            }
            renderCartItems(cart)
            cartCounter(cart.length)
            counterIcon(cart.length)
          }
        })
      })
      // Event listeners for decreasing product quantity
      document.querySelectorAll(".decrease").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id)
          if (!id) return;
          // Update cart quantity or remove item if quantity is zero
          if (counters[id] > 0) {
            counters[id] = (counters[id] || 0) - 1
            document.getElementById(`counter-${id}`).innerText = counters[id]
            const exicitingItem = cart.find(item => item.product.id === id)
            if (exicitingItem) {
              cart = cart.map((cartItem) => cartItem.product.id === id ? { ...cartItem, quantity: counters[id] } : cartItem)
              renderCartItems(cart)
              cartCounter(cart.length)
              counterIcon(cart.length)
            }
          }
          if (counters[id] === 0) {
            const exicitingItem = cart.find(item => item.product.id === id)
            const index = cart.indexOf(exicitingItem)
            if (exicitingItem) {
              cart.splice(index, 1)
            }
            renderCartItems(cart)
            cartCounter(cart.length)
            counterIcon(cart.length)
          }
        })
      })

    }
    // Function to update the cart counter
    function cartCounter(count) {
      const cartCounter = document.getElementById('cart-items')
      cartCounter.innerText = count
    }
    // Function to update the cart ICON counter
    function counterIcon(count) {
      const iconCounts = document.getElementById("cart-icon-counter")
      iconCounts.innerText = count
      console.log(iconCounts);
    }

    // Select cart container
    const cartItems = document.getElementById('cart');

    function renderCartItems(products) {
      if (!products.length) {
        cartCounter.innerText = products.length
        return cartItems.innerHTML = `
        <img src="./assets/img/illustration-empty-cart.svg" alt="Cart illustration" style="width: 150px; margin: auto;"/>
        <p class="font-medium text-Dark-Olive-Green text-center">You added items will appear here</p>
        `
      }
      // Calculate total price of the cart
      const totalPrice = products.reduce((acc, curr, index) => {
        return acc + parseFloat(curr.product.price) * curr.quantity
      }, 0)

      // Render cart items dynamically
      cartItems.innerHTML = products.map((item) => `
                  <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-Dark-Olive-Green md:text-2xl">${item.product.name}</p>
                <p class="flex items-center gap-2 md:text-xl">
                  <span class="font-bold text-Deep-Red">&times;${item.quantity}</span>
                  <span class="text-Dark-Olive-Green">@${item.product.price}</span>
                  <span class="text-Dark-Olive-Green">EGP ${item.quantity * item.product.price}</span>
                </p>
              </div>
              <button class="p-1 rounded-full w-fit bg-Deep-Red remove-element" 
              data-id= "${item.product.id}">
                <img src="./assets/img/icon-remove-item.svg" alt="Remove icon" style="filter: brightness(2); width:20px;">
              </button>
            </div>
            <div class="m-0 divider after:bg-Pale-Green before:bg-Pale-Green"></div>
            
      `).join('') + `<p class="flex items-center justify-between">
              <span class="text-2xl font-medium text-Dark-Olive-Green md:text-3xl">Order total</span>
              <span class="text-xl font-medium text-Dark-Olive-Green md:text-2xl">EGP ${totalPrice.toFixed(2)}</span>
            </p>
            <div class="flex flex-row items-center justify-start gap-3 px-5 md:p-6 font-medium rounded-lg text-Olive-Gray bg-Pale-Green">
              <img src="./assets/img/icon-carbon-neutral.svg" alt="Carpon natural icon">
              <p class="md:text-xl">This is a carbon-neutral delivery</p>
            </div>
            <button class="w-full btn btn-neutral bg-Deep-Red md:text-lg text-white" id="confirm-order" onclick="my_modal_3.showModal()">Confirm order</button>`;

      // Event listeners to remove items from cart
      document.querySelectorAll(".remove-element").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(e.target.closest(".remove-element").dataset.id)
          if (!id) return

          cart = cart.filter((item) => item.product.id !== id);
          counters[id] = 0;
          document.getElementById(`counter-${id}`).innerText = counters[id]

          // Re-render cart & update counter
          renderCartItems(cart);
          cartCounter(cart.length);
          counterIcon(cart.length)
        })
      })
      // Select modal container
      const confirmBtn = document.getElementById("confirm-order")
      // Select order list container
      const OrderList = document.getElementById("order-list")

      // Event listener to store selected products in final phase order
      confirmBtn.addEventListener("click", () => {
        finalOrder = cart
        //Calculate whole order price
        const orderTotal = finalOrder.reduce((acc, curr, index) => {
          return acc + parseFloat(curr.product.price) * curr.quantity
        }, 0)
        //Render items in order list container
        OrderList.innerHTML = finalOrder.map((item) =>
          `
          <li class="flex items-start justify-start gap-4">
          <img src="${item.product.image}" alt="${item.product.name}" class="w-14 h-auto rounded-md"/>
          <p class="flex flex-col gap-y-3 flex-grow">
          <span class="font-medium text-xl text-Dark-Olive-Green">${item.product.name}</span>
          <span class="flex items-center gap-4">
            <span class="text-Deep-Red text-lg">&times;${item.quantity}</span>
            <span class="text-Dark-Gray text-lg">EGB ${item.product.price}</span>

          </span>
          </p>
          <p class="text-Dark-Teal font-medium text-2xl text-right">EGP ${(item.quantity * item.product.price).toFixed(2)}</p>
          </li>
          <div class="m-0 divider after:bg-Pale-Green before:bg-Pale-Green"></div>
          `
        ).join('') + `
        <li class="flex items-center justify-between">
        <span class=" font-medium text-2xl md:text3xl text-Dark-Olive-Green">Order Total</span>
        <span class="font-medium text-2xl md:text3xl text-Dark-Olive-Green">EGP ${orderTotal.toFixed(2)}</span>
        </li>
        `
      })
    }

    // Render Empty cart by default
    renderCartItems([])

    // Render all products initially
    renderProducts(data)

    // Filter functionality based on selected category
    filters.forEach((input) => {
      input.addEventListener("change", (e) => {
        const currentCategory = e.target.ariaLabel;
        menu.innerHTML = ""; // Clear menu before appending new items

        const filteredItems = currentCategory === 'All'
          ? data
          : data.filter((item) => item.category === currentCategory);

        renderProducts(filteredItems);
      });
    });

  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


// Load the appropriate logic based on the current page
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname

  if (path.includes('menu.html')) {
    // Load menu page logic
    getProducts();

    // Display & hide cart icon when scroll
    const cartIcon = document.getElementById("cart-icon")
    const cart = document.getElementById("cart")
    window.addEventListener('scroll', showCartIcon)
    function showCartIcon() {
      if (window.scrollY >= cartIcon.getBoundingClientRect().y) {
        cartIcon.style.right = 0
      } else {
        cartIcon.style.right = -100 + "px"
      }
      if (cart.getBoundingClientRect().y <= 500) {
        cartIcon.style.right = -100 + "px"
      }      
    }

    //Go to Cart
    cartIcon.addEventListener('click', () => {
      location.href = "#cart";
    })
  }
  if (path.includes('contact.html')) {
    const form = document.getElementById("form");
    const alertModal = document.getElementById("alert");

    // Handle contact form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset()
      alertModal.classList.add('message-sent')
      setInterval(() => {
        alertModal.classList.remove('message-sent')
      }, 3000)
    })
  }
})






