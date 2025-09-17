const showSpinner = () => {
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("spinner").classList.add("flex");
};
const hideSpinner = () => {
  document.getElementById("spinner").classList.remove("flex");
  document.getElementById("spinner").classList.add("hidden");
};

// mobile nav functionality
document.getElementById("mobileNavBtn").addEventListener("click", ()=>{
  const mobileUl = document.getElementById("mobileNav");
  if(mobileUl.classList.contains("hidden")){
    mobileUl.classList.remove("hidden");
    mobileUl.classList.add("flex")
  }else{
    mobileUl.classList.remove("flex");
    mobileUl.classList.add("hidden")    
  }
})

// Categories fetch করা
const getCategories = async () => {
  try {
    showSpinner();
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
        return data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }finally{
    hideSpinner();
  }
};

  // Fetch all plants
const getAllPlants = async () => {
  try {
    showSpinner();
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    return data.plants;
  } catch (error) {
    console.error("Error fetching plants:", error);
  }finally{
    hideSpinner();
  }
};
// Fetch plants by category id
const getPlantsByCategory = async (id) => {
  try { 
    showSpinner();
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    return data.plants; 
  } catch (error) {
    console.error("Error fetching category plants:", error);
  }finally{
    hideSpinner();
  }
};

// Global cart array
let cart = [];

// Update and render cart
const renderCart = () => {
  const cartContainer = document.getElementById("cart-container");
  const totalContainer = document.getElementById("cart-total");

  // Clear old cart items
  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-3 rounded-lg bg-green-100 w-full";
    div.innerHTML = `
      <div class="flex flex-col items-start gap-1">
        <span>${item.name}</span>
        <span class="text-sm">৳${item.price} × ${item.quantity}</span>
      </div>
      <button class="text-gray-400 hover:text-green-800">✕</button>
    `;

    // Remove button
    div.querySelector("button").addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });

    cartContainer.appendChild(div);
  });

  // Update total
  totalContainer.innerText = `৳${total}`;
};

// Add item to cart
const addToCart = (plant) => {
  const existing = cart.find(item => item.id === plant.id);
  alert(`You have added (${plant.name}) in your cart`);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      quantity: 1
    });
  }
  renderCart();
};

// Fetch plant details by id
const getPlantDetails = async (id) => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    return data.plants;
  } catch (error) {
    console.error("Error fetching plant details:", error);
  }
};

// Show modal
const showModal = (plant) => {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden"); // show modal

  modal.innerHTML = `
    <div class="w-full h-full flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
        <!-- Close button -->
        <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">✕</button>

        <img src="${plant.image}" alt="${plant.name}" class="w-full md:h-48 h-32 object-cover rounded-lg mb-4"/>
        <h2 class="md:text-2xl text-xl font-bold text-green-800 mb-2">${plant.name}</h2>
        <p class="text-gray-600 mb-3 sm:text-base text-sm">${plant.description}</p>
        <div class="flex flex-col items-start gap-1 mb-3">
          <p class="flex items-center gap-1 font-medium">Category:<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">${plant.category}</span></p>
          <span class="font-semibold text-lg">Price: ৳${plant.price}</span>
        </div>
        <button class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700" onclick="addToCart(${JSON.stringify(
          plant
        ).replace(/"/g, '&quot;')})">Add to Cart</button>
      </div>
    </div>
  `;

  // Close modal
  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
};

// Render plant cards
const renderPlants = async (plants) => {
  const cardContainer = document.getElementById("card-container");

  // Clear previous cards
  cardContainer.innerHTML = "";

  // If no plants found
  if (!plants || plants.length === 0) {
    cardContainer.innerHTML = `<p class="col-span-3 text-center text-gray-600">No plants found in this category.</p>`;
    return;
  }

  plants.forEach(plant => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-sm p-4 flex flex-col";

    card.innerHTML = `
      <div class="h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
        <img src="${plant.image}" alt="${plant.name}" class="h-full w-full object-cover rounded-md"/>
      </div>
      <h3 class="font-bold text-green-800 cursor-pointer hover:underline">${plant.name}</h3>
      <p class="text-sm text-gray-600">${plant.description.slice(0, 100)}...</p>
      <div class="flex justify-between items-center mt-3">
        <span class="text-sm font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">${plant.category}</span>
        <span class="font-semibold">৳${plant.price}</span>
      </div>
      <button class="mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Add to Cart</button>
    `;

    // Add to cart button
    card.querySelector("button").addEventListener("click", () => addToCart(plant));

    // Plant name click → open modal with details
    card.querySelector("h3").addEventListener("click", async () => {
      const details = await getPlantDetails(plant.id);
      console.log(details)
      showModal(details);
    });

    cardContainer.appendChild(card);
  });
};

// Load categories and attach click events
const loadCategories = async () => {
  const categories = await getCategories();
  const listContainer = document.getElementById("category-list");

  // set active button
  const setActive = (btn) => {
    const allBtns = listContainer.querySelectorAll("button");
    allBtns.forEach(b => b.classList.remove("bg-green-600", "text-white"));
    btn.classList.add("bg-green-600", "text-white");
  };

  // "All Trees" button
  const allBtn = document.createElement("li");
  allBtn.innerHTML = `
    <button class="w-full text-left px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-400 hover:text-black">All Trees</button>
  `;
  const allBtnEl = allBtn.querySelector("button");
  allBtnEl.addEventListener("click", async (e) => {
    setActive(e.target);
    const plants = await getAllPlants();
    renderPlants(plants);
  });
  listContainer.appendChild(allBtn);

  // Category buttons from API
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="w-full text-left px-3 py-2 hover:bg-green-400 rounded-md">
        ${cat.category_name}
      </button>
    `;
    const btn = li.querySelector("button");
    btn.addEventListener("click", async (e) => {
      setActive(e.target);
      const plants = await getPlantsByCategory(cat.id);
      renderPlants(plants);
    });
    listContainer.appendChild(li);
  });
};


// Call the function
const initFunc = async () => {
  await loadCategories();       // load categories
  const plants = await getAllPlants(); // load all plants
  renderPlants(plants);
};

initFunc();