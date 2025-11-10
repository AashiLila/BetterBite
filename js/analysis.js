
// Spoonacular API key
const apiKey = "4a3522fdbcd94c0fbfe7f14fed740d7e";

const foodEntries = JSON.parse(localStorage.getItem("foodEntries")) || [];

// map to spoonacular values - spoonacular doesn't have brand or anything
const foodMap = {
  "classic chips": "potato chips",
  "dark chocolate": "chocolate bar",
  "pepsi can": "cola",
  "corn flakes": "corn cereal",
  "kitkat": "chocolate wafer",
};


let foodsToAnalyze = foodEntries.length > 0
  ? foodEntries.map(entry => entry.food)
  : ["pizza"]; // fallback

foodsToAnalyze = foodsToAnalyze.map(f =>
  foodMap[f.toLowerCase()] || f
);

const lastFood = foodsToAnalyze[foodsToAnalyze.length - 1];
getNutrition(lastFood);


// standard adult daily values (based on 2000-cal diet)
const DAILY_VALUES = {
  "Carbohydrates": 275,
  "Fiber": 28,
  "Protein": 50,
  "Vitamin C": 90,
  "Vitamin D": 20,
  "Iron": 18,
};

// Fetch and display nutrition info
async function getNutrition(query = "pizza") {
  try {
    // Step 1: Find the ingredient
    const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(query)}&number=1&apiKey=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    //console.log("Search status:", searchRes.status);
    console.log("Search status:", searchRes.status);
    console.log("Search data:", searchData);


    if (!searchData.results?.length) {
      alert("Food not found!");
      return;
    }

    const foodId = searchData.results[0].id;

    // Step 2: Get detailed nutrition
    const infoUrl = `https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=100&unit=grams&apiKey=${apiKey}`;
    const infoRes = await fetch(infoUrl);
    const food = await infoRes.json();

    const nutrients = food.nutrition?.nutrients || [];

    // Link HTML labels to Spoonacular nutrient names
    const nutrientMap = {
      "Carbs": "Carbohydrates",
      "Fiber": "Fiber",
      "Protein": "Protein",
      "Vitamin C": "Vitamin C",
      "Vitamin D": "Vitamin D",
      "Iron": "Iron",
    };

    // Reset improvements
    const improvements = [];

    // Go through each nutrient and calculate %DV
    document.querySelectorAll(".nutrient").forEach(div => {
      const label = div.querySelector(".label").textContent.trim();
      const nutrientName = nutrientMap[label];
      const nutrient = nutrients.find(n =>
        n.name.toLowerCase().includes(nutrientName.toLowerCase())
      );

      const bar = div.querySelector(".bar");
      const valueSpan = div.querySelector(".value");

      if (nutrient && DAILY_VALUES[nutrientName]) {
        // Convert units to mg/g if needed
        let amount = nutrient.amount;
        const unit = nutrient.unit.toLowerCase();

        if (unit === "µg") amount = amount / 1000; // µg → mg
        if (unit === "mg" && DAILY_VALUES[nutrientName] > 100) amount = amount / 1000; // mg → g

        const percent = ((amount / DAILY_VALUES[nutrientName]) * 100).toFixed(1);
        const boundedPercent = Math.min(percent, 100); // prevent overflowing bars
        valueSpan.textContent = `${percent}%`;
        bar.style.width = `${boundedPercent}%`;

        // Color logic
        if (percent < 20) {
          bar.style.backgroundColor = "#e74c3c"; // red = low
          improvements.push(`Low ${nutrientName}`);
        } else if (percent > 120) {
          bar.style.backgroundColor = "#f39c12"; // orange = too high
          improvements.push(`High ${nutrientName}`);
        } else {
          bar.style.backgroundColor = "#27ae60"; // green = healthy range
        }
      } else {
        valueSpan.textContent = "N/A";
        bar.style.width = "0%";
        bar.style.backgroundColor = "#ccc";
      }
    });

    // Update insights list
    const improvementList = document.getElementById("improvement-list");
    improvementList.innerHTML = improvements.length
      ? improvements.map(i => `<span>• ${i}</span>`).join("")
      : "<span>All nutrients are in a good range!</span>";

      localStorage.setItem("nutrientImprovements", JSON.stringify(improvements));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Run default on page load
// getNutrition("pizza");






