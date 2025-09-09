// Function for getting DOM Elements
const getEl = (selector, all = false) => {
  return all
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
};

const textToNumber = (el) => {
  const num = Number(el.textContent.trim());
  return num;
};

// ID Slicer
const idSlicer = (fullId, len) => {
  let shortId = "";
  for (let i = 0; i < fullId.length; i++) {
    if (i > len) shortId += fullId[i];
  }
  return shortId;
};

// DOM Selector
const cardContainer = getEl("#card-container");
const cartContainer = getEl("#cart-container");
const cartShowBtn = getEl("#cart-show-btn");
const cartHideBtn = getEl("#cart-hide-btn");

// Container Cleaner
const cleaner = (el) => {
  if (!el) return;
  el.innerHTML = "";
};

// Add Active
const active = (target) => {
  const categories = getEl("#category-container li", true);

  categories.forEach((li) => {
    li.classList.add("hover:bg-[#68ff9fcc]");
    li.classList.remove("bg-[#15803D]", "text-white");
  });

  target.classList.add("bg-[#15803D]", "text-white");
  target.classList.remove("hover:bg-[#68ff9fcc]");
};

// Spinner
const spinner = () => {
  cleaner(cardContainer);

  cardContainer.innerHTML = `
      <div class="flex justify-center items-center mt-10 col-span-full">
          <div class="flex flex-row gap-2">
            <div class="size-3 rounded-full bg-[#15803D] animate-bounce"></div>
            <div class="size-3 rounded-full bg-[#15803D] animate-bounce [animation-delay:-.3s]"></div>
            <div class="size-3 rounded-full bg-[#15803D] animate-bounce [animation-delay:-.5s]"></div>
          </div>
      </div>
  `;
};

// Loading Categories
(async () => {
  try {
    const url = "https://openapi.programming-hero.com/api/categories";
    const response = await fetch(url);
    const data = await response.json();
    const categories = data.categories;
    displayCategories(categories);
  } catch (error) {
    console.log("Error Fetching Categories: ", error);
  }
})();

// Loading Plants by Category
const loadPlants = async (id, all = true) => {
  spinner();
  try {
    let url;

    if (all) {
      url = "https://openapi.programming-hero.com/api/plants";
    } else {
      url = `https://openapi.programming-hero.com/api/category/${id}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const plants = data.plants;
    displayPlants(plants);
  } catch (error) {
    console.log("Error Fetching Plants: ", error);
  }
};

// Fetching Plant Details by id
const loadPlantDetails = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    const details = data.plants;
    displayDetails(details);
  } catch (error) {
    console.log("Error Fetching Plant Details: ", error);
  }
};

// Displaying Categories
const displayCategories = (categories) => {
  const categoryContainer = getEl("#category-container");

  categories.forEach((category) => {
    const { id, category_name } = category;
    const li = document.createElement("li");

    li.textContent = category_name;
    li.id = `category-${id}`;
    li.className =
      "category hover:bg-[#68ff9fcc] px-2.5 py-2 rounded-md cursor-pointer";

    categoryContainer.append(li);
  });

  categoryContainer.addEventListener("click", (e) => {
    const li = e.target.closest(".category");
    if (li) {
      const id = li.id;
      active(li);
      if (id) {
        loadPlants(idSlicer(id, 8), false);
      }
    }
  });
};

// Display Plants
const displayPlants = (plants) => {
  cleaner(cardContainer);

  plants.forEach((plant, i) => {
    const { id, image, name, description, category, price } = plant;

    cardContainer.innerHTML += `
        <!-- Card ${i + 1} -->
              <div id="card-${id}" class="plant_card bg-white p-4 rounded-lg shadow-sm space-y-3">
                <!-- Image -->
                <figure class="rounded-lg overflow-hidden">
                  <img
                    src="${image}"
                    alt="" class="aspect-3/2 object-cover"
                  />
                </figure>

                <!-- Details -->
                <div class="space-y-2">
                  <h5 class="plant_name text-sm font-semibold">${name}</h5>
                  <p class="text-xs opacity-80 max-h-8 overflow-hidden text-ellipsis line-clamp-2">${description}</p>
                  <div class="flex justify-between items-center">
                    <span
                      class="px-3 py-1 bg-[#DCFCE7] text-[#15803D] font-medium text-sm font-['Geist'] rounded-full"
                      >${category}</span>
                    <span class="font-semibold text-sm">৳<span class="plant_price">${price}</span></span>
                  </div>
                </div>

                <!-- Cart Button -->
                <button
                  type="button"
                  class="add_cart_btn btn btn-block border-none rounded-full bg-[#15803ce3] hover:bg-[#15803D] text-base font-medium text-white"
                >
                  Add to Cart
                </button>
              </div>
    `;
  });
};

// Display Plant Details
const displayDetails = (details) => {
  const modalBox = getEl("#plant_modal");
  const detailsBox = getEl("#plant-details");
  const { image, name, description, category, price } = details;
  cleaner(detailsBox);

  detailsBox.innerHTML = `
      <h4 class="font-bold text-2xl">${name}</h4>
      <img src="${image}" class="rounded-lg aspect-3/2 object-cover"/>
      <span class="block"><strong>Price: </strong>৳${price}</span>
      <span class="block"><strong>Category: </strong>${category}</span>
      <p><strong>Description: </strong>${description}</p>
  `;

  modalBox.showModal();
};

// Empty Cart Items Array
let cartItems = [];

// Items removing to cart container
const removeFromCart = (removeBtn) => {
  const itemID = removeBtn.parentNode.id;
  const found = cartItems.findIndex((item) => item.cartId === itemID);

  if (found !== -1) {
    if (cartItems[found].quantity < 2) {
      cartItems.splice(found, 1);
    } else {
      cartItems[found].quantity -= 1;
    }
  }

  addToCart(cartItems);
};

// Items adding to cart container
const addToCart = (cartItems) => {
  const totalPriceEl = getEl("#cart-total-price");
  cleaner(cartContainer);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  totalPriceEl.textContent = totalPrice.toFixed(2);

  cartItems.forEach((item) => {
    cartContainer.innerHTML += `
        <div id="${item.cartId}" class="flex justify-between items-center gap-2.5 bg-[#F0FDF4] px-3 py-2 rounded-lg">
                <div class="space-y-1">
                  <h5 class="text-sm font-semibold">${item.name}</h5>
                  <span class="opacity-50">৳${item.price} × ${item.quantity}</span>
                </div>
                <button type="button" aria-label="Cart Item remove Button"
                  class="remove_cart_btn btn bg-transparent border-none p-0 shadow-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
    `;
  });
};

// Toggles Classes
const toggleClasses = (show) => {
  const plantsSection = getEl("#plants-section");

  if (show) {
    plantsSection.classList.add("visible", "opacity-100", "right-0");
    plantsSection.classList.remove("invisible", "opacity-0", "-right-[100%]");
  } else {
    plantsSection.classList.add("invisible", "opacity-0", "-right-[100%]");
    plantsSection.classList.remove("visible", "opacity-100", "right-0");
  }
};

// Listeners
cardContainer.addEventListener("click", (e) => {
  const target = e.target;
  const plantNameEl = target.closest(".plant_name");
  const addCartBtn = target.closest(".add_cart_btn");
  const id = target.closest(".plant_card").id;

  if (plantNameEl) {
    const apiId = idSlicer(id, 4);
    loadPlantDetails(apiId);
  }

  if (addCartBtn) {
    const card = target.closest(".plant_card");
    const name = card.querySelector(".plant_name").textContent;
    const priceEl = card.querySelector(".plant_price");
    const price = textToNumber(priceEl);
    const cartId = `cart-${idSlicer(id, 4)}`;

    if (cartItems.some((item) => item.cartId === cartId)) {
      const filteredItems = cartItems.filter((item) => item.cartId === cartId);
      filteredItems[0].quantity += 1;
    } else {
      cartItems.push({ cartId, name, price, quantity: 1 });
    }

    alert(`${name} has been added to cart`);
    addToCart(cartItems);
  }
});

cartContainer.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove_cart_btn");
  if (removeBtn) {
    removeFromCart(removeBtn);
  }
});

// Cart Show
cartShowBtn.addEventListener("click", () => toggleClasses(true));

// Cart Hide
cartHideBtn.addEventListener("click", () => toggleClasses(false));

loadPlants();
