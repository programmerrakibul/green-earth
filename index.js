// Function for getting DOM Elements
const getEl = (selector, all = false) => {
  return all
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
};

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
        <a href="#" class="hover:bg-[#15803D] hover:text-white block px-2.5 py-2 rounded-md opacity-85">${category_name}</a>
    `;

    categoryContainer.append(li);
  });
};

// Display Plants
const displayPlants = (plants) => {
  const cardContainer = getEl("#card-container");
  cleaner(cardContainer);

  plants.forEach((plant, i) => {
    const { image, name, description, category, price } = plant;

    cardContainer.innerHTML += `
        <!-- Card ${i + 1} -->
              <div class="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <!-- Image -->
                <figure class="rounded-lg overflow-hidden">
                  <img
                    src="${image}"
                    alt=""
                  />
                </figure>

                <!-- Details -->
                <div class="space-y-2">
                  <h5 class="text-sm font-semibold">${name}</h5>
                  <p class="text-xs opacity-80">${description}</p>
                  <div class="flex justify-between items-center">
                    <span
                      class="px-3 py-1 bg-[#DCFCE7] text-[#15803D] font-medium text-sm font-['Geist'] rounded-full"
                      >${category}</span>
                    <span class="font-semibold text-sm">৳<span>${price}</span></span>
                  </div>
                </div>

                <!-- Cart Button -->
                <button
                  type="button"
                  class="btn btn-block border-none rounded-full bg-[#15803ce3] hover:bg-[#15803D] text-base font-medium text-white"
                >
                  Add to Cart
                </button>
              </div>
    `;
  });
};

loadPlants();
