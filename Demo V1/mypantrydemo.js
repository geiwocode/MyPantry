
  const recipes = [
    { title: "Lo Bak Go (turnip cake)", source: " @vivianne 🍵", platform: "tiktok", url: "https://vt.tiktok.com/ZSx4ybNao/" ,ingredients: ["daikon radish", "shitake mushrooms", "spring onions", "rice flour","water","garlic salt ","black pepper"," white sugar"] },
    { title: "Apple cinnamon 'pastry' (rice paper)", source: "@Oliviaaa", platform: "tiktok",url: "https://vt.tiktok.com/ZSx4fSbD8/" ,ingredients: ["Greek Yogurt", "apple", "rice paper", "egg","cinnamon", "maple  syrup"] },
    { title: "Anti-inflammatory banana date brownies", source: "@Rak", platform: "tiktok",url:"https://vt.tiktok.com/ZSx4fUSRn/", ingredients: ["bananas", "mango","eggs", "soaked dates","baking powder","honey","cocoa powder", "chocolate chips"] },
    { title: "3 ingredient protein cookies", source: "@Abby", platform: "tiktok",url:"https://vt.tiktok.com/ZSx4f2Ad4/", ingredients: ["banana", "tahini", "protein powder"] },
    { title: "3 ingredient pasta", source: "@cookmastertips", platform: "tiktok",url:"https://vt.tiktok.com/ZSx4f8L9n/",ingredients: ["milk", "butter", "salt", "pepper","pasta", "cheese", "parsley"] },
    { title: "3 ingredient bread rolls", source: "@makeretemiringa", platform: "tiktok",url:"https://vt.tiktok.com/ZSx4fPyjQ/",ingredients: ["flour", "greek yogurt", "baking powder"] },
    { title: "Quick protein tiramisu snack", source: "@yummy_easy_", platform: "instagram",url:"https://www.instagram.com/reel/C68QfS7MA3S/?igsh=MWNjazEzeXdrbmYzZw==",ingredients: ["Greek Yogurt", "cacao powder", "rice crackers", "decaf coffee","cinnamon", "maple  syrup"] },
    { title: "Healthy jam recipe", source: "@c.danicollado", platform: "instagram",url:"https://www.instagram.com/reel/C6CMXWbNEoC/?igsh=d2k5bDI1M2c5eHE=",ingredients: ["blueberries", "water", "honey", "chia seeds"] },
    { title: "Healthy Lava Cake", source: "@hosseinfitness_", platform: "instagram",url:"https://www.instagram.com/reel/C3wEYgav5JZ/?igsh=MWN3eDQxbTNtcGhk",ingredients: ["Greek Yogurt", "semi sweet chocolate chips", "cocoa powder", "chocolate protein powder"] },
    { title: "3 ingredient Mac and Cheese (delicious)", source: "@@patrickzeinali", platform: "youtube",url:"https://youtu.be/WcGYBX6Ucvg?si=tkQFug5WuL_R0pVU",ingredients: ["milk", "macaroni", "cheese"] },
    { title: "3 ingredient ice cream", source: "@@JoshuaWeissman", platform: "youtube",url:"https://youtu.be/WcGYBX6Ucvg?si=tkQFug5WuL_R0pVU",ingredients: ["sweetened condensed milk", "vanilla bean paste", "heavy cream"] },
  ];

  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('results');

  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase().trim();
    resultsDiv.innerHTML = '';

    if (query === '') {
      resultsDiv.innerHTML = '<p class="welcome-message"> Type an ingredient or whatever you remember.</p>';
      return;
    }

    const matches = recipes.filter(recipe =>
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query)) ||
      recipe.title.toLowerCase().includes(query)
    );

    const uniqueMatches = [...new Map(matches.map(r => [r.title, r])).values()];

    if (uniqueMatches.length === 0) {
      resultsDiv.innerHTML = '<p class="no-results">Nothing saved with that yet. Try another search?</p>';
      return;
    }

    uniqueMatches.forEach(recipe => {
      const highlightedIngredients = recipe.ingredients
        .map(ingredient => {
          if (ingredient.toLowerCase().includes(query)) {
            const regex = new RegExp(`(${query})`, 'gi');
            return ingredient.replace(regex, '<span class="highlight">$1</span>');
          }
          return ingredient;
        })
        .join(', ');

      resultsDiv.innerHTML += `
        <div class="recipe-card">
          <p class="title">${recipe.title}</p>
          <a href="${recipe.url}" target="_blank">${recipe.source}</a>
          <p class="ingredients"> ${highlightedIngredients}</p>
          <span class="platform-tag ${recipe.platform}"><i class="fa-brands fa-${recipe.platform}"></i> ${recipe.platform.charAt(0).toUpperCase() + recipe.platform.slice(1)}</span>
        </div>
      `;
    });
  });
