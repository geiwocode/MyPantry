// 
// myPantry recipe search
// 
// This file stores the recipe data and handles the search/filter logic.
// The main idea is simple:
// 1. We keep a list of saved recipes.
// 2. We normalize user input so fuzzy searches are easier.
// 3. We compare the typed words with recipe titles, ingredients, and tags.
// 4. We show the matching cards on the page.
// 

const recipes = [
  {
    title: "Lo Bak Go (turnip cake)",
    source: " @vivianne 🍵",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4ybNao/",
    ingredients: ["daikon radish", "shitake mushrooms", "spring onions", "rice flour", "water", "garlic salt", "black pepper", "white sugar"],
    tags: ["savory", "comfort", "dinner", "healthy"]
  },
  {
    title: "Apple cinnamon 'pastry' (rice paper)",
    source: "@Oliviaaa",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4fSbD8/",
    ingredients: ["Greek Yogurt", "apple", "rice paper", "egg", "cinnamon", "maple syrup"],
    tags: ["sweet", "breakfast", "healthy", "dessert"]
  },
  {
    title: "Anti-inflammatory banana date brownies",
    source: "@Rak",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4fUSRn/",
    ingredients: ["bananas", "mango", "eggs", "soaked dates", "baking powder", "honey", "cocoa powder", "chocolate chips"],
    tags: ["healthy", "dessert", "sweet", "snack", "protein"]
  },
  {
    title: "3 ingredient protein cookies",
    source: "@Abby",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4f2Ad4/",
    ingredients: ["banana", "tahini", "protein powder"],
    tags: ["healthy", "sweet", "snack", "protein"]
  },
  {
    title: "3 ingredient pasta",
    source: "@cookmastertips",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4f8L9n/",
    ingredients: ["milk", "butter", "salt", "pepper", "pasta", "cheese", "parsley"],
    tags: ["easy", "savory", "dinner", "comfort"]
  },
  {
    title: "3 ingredient bread rolls",
    source: "@makeretemiringa",
    platform: "tiktok",
    url: "https://vt.tiktok.com/ZSx4fPyjQ/",
    ingredients: ["flour", "greek yogurt", "baking powder"],
    tags: ["easy", "breakfast", "savory", "bread"]
  },
  {
    title: "Quick protein tiramisu snack",
    source: "@yummy_easy_",
    platform: "instagram",
    url: "https://www.instagram.com/reel/C68QfS7MA3S/?igsh=MWNjazEzeXdrbmYzZw==",
    ingredients: ["Greek Yogurt", "cacao powder", "rice crackers", "decaf coffee", "cinnamon", "maple syrup"],
    tags: ["healthy", "protein", "sweet", "snack"]
  },
  {
    title: "Healthy jam recipe",
    source: "@c.danicollado",
    platform: "instagram",
    url: "https://www.instagram.com/reel/C6CMXWbNEoC/?igsh=d2k5bDI1M2c5eHE=",
    ingredients: ["blueberries", "water", "honey", "chia seeds"],
    tags: ["healthy", "sweet", "breakfast", "spread"]
  },
  {
    title: "Healthy Lava Cake",
    source: "@hosseinfitness_",
    platform: "instagram",
    url: "https://www.instagram.com/reel/C3wEYgav5JZ/?igsh=MWN3eDQxbTNtcGhk",
    ingredients: ["Greek Yogurt", "semi sweet chocolate chips", "cocoa powder", "chocolate protein powder"],
    tags: ["healthy", "dessert", "sweet", "protein"]
  },
  {
    title: "3 ingredient Mac and Cheese (delicious)",
    source: "@@patrickzeinali",
    platform: "youtube",
    url: "https://youtu.be/WcGYBX6Ucvg?si=tkQFug5WuL_R0pVU",
    ingredients: ["milk", "macaroni", "cheese"],
    tags: ["easy", "comfort", "savory", "dinner"]
  },
  {
    title: "3 ingredient ice cream",
    source: "@@JoshuaWeissman",
    platform: "youtube",
    url: "https://youtu.be/WcGYBX6Ucvg?si=tkQFug5WuL_R0pVU",
    ingredients: ["sweetened condensed milk", "vanilla bean paste", "heavy cream"],
    tags: ["easy", "sweet", "dessert", "treat"]
  }
];

// 
// DOM references
// 
// These are the HTML elements we will update.
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

const searchState = {
  query: '',
  matches: [],
  resultCount: 0,
  isEmpty: true
};

const demoSuggestions = [
  "banana dessert",
  "protein snack",
  "cheesy pasta",
  "healthy chocolate",
  "yogurt breakfast",
  "sweet and easy",
  "blueberry jam",
  "banana brownies"
];

const typoMap = {
  banan: "banana",
  bananna: "banana",
  bana: "banana",
  blueberr: "blueberry",
  bluberry: "blueberry",
  nluebrry: "blueberry",
  nleubrry: "blueberry",
  cheesey: "cheesy",
  cheezy: "cheesy",
  protien: "protein",
  proten: "protein",
  choco: "chocolate",
  choclate: "chocolate"
};

function getLikelySuggestions(query) {
  const cleaned = normalizeText(query || "");
  if (!cleaned || cleaned.length < 2) {
    return demoSuggestions.slice(0, 4);
  }

  const suggestions = [];

  demoSuggestions.forEach(item => {
    const itemText = normalizeText(item);
    if (itemText.includes(cleaned) || cleaned.includes(itemText)) {
      suggestions.push(item);
    }
  });

  return suggestions.slice(0, 5);
}

function getDidYouMean(query) {
  const cleaned = normalizeText(query || "");
  if (!cleaned) return null;

  if (typoMap[cleaned]) {
    return typoMap[cleaned];
  }

  const match = Object.keys(typoMap).find(key => key.includes(cleaned) || cleaned.includes(key));
  return match ? typoMap[match] : null;
}

function renderSuggestions(list) {
  const parent = searchInput.parentNode;
  let box = document.getElementById("searchSuggestions");

  if (!box) {
    box = document.createElement("div");
    box.id = "searchSuggestions";
    box.style.marginTop = "10px";
    box.style.display = "flex";
    box.style.flexWrap = "wrap";
    box.style.gap = "8px";
    parent.appendChild(box);
  }

  if (!list || !list.length) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = list
    .map(item => `
      <button
        type="button"
        class="suggestion-chip"
        data-value="${item}"
        style="
          border: 1px solid #d9d9d9;
          border-radius: 999px;
          background: #f5f5f5;
          padding: 7px 10px;
          cursor: pointer;
          font-size: 13px;
        "
      >
        ${item}
      </button>
    `)
    .join("");

  box.querySelectorAll(".suggestion-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      searchInput.value = btn.dataset.value;
      handleSearch();
    });
  });
}

function renderDidYouMean(query) {
  const parent = searchInput.parentNode;
  let box = document.getElementById("didYouMeanBox");

  if (!box) {
    box = document.createElement("div");
    box.id = "didYouMeanBox";
    box.style.marginTop = "10px";
    box.style.fontSize = "14px";
    box.style.color = "#555";
    parent.appendChild(box);
  }

  const suggestion = getDidYouMean(query);
  if (!suggestion) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = `
    <span>Did you mean </span>
    <button
      type="button"
      id="didYouMeanBtn"
      style="
        border: none;
        background: none;
        color: #1d4ed8;
        cursor: pointer;
        text-decoration: underline;
        font: inherit;
        padding: 0;
      "
    >
      ${suggestion}
    </button>
    ?
  `;

  const btn = document.getElementById("didYouMeanBtn");
  btn.addEventListener("click", () => {
    searchInput.value = suggestion;
    handleSearch();
  });
}


function getRecipeMatchMeta(recipe, query) {
  const terms = expandTerms(query);
  if (!terms.length) return "Best overall match";

  const titleText = normalizeText(recipe.title);
  const ingredientText = recipe.ingredients
    .map(item => normalizeText(item))
    .join(" ");
  const tagText = recipe.tags
    .map(item => normalizeText(item))
    .join(" ");

  const exactIngredientHit = recipe.ingredients.some(item => {
    const itemText = normalizeText(item);
    return terms.some(term => itemText.includes(term));
  });

  const titleHit = terms.some(term => titleText.includes(term));
  const tagHit = recipe.tags.some(tag => {
    const tagTextNormalized = normalizeText(tag);
    return terms.some(term => tagTextNormalized.includes(term));
  });

  if (exactIngredientHit) return "Exact ingredient match";
  if (titleHit) return "Title match";
  if (tagHit) return "Tag match";

  if (terms.some(term => ingredientText.includes(term) || tagText.includes(term))) {
    return "Fuzzy match";
  }

  return "Best overall match";
}

const fillerWords = new Set([
  'that', 'this', 'like', 'just', 'really', 'kind', 'kinda',
  'thing', 'thingy', 'stuff', 'lmao', 'idk', 'the', 'a', 'an',
  'some', 'sort', 'of', 'my', 'i', 'want', 'need', 'probably'
]);

const singularMap = {
  bananas: 'banana',
  banana: 'banana',
  brownies: 'brownie',
  brownie: 'brownie',
  eggs: 'egg',
  egg: 'egg',
  berries: 'berry',
  berry: 'berry',
  yogurts: 'yogurt',
  yogurt: 'yogurt',
  cheeses: 'cheese',
  cheese: 'cheese',
  apples: 'apple',
  apple: 'apple',
  pastas: 'pasta',
  pasta: 'pasta'
};

const synonymMap = {
  chocolate: ['chocolate', 'cocoa', 'cacao'],
  cocoa: ['chocolate', 'cocoa', 'cacao'],
  cacao: ['chocolate', 'cocoa', 'cacao'],
  yogurt: ['yogurt', 'greek yogurt'],
  'greek yogurt': ['yogurt', 'greek yogurt'],
  protein: ['protein', 'high protein'],
  dessert: ['dessert', 'cake', 'brownie', 'brownies'],
  snack: ['snack', 'bite', 'bites', 'treat'],
  apple: ['apple', 'apples'],
  apples: ['apple', 'apples']
};

function normalizeText(input) {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word && !fillerWords.has(word))
    .join(' ');
}

function normalizeWord(word) {
  const cleaned = (word || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  return singularMap[cleaned] || cleaned;
}

function expandTerms(input) {
  const baseTerms = normalizeText(input)
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);

  const expanded = new Set(baseTerms);

  baseTerms.forEach(term => {
    const variants = synonymMap[term] || [];
    variants.forEach(v => expanded.add(normalizeWord(v)));
  });

  return [...expanded];
}

function scoreRecipe(recipe, query) {
  const terms = expandTerms(query);
  if (!terms.length) return 0;

  let score = 0;

  const searchableText = [
    recipe.title,
    ...recipe.ingredients,
    ...recipe.tags
  ]
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .map(normalizeWord)
    .join(' ');

  const exactIngredientMatches = recipe.ingredients.filter(item => {
    const ingredientText = normalizeText(item);
    return terms.some(term => ingredientText.includes(term) || searchableText.includes(normalizeWord(term)));
  }).length;

  score += Math.min(exactIngredientMatches * 20, 20);

  const titleText = normalizeText(recipe.title);
  const titleHit = terms.some(term => titleText.includes(term));
  if (titleHit) score += 15;

  const tagMatchCount = recipe.tags.filter(tag => {
    const tagText = normalizeText(tag);
    return terms.some(term => tagText.includes(term));
  }).length;

  score += Math.min(tagMatchCount * 15, 15);

  const partialHits = terms.filter(term => searchableText.includes(normalizeWord(term))).length;
  score += Math.min(partialHits * 10, 20);

  if (terms.length > 1 && partialHits === terms.length) {
    score += 10;
  }

  return Math.min(score, 100);
}

function matchesRecipe(recipe, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return false;

  const expandedQueryTerms = expandTerms(query);

  const searchableText = [
    recipe.title,
    ...recipe.ingredients,
    ...recipe.tags
  ]
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .map(normalizeWord)
    .join(' ');

  return expandedQueryTerms.some(term => {
    const normalizedTerm = normalizeWord(term);
    return searchableText.includes(normalizedTerm);
  });
}

function handleSearch() {
  const query = searchInput.value;

  searchState.query = query;
  searchState.isEmpty = !query.trim();

  if (searchState.isEmpty) {
    renderSuggestions(getLikelySuggestions(""));
    renderDidYouMean("");
    renderEmptyState("Describe what you remember about the recipe you're thinking of, don't be shy.");
    return;
  }

  const suggestions = getLikelySuggestions(query);
  renderSuggestions(suggestions);

  const didYouMean = getDidYouMean(query);
  if (didYouMean) {
    renderDidYouMean(query);
  } else {
    const typoBox = document.getElementById("didYouMeanBox");
    if (typoBox) typoBox.innerHTML = "";
  }

  searchState.matches = recipes
    .map(recipe => ({ recipe, score: scoreRecipe(recipe, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.recipe);

  searchState.resultCount = searchState.matches.length;

  if (!searchState.resultCount) {
    renderEmptyState(
      "No exact match yet — try: banana dessert, protein snack, cheesy pasta"
    );
    return;
  }

  renderRecipeList(searchState.matches);
}

function renderEmptyState(message) {
  resultsDiv.innerHTML = `<p class="welcome-message">${message}</p>`;
}

function getRecipeMatchMeta(recipe, query) {
  const terms = expandTerms(query);
  if (!terms.length) return "Suggested match";

  const titleText = normalizeText(recipe.title);
  const ingredientText = recipe.ingredients
    .map(item => normalizeText(item))
    .join(" ");
  const tagText = recipe.tags
    .map(item => normalizeText(item))
    .join(" ");

  const exactIngredientHit = recipe.ingredients.some(item => {
    const itemText = normalizeText(item);
    return terms.some(term => itemText.includes(term));
  });

  const titleHit = terms.some(term => titleText.includes(term));
  const tagHit = recipe.tags.some(tag => {
    const tagTextNormalized = normalizeText(tag);
    return terms.some(term => tagTextNormalized.includes(term));
  });

  if (exactIngredientHit) return "Exact ingredient match";
  if (titleHit) return "Title match";
  if (tagHit) return "Category match";
  if (terms.some(term => ingredientText.includes(term) || tagText.includes(term))) return "Related match";
  return "Best match";
}

function renderRecipeCard(recipe, isBestMatch) {
  const matchMeta = getRecipeMatchMeta(recipe, searchInput.value);

  // ★★★ ADDED "BEST MATCH" LOGIC HERE ★★★
  let bestMatchHtml = '';
  if (isBestMatch) {
    bestMatchHtml = `<div class="match-tag">★ Best match</div>`;
  }

  return `
    <div class="recipe-card">
      ${bestMatchHtml}
      <p class="title">${recipe.title}</p>
      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
        ${matchMeta}
      </div>
      <a href="${recipe.url}" target="_blank">${recipe.source}</a>
      <p class="ingredients">${recipe.ingredients.join(', ')}</p>
      <span class="platform-tag ${recipe.platform}">
        <i class="fa-brands fa-${recipe.platform}"></i>
        ${recipe.platform.charAt(0).toUpperCase() + recipe.platform.slice(1)}
      </span>
    </div>
  `;
}

function renderRecipeList(matches) {
  resultsDiv.innerHTML = '';

  // ★★★ We pass 'true' for the first item (index 0) to mark it as Best Match ★★★
  matches.forEach((recipe, index) => {
    resultsDiv.innerHTML += renderRecipeCard(recipe, index === 0);
  });
}


searchInput.addEventListener('input', handleSearch);


// 
// Why the old version broke
// 
// The old script had a top-level filter block that used variables such as queryTerms
// before those variables were created. That caused a runtime error and stopped the page.
// The fix is to keep all dependent variables inside the functions that actually use them.
// 

// Default message when the page first loads.
resultsDiv.innerHTML = '<p class="welcome-message">Describe what you remember about the recipe you\'re thinking of, don\'t be shy.</p>';