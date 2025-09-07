// Function for getting DOM Elements
const getEl = (selector, all = false) => {
  return all
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
};

// DOM Selector
const cardContainer = getEl("#card-container");

// Container Cleaner
const cleaner = (el) => {
  if (!el) return;
  el.innerHTML = "";
};

// Add Active
const active = (target) => {
  const categories = getEl("#category-container li a", true);

  categories.forEach((a) => {
    a.classList.add("bg-transparent", "text-[#1F2937]");
    a.classList.remove("bg-[#15803D]", "text-white");
  });

  if ((target.tagName = "A")) {
    target.classList.add("bg-[#15803D]", "text-white");
    target.classList.remove("bg-transparent", "text-[#1F2937]");
  }
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
  cleaner(categoryContainer);

  categories.forEach((category) => {
    const { id, category_name } = category;

    const li = document.createElement("li");
    li.addEventListener("click", (e) => {
      loadPlants(id, false);
      active(e.target);
    });
    li.innerHTML = `
        <a href="#" class="hover:bg-[#15803ccd] hover:text-white block px-2.5 py-2 rounded-md opacity-85">${category_name}</a>
    `;

    categoryContainer.append(li);
  });
};

// Display Plants
const displayPlants = (plants) => {
  cleaner(cardContainer);

  plants.forEach((plant, i) => {
    const { id, image, name, description, category, price } = plant;

    cardContainer.innerHTML += `
        <!-- Card ${i + 1} -->
              <div id="${id}" class="plant_card bg-white p-4 rounded-lg shadow-sm space-y-3">
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
                  <p class="text-xs opacity-80">${description}</p>
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
      <img src="${image}" class="aspect-3/2 object-cover rounded-lg"/>
      <span class="block"><strong>Category: </strong>${category}</span>
      <span class="block"><strong>Price: </strong>$${price}</span>
      <p><strong>Description: </strong>${description}</p>
      
  `;

  modalBox.showModal();
};

// Listeners
cardContainer.addEventListener("click", (e) => {
  const target = e.target;
  const plantNameEl = target.closest(".plant_name");
  const id = target.closest(".plant_card").id;
  if (plantNameEl) {
    loadPlantDetails(id);
  }
});

loadPlants();
