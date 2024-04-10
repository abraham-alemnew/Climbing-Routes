/*

Snap Academies SEA Stage 2 - Data Catalog Project
Description: This applicaiton is a Rock Climbing route catalog
Input: Users may choose to add any route that they may have as well as photos. Users may also filter routes by what
they may prefer
Output: All routes that fit their filter (all routes are shown by default)
Student: Abraham Alemnew
Known bugs: None.
Date: 04/09/2024

 */



//this is a custom class in order to have routes with their own data
class Route {
    constructor(name, difficulty, type, photoUrl) {
        this.name = name;
        this.difficulty = difficulty;
        this.type = type;
        this.photoUrl = photoUrl;
    }
}



// This is an array of route objects with all their data
let routes = [
    new Route("Swinging Richard", "v4", "Boulder", "https://mountainproject.com/assets/photos/climb/106069325_medium_1558470730.jpg?cache=1701315139"),
    new Route("Hodgepodge", "v2", "Crack", "https://mountainproject.com/assets/photos/climb/105975136_medium_1558385688.jpg?cache=1701314961"),
    new Route("The Line", "v3", "Lead", "https://mountainproject.com/assets/photos/climb/107934223_medium_1494251676.jpg?cache=1654050383")
];



// This function adds cards the page to display the data in the array
function showCards() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    for (let i = 0; i < routes.length; i++) {
        let route = routes[i];
        const title = route.name;
        const imageURL = route.photoUrl;
        const difficulty = route.difficulty;
        const type = route.type;

        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, title, imageURL, difficulty, type); // Edit title, image, difficulty, and type
        cardContainer.appendChild(nextCard); // Add new card to the container
    }
}
// This is where the route object is getting created into a block to be displayed on the catalog
function editCardContent(card, newTitle, newImageURL, difficulty, type) {
    card.style.display = "block";

    const cardHeader = card.querySelector("h2");
    cardHeader.textContent = newTitle;

    const cardImage = card.querySelector("img");
    cardImage.src = newImageURL;
    cardImage.alt = newTitle + " Poster";

    // Add difficulty and type information directly as text content
    const difficultyType = card.querySelector(".difficulty-type");
    difficultyType.innerHTML = "Difficulty: " + difficulty + "<br>Type: " + type;

    console.log("new card:", newTitle, "- html: ", card);
}




// This shows all the cards after everything is ready to be staged
document.addEventListener("DOMContentLoaded", showCards);


// This displays a quote that you need rough edges to climb upwards
function quoteAlert() {
    console.log("Button Clicked!")
    alert("If a mountain was smooth you would not have anything to grab onto!");

}


function addCard() {
    // Prompt user for difficulty, type, name, and image URL
    let difficulty, type, name, imageURL;

    // Prompt user for difficulty and validate
    do {
        difficulty = prompt("Enter difficulty (v1-v10):");
        // Check if the user clicked cancel
        if (difficulty === null) return; // Exit function if cancel is clicked
    } while (!validateDifficulty(difficulty));

    // Display multiple-choice question for type of climb
    type = prompt("Select type of climb:\n1. Crack\n2. Boulder\n3. Lead\n4. Top rope");
    // Break if user canceled
    if (type === null) return;

    // Convert user input to type string
    switch (type) {
        case "1":
            type = "Crack";
            break;
        case "2":
            type = "Boulder";
            break;
        case "3":
            type = "Lead";
            break;
        case "4":
            type = "Top rope";
            break;
        default:
            type = "Other"; // Default to "Other" if input is invalid
            break;
    }

    // Ask for information on new card
    name = prompt("Enter name:");
    // Break if user canceled
    if (name === null) return;
    imageURL = prompt("Enter image URL:");
    // Break if user canceled
    if (imageURL === null) return;

    // Create new Route object with validated data
    const newRoute = new Route(name, difficulty, type, imageURL);

    // Add new Route object to routes array
    routes.push(newRoute);

    // Display updated cards
    showCards();
}

// This removes the last card when the remove card is pressed
function removeLastCard() {
    if (routes.length > 0) {
        routes.pop();
        showCards();
    }

}

function validateDifficulty(difficulty) {
    //making sure entered level is real
    const regex = /^v([1-9]|10)$/;
    return regex.test(difficulty) && parseInt(difficulty.slice(1)) <= 10;
}


// This displays filtered routes
function showFilteredCards(filteredRoutes) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    filteredRoutes.forEach(route => {
        const nextCard = templateCard.cloneNode(true);
        editCardContent(nextCard, route.name, route.photoUrl, route.difficulty, route.type);
        cardContainer.appendChild(nextCard);
    });
}

function toggleFilterOptions() {
    const filterOptions = document.getElementById("filter-options");
    filterOptions.style.display = filterOptions.style.display === "none" ? "block" : "none";
}

function filterByType() {
    const crackCheckbox = document.getElementById("crack-checkbox");
    const boulderCheckbox = document.getElementById("boulder-checkbox");
    const leadCheckbox = document.getElementById("lead-checkbox");
    const topRopeCheckbox = document.getElementById("top-rope-checkbox");

    // Get the checked types
    const selectedTypes = [];
    if (crackCheckbox.checked) {
        selectedTypes.push("Crack");
    }
    if (boulderCheckbox.checked) {
        selectedTypes.push("Boulder");
    }
    if (leadCheckbox.checked) {
        selectedTypes.push("Lead");
    }
    if (topRopeCheckbox.checked) {
        selectedTypes.push("Top rope");
    }

    // Filter routes based on selected types
    const filteredRoutes = routes.filter(route => selectedTypes.includes(route.type));

    return filteredRoutes;
}

function applyFilters() {
    const minVLevel = parseInt(document.getElementById("min-v-level").value) || 1; // Set default to 1 if empty
    const maxVLevel = parseInt(document.getElementById("max-v-level").value) || 10; // Set default to 10 if empty

    // Get selected type filters
    const selectedTypes = [];
    if (document.getElementById("crack-checkbox").checked) {
        selectedTypes.push("Crack");
    }
    if (document.getElementById("boulder-checkbox").checked) {
        selectedTypes.push("Boulder");
    }
    if (document.getElementById("lead-checkbox").checked) {
        selectedTypes.push("Lead");
    }
    if (document.getElementById("top-rope-checkbox").checked) {
        selectedTypes.push("Top rope");
    }

    // Filter routes based on selected type and v level range
    const filteredRoutes = filterRoutes(selectedTypes, minVLevel, maxVLevel);
    showFilteredCards(filteredRoutes);
}

//This filters the routes based on what the user has put as their paramaters
function filterRoutes(selectedTypes, minVLevel, maxVLevel) {
    return routes.filter(route => {
        //This makes vn an int only containing n
        const routeDifficulty = parseInt(route.difficulty.slice(1));
        const vLevelInRange = routeDifficulty >= minVLevel && routeDifficulty <= maxVLevel;
        const typeMatches = selectedTypes.length === 0 || selectedTypes.includes(route.type);
        return vLevelInRange && typeMatches;
    });
}

// This selects all types of climbs
function selectAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    filterByType();
}


//This unselects all types of routes so that it's easier for a user to select just one
function clearAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    filterByType();
}

