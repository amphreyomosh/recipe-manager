document.addEventListener("DOMContentLoaded", () => {
    // Select Elements
    const addRecipeForm = document.getElementById("addRecipeForm");
    const searchButton = document.getElementById("searchButton");
    const searchQuery = document.getElementById("searchQuery");
    const recipeList = document.getElementById("recipeList");

    // Dashboard elements
    const totalRecipesDisplay = document.getElementById("totalRecipes");
    const recentRecipeDisplay = document.getElementById("recentRecipe");
    const featuredTitleDisplay = document.getElementById("featuredTitle");

    // Sidebar toggle elements
    const sidebar = document.querySelector("nav");
    const menuToggle = document.querySelector(".nav-toggle");

    let recipes = localStorage.getItem("recipes") ? JSON.parse(localStorage.getItem("recipes")) : [];

    // Function to Update Dashboard
    const updateDashboard = () => {
        totalRecipesDisplay.textContent = recipes.length;
        if (recipes.length > 0) {
            recentRecipeDisplay.textContent = recipes[recipes.length - 1].title;
            featuredTitleDisplay.textContent = recipes[0].title;
        } else {
            recentRecipeDisplay.textContent = "None";
            featuredTitleDisplay.textContent = "No featured recipe yet.";
        }
    };

    // Function to Render Recipes
    const renderRecipes = (filter = "") => {
        recipeList.innerHTML = "";
        const filteredRecipes = recipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(filter.toLowerCase())
        );

        filteredRecipes.forEach((recipe, index) => {
            const recipeDiv = document.createElement("div");
            recipeDiv.className = "recipe bg-gray-100 p-4 rounded shadow-md mb-2";
            recipeDiv.innerHTML = `
                <h3 class="text-lg font-bold">${recipe.title}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <div class="mt-2">
                    <button class="editButton bg-yellow-500 text-white px-2 py-1 rounded" data-index="${index}">Edit</button>
                    <button class="deleteButton bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Delete</button>
                </div>
            `;
            recipeList.appendChild(recipeDiv);
        });

        // Add Event Listeners for Edit and Delete Buttons
        document.querySelectorAll(".editButton").forEach((button) => {
            button.addEventListener("click", (event) => {
                editRecipe(event.target.dataset.index);
            });
        });

        document.querySelectorAll(".deleteButton").forEach((button) => {
            button.addEventListener("click", (event) => {
                deleteRecipe(event.target.dataset.index);
            });
        });

        updateDashboard();
    };

    // Function to Add a Recipe
    const addRecipe = (title, ingredients, instructions) => {
        recipes.push({ title, ingredients, instructions });
        localStorage.setItem("recipes", JSON.stringify(recipes));
        renderRecipes();
    };

    // Function to Edit a Recipe
    const editRecipe = (index) => {
        const newTitle = prompt("Edit Title:", recipes[index].title);
        const newIngredients = prompt("Edit Ingredients:", recipes[index].ingredients);
        const newInstructions = prompt("Edit Instructions:", recipes[index].instructions);
        if (newTitle && newIngredients && newInstructions) {
            recipes[index] = { title: newTitle, ingredients: newIngredients, instructions: newInstructions };
            localStorage.setItem("recipes", JSON.stringify(recipes));
            renderRecipes();
        }
    };

    // Function to Delete a Recipe
    const deleteRecipe = (index) => {
        if (confirm("Are you sure you want to delete this recipe?")) {
            recipes.splice(index, 1);
            localStorage.setItem("recipes", JSON.stringify(recipes));
            renderRecipes();
        }
    };

    // Form Submission (Add Recipe)
    addRecipeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const ingredients = document.getElementById("ingredients").value;
        const instructions = document.getElementById("instructions").value;

        if (title && ingredients && instructions) {
            addRecipe(title, ingredients, instructions);
            addRecipeForm.reset();
        }
    });

    // Search Functionality
    searchButton.addEventListener("click", () => {
        renderRecipes(searchQuery.value);
    });

    // Initial Rendering
    renderRecipes();

    // Sidebar Toggle for Mobile
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
    });

    // Close Sidebar When Clicking Outside
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && event.target !== menuToggle) {
            sidebar.classList.add("hidden");
        }
    });

    // Expandable Sections
    const addRecipeSection = document.querySelector("#addRecipe");
    const searchSection = document.querySelector("#search");
    const addRecipeNav = document.querySelector("nav a[href='#addRecipe']");
    const searchNav = document.querySelector("nav a[href='#search']");

    let activeSection = null;

    const toggleExpand = (section) => {
        if (activeSection === section) {
            section.classList.remove("full-width");
            activeSection = null;
        } else {
            addRecipeSection.classList.remove("full-width");
            searchSection.classList.remove("full-width");
            section.classList.add("full-width");
            activeSection = section;
        }
    };

    addRecipeNav.addEventListener("click", (event) => {
        event.preventDefault();
        toggleExpand(addRecipeSection);
    });

    searchNav.addEventListener("click", (event) => {
        event.preventDefault();
        toggleExpand(searchSection);
    });  
});
