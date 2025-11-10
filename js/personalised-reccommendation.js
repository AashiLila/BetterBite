
const API_KEY = "4a3522fdbcd94c0fbfe7f14fed740d7e"; // api key for spoonvacular
const recipeSection = document.querySelector(".recipe-section-box");

// pull from quiz answers in index.js and nutrient analysis in analysis.js
const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers")) || [];
//const nutrientImprovements = JSON.parse(localStorage.getItem("nutrientImprovements")) || [];

// store quiz answers in array
function getAnswer(index){
  return Array.isArray(quizAnswers[index])
    ? quizAnswers[index]
    : quizAnswers[index]
    ? [quizAnswers[index]]
    : [];
}

const dietPref = getAnswer(0); // stores diet preference
const intolerance = getAnswer(1); // stores intolerance/allergy
const cuisine = getAnswer(2); // stores preferred cuisine

console.log("Diet:", dietPref);
console.log("Intolerances:", intolerance);
console.log("Cuisine:", cuisine);

const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
url.searchParams.append("apiKey", API_KEY);
url.searchParams.append("number", 4); // max 4 recipes on the page

// update search params based on diet
if(dietPref.length > 0){
    url.searchParams.append("diet", dietPref.join(","));
}

// update search params based on allergies
if(intolerance.length > 0){
    url.searchParams.append("intolerances", intolerance.join(","));
}

// update search params based on cuisine
if(cuisine.length > 0){
    url.searchParams.append("cuisine", cuisine.join(","));
}

// suggest recipes based on nutrient analysis
// nutrientImprovements.forEach(nutrient => {
//   if (nutrient.includes("Low Protein")) url.searchParams.append("minProtein", "50");
//   if (nutrient.includes("Low Iron")) url.searchParams.append("minIron", "18");
//   if (nutrient.includes("Low Fiber")) url.searchParams.append("minFiber", "28");
//   if (nutrient.includes("Low Vitamin C")) url.searchParams.append("minVitaminC", "90");
//   if (nutrient.includes("Low Vitamin D")) url.searchParams.append("minVitaminD", "20");
// });

// get recipe from API based on updated search parameters
async function fetchRecipe(){
    const response = await fetch(url);
    const data = await response.json();
    console.log("API Response:", data);

    if (!data.results || data.results.length === 0) {
      recipeSection.innerHTML = "<p>No recipes found for your preferences.</p>";
      return;
    }

    displayRecipes(data.results);
}

console.log("Request URL:", url.toString());

function displayRecipes(recipes){
  recipeSection.innerHTML = "";

    // create button for each recipe
  recipes.forEach((recipe) => {
    const button = document.createElement("button");
    button.classList.add("recipe-button");

    // show recipe name without image
    button.innerHTML = `
      <div class="recipe-name">${recipe.title}</div>
    `;

    // Save ID when clicked so we can display recipe (not done yet)
    button.addEventListener("click", () => {
      localStorage.setItem("selectedRecipeId", recipe.id);
      window.location.href = "recipe.html";
    });

    recipeSection.appendChild(button);
  });
}

fetchRecipe();
