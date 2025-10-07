// Inisialisasi data resep dan variabel lainnya
let allRecipes = [];
let cuisines = [];
let currentPage = 1;
const recipesPerPage = 6;  // Menampilkan 6 resep per halaman
let activeRecipes = []; // currently-displayed dataset (supports filters/search + pagination)

// Fetch data untuk resep dan cuisine
fetch('https://dummyjson.com/recipes')
  .then(response => response.json())
  .then(data => {
    allRecipes = data.recipes;  // Simpan semua resep
    activeRecipes = allRecipes.slice();
    cuisines = [...new Set(data.recipes.map(recipe => recipe.cuisine))];  // Ambil hanya unique cuisine
    displayRecipes();  // Tampilkan resep pertama kali
    populateCuisineDropdown(cuisines);  // Isi dropdown filter dengan cuisine
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    const msg = document.getElementById('message');
    if (msg) msg.innerText = 'Error fetching data. Please try again later.';
  });

// Fungsi untuk menampilkan resep ke halaman
function displayRecipes(recipes) {
  const grid = document.getElementById('grid');

  // Jika dipanggil dengan daftar resep (filter/search), set activeRecipes dan reset halaman
  if (recipes) {
    activeRecipes = recipes;
    currentPage = 1;
    grid.innerHTML = ''; // bersihkan grid untuk tampilan baru
  }

  // Ambil resep berdasarkan halaman yang sedang ditampilkan dari activeRecipes
  const start = (currentPage - 1) * recipesPerPage;
  const end = currentPage * recipesPerPage;
  const displayedRecipes = activeRecipes.slice(start, end);  // Ambil resep sesuai dengan halaman

  // Tampilkan resep yang sudah diambil tanpa menghapus resep yang ada (kecuali ketika reset di atas)
  displayedRecipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    
    // Isi konten card resep
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
      <h3 class="recipe-name">${recipe.name}</h3>
      <p>Cooking Time: ${recipe.cookingTime} minutes</p>
      <p>Difficulty: ${recipe.difficulty}</p>
      <p>Cuisine: ${recipe.cuisine}</p>
      <p>Rating: ${'★'.repeat(recipe.rating)}</p>
      <button class="btn view-recipe" data-id="${recipe.id}">View Full Recipe</button>
    `;
    
    grid.appendChild(recipeCard);

    // Event listener untuk "View Full Recipe"
    const btn = recipeCard.querySelector('.view-recipe');
    if (btn) {
      btn.addEventListener('click', () => {
        try {
          showRecipeDetails(recipe);
        } catch (err) {
          console.error('Error in view-recipe click handler:', err);
        }
      });
    }
  });

  // Update tombol "Show More"
  updateShowMoreButton();
}

// Fungsi untuk tombol "Show More"
function updateShowMoreButton() {
  const showMoreButton = document.getElementById('showMore');
  const totalPages = Math.ceil(activeRecipes.length / recipesPerPage);
  const endMessage = document.getElementById('endMessage');
  if (currentPage < totalPages) {
    showMoreButton.style.display = 'inline-block';
    if (endMessage) endMessage.classList.add('hidden');
  } else {
    showMoreButton.style.display = 'none'; // Hide the button if no more pages
    if (endMessage) endMessage.classList.remove('hidden');
  }
}

// Fungsi untuk tombol "Show More"
document.getElementById('showMore').addEventListener('click', function() {
  currentPage++;  // Increment the current page
  displayRecipes();  // Load more recipes
});

// Fungsi untuk menampilkan detail resep di modal
function showRecipeDetails(recipe) {
  console.log('showRecipeDetails called for', recipe && recipe.id);
  const modal = document.getElementById('modal');
  if (!modal) {
    console.warn('Modal element not found');
    return;
  }

  // Set data resep ke dalam modal (guard missing fields)
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalTime = document.getElementById('modalTime');
  const modalDifficulty = document.getElementById('modalDifficulty');
  const modalCuisine = document.getElementById('modalCuisine');
  const modalRating = document.getElementById('modalRating');

  if (modalImage && recipe.image) modalImage.src = recipe.image;
  if (modalTitle) modalTitle.innerText = recipe.name || '';
  if (modalTime) modalTime.innerText = `Cooking Time: ${recipe.cookingTime ?? '-'} minutes`;
  if (modalDifficulty) modalDifficulty.innerText = `Difficulty: ${recipe.difficulty ?? '-'}`;
  if (modalCuisine) modalCuisine.innerText = `Cuisine: ${recipe.cuisine ?? '-'}`;

  // Safe rating
  const ratingCount = Number.isFinite(recipe && recipe.rating) ? Math.max(0, Math.round(recipe.rating)) : 0;
  if (modalRating) modalRating.innerText = `Rating: ${'★'.repeat(ratingCount)}`;

  // Masukkan bahan-bahan ke dalam modal
  const modalIngredients = document.getElementById('modalIngredients');
  if (modalIngredients) {
    modalIngredients.innerHTML = '';
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.innerText = ingredient;
      modalIngredients.appendChild(li);
    });
  }

  // Masukkan langkah-langkah ke dalam modal
  const modalSteps = document.getElementById('modalSteps');
  if (modalSteps) {
    modalSteps.innerHTML = '';
    // Normalize possible instruction fields from API into an array of steps
    let steps = [];
    if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
      steps = recipe.instructions;
    } else if (Array.isArray(recipe.steps) && recipe.steps.length) {
      steps = recipe.steps;
    } else if (typeof recipe.instruction === 'string' && recipe.instruction.trim()) {
      // sometimes APIs return a single instruction string with newlines
      steps = recipe.instruction.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
      steps = recipe.instructions.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(recipe.directions) && recipe.directions.length) {
      steps = recipe.directions;
    }

    if (steps.length === 0) {
      const li = document.createElement('li');
      li.innerText = 'No steps available.';
      modalSteps.appendChild(li);
    } else {
      steps.forEach(step => {
        const li = document.createElement('li');
        li.innerText = step;
        modalSteps.appendChild(li);
      });
    }
  }

  // Tampilkan modal (hapus kelas 'hidden' dan tambahkan 'show')
  modal.classList.remove('hidden');
  modal.classList.add('show');
}

// Menutup modal ketika klik di luar modal atau tombol close
document.querySelectorAll('[data-close]').forEach(element => {
  element.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    // Sembunyikan modal (hapus 'show' dan tambahkan 'hidden')
    modal.classList.remove('show');
    modal.classList.add('hidden');
  });
});

// Fungsi untuk mengisi dropdown dengan cuisine yang sudah diambil
function populateCuisineDropdown(cuisines) {
  const cuisineSelect = document.getElementById('cuisine');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.value = cuisine;
    option.innerText = cuisine;
    cuisineSelect.appendChild(option);
  });
}

// Fungsi filter berdasarkan cuisine
document.getElementById('cuisine').addEventListener('change', function() {
  const selectedCuisine = this.value;
  let filteredRecipes = [];
  if (selectedCuisine === '__ALL__') {
    filteredRecipes = allRecipes;
  } else {
    filteredRecipes = allRecipes.filter(recipe => recipe.cuisine === selectedCuisine);
  }
  displayRecipes(filteredRecipes);  // Tampilkan resep sesuai filter
});

// Implementasi pencarian dengan debouncing
let timeout;
document.getElementById('search').addEventListener('input', function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const query = this.value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      (recipe.ingredients || []).some(ingredient => ingredient.toLowerCase().includes(query)) ||
      (recipe.tags || []).some(tag => tag.toLowerCase().includes(query))
    );
    displayRecipes(filteredRecipes);
  }, 300);  // Delay 300ms sebelum pencarian dimulai
});

// 🔹 Tambahan: Tombol Logout
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "login.html";
});
