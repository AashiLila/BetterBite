
const addButton = document.getElementById("food-entry-button");
const clearButton = document.getElementById("clear-food-button");

// dropdowns
const daySelect = document.getElementById("days");
const categorySelect = document.getElementById("category");
const brandSelect = document.getElementById("brand");
const servingSelect = document.getElementById("serving");
const foodSelect = document.getElementById("food");

// load previous entries from localStorage
let foodEntries = JSON.parse(localStorage.getItem("foodEntries")) || [];

// save to localStorage
function saveEntries() {
  localStorage.setItem("foodEntries", JSON.stringify(foodEntries));
}

// add food entry
addButton.addEventListener("click", () => {
  const entry = {
    day: daySelect.value,
    category: categorySelect.value,
    brand: brandSelect.value,
    servings: parseInt(servingSelect.value),
    food: foodSelect.value
  };

  foodEntries.push(entry);
  saveEntries();

  alert(`Added ${entry.servings} serving(s) of ${entry.brand} ${entry.food} for ${entry.day}.`);
});

// clear all entries
clearButton.addEventListener("click", () => {
  if (confirm("Clear all saved food entries?")) {
    foodEntries = [];
    saveEntries();
    alert("All food entries cleared.");
  }
});