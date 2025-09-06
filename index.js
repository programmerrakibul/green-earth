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

// Loading Categories
(async () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  const response = await fetch(url);
  const data = await response.json();
  const categories = data.categories;
  displayCategories(categories);
})();

// Displaying Categories
const displayCategories = (categories) => {
  const categoryContainer = getEl("#category-container");
  cleaner(categoryContainer);

  categories.forEach((category) => {
    const { id, category_name } = category;
    const li = document.createElement("li");
    li.innerHTML = `
        <a href="#" class="hover:bg-[#15803D] hover:text-white block px-2.5 py-2 rounded-md opacity-85">${category_name}</a>
    `;

    categoryContainer.append(li);
  });
};
