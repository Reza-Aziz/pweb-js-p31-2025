// Ambil data dari API Recipes
fetch('https://dummyjson.com/recipes')
  .then(response => response.json())  // Mengubah response menjadi JSON
  .then(data => {
    console.log(data);  // Cek apakah data sudah berhasil diambil
    displayRecipes(data.recipes);  // Panggil fungsi untuk menampilkan resep
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('message').innerText = 'Terjadi kesalahan saat mengambil data. Coba lagi nanti.';
  });

// Fungsi untuk menampilkan resep
function displayRecipes(recipes) {
  const grid = document.getElementById('grid');
  grid.innerHTML = ''; // Bersihkan grid jika ada konten lama

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    
    // Isi konten card resep
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
      <h3 class="recipe-name">${recipe.name}</h3>
      <p>Waktu Memasak: ${recipe.cookingTime} menit</p>
      <p>Tingkat Kesulitan: ${recipe.difficulty}</p>
      <p>Cuisine: ${recipe.cuisine}</p>
      <p>Rating: ${'★'.repeat(recipe.rating)}</p>
      <button class="btn view-recipe" data-id="${recipe.id}">View Full Recipe</button>
    `;
    
    // Tambahkan card ke dalam grid
    grid.appendChild(recipeCard);

    // Tambahkan event listener untuk "View Full Recipe"
    recipeCard.querySelector('.view-recipe').addEventListener('click', () => {
      showRecipeDetails(recipe);  // Tampilkan detail resep
    });
  });
}

// Fungsi untuk menampilkan detail resep dalam modal
function showRecipeDetails(recipe) {
  const modal = document.getElementById('modal');
  document.getElementById('modalImage').src = recipe.image;
  document.getElementById('modalTitle').innerText = recipe.name;
  document.getElementById('modalTime').innerText = `Waktu: ${recipe.cookingTime} menit`;
  document.getElementById('modalDifficulty').innerText = `Kesulitan: ${recipe.difficulty}`;
  document.getElementById('modalCuisine').innerText = `Cuisine: ${recipe.cuisine}`;
  document.getElementById('modalRating').innerText = `Rating: ${'★'.repeat(recipe.rating)}`;

  // Masukkan bahan-bahan ke dalam modal
  const modalIngredients = document.getElementById('modalIngredients');
  modalIngredients.innerHTML = '';
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.innerText = ingredient;
    modalIngredients.appendChild(li);
  });

  // Masukkan langkah-langkah ke dalam modal
  const modalSteps = document.getElementById('modalSteps');
  modalSteps.innerHTML = '';
  recipe.steps.forEach(step => {
    const li = document.createElement('li');
    li.innerText = step;
    modalSteps.appendChild(li);
  });

  // Tampilkan modal
  modal.classList.remove('hidden');
}

// Menutup modal ketika klik di luar modal atau tombol close
document.querySelectorAll('[data-close]').forEach(element => {
  element.addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
  });
});
