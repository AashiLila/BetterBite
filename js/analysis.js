// fetch("https://world.openfoodfacts.net/api/v2/product/3274080005003.json", {
//   method: "GET",
//   headers: { Authorization: "Basic " + btoa("off:off") },
// })
//   .then((response) => response.json())
//   .then((json) => console.log(json));


// example.js
// Run it with: node example.js

// Built-in fetch is available in Node 18+
// If you're using an older version, run: npm install node-fetch


const query = "Kellogg's Corn Flakes"; // ✅ Example food name
const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=1`;

try {
const response = await fetch(url);
const data = await response.json();

if (data.products && data.products.length > 0) {
    const product = data.products[0];

    console.log("Product:", product.product_name || "Unknown");
    console.log("Brand:", product.brands || "N/A");
    console.log("Category:", product.categories_tags?.[0] || "N/A");
    console.log("Serving size:", product.serving_size || "N/A");
    console.log("Nutri-Score:", product.nutriscore_grade?.toUpperCase() || "N/A");

    console.log("Nutri-Levels:");
    console.log("Vitamin_D:", product.nutriments.vitamin_d_100g || 0);
    console.log("Vitamin_C:", product.nutriments.vitamin_c_100g || 0);
    console.log("Fiber:", product.nutriments.fiber_100g || 0);
    console.log("Protein:", product.nutriments.proteins_100g || 0);
    console.log("Iron:", product.nutriments.iron_100g || 0);
    console.log("Carbs:", product.nutriments.carbohydrates_100g || 0);


} else {
    console.log("No product found for your search.");
}
} catch (error) {
console.error("Error fetching data:", error);
}




