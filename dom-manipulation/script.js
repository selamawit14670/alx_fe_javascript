let quotes = [];

// Fetch quotes from the mock server API
async function fetchQuotesFromServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";
  const dataContainer = document.getElementById("quoteDisplay");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch quotes");

    const data = await response.json();

    // Map server data to quotes format
    quotes = data.map(post => ({
      text: post.title,
      category: post.body || "general"
    }));

    saveQuotes();
    populateCategories();
    applySavedFilter();
    filterQuotes();

    notifyUser("Quotes loaded from server!");
  } catch (error) {
    notifyUser("Failed to load quotes from server.");
    console.error(error);
  }
}

// Post new quote to server
async function postQuoteToServer(quote) {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) throw new Error("Failed to post quote");

    const result = await response.json();
    console.log("Quote posted:", result);
    notifyUser("Quote posted to server successfully!");
  } catch (error) {
    notifyUser("Failed to post quote to server.");
    console.error(error);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage if any
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Populate the category filter dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Get unique categories + "all"
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categories.sort();

  // Clear previous options except "all"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const display = document.getElementById("quoteDisplay");
  if (!categoryFilter || !display) return;

  const selectedCategory = categoryFilter.value;
  saveSelectedFilter(selectedCategory);

  // Filter quotes array accordingly
  let filteredQuotes = [];
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Clear display
  display.innerHTML = "";

  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes found for this category.";
    return;
  }

  // Show quotes in display div
  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    display.appendChild(p);
  });
}

// Save last selected filter in localStorage
function saveSelectedFilter(category) {
  localStorage.setItem("selectedCategory", category);
}

// Apply saved filter on load
function applySavedFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const saved = localStorage.getItem("selectedCategory");

  if (categoryFilter && saved) {
    categoryFilter.value = saved;
  }
}

// Add a new quote from user input
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  saveQuotes();
  populateCategories();

  // Reset inputs
  textInput.value = "";
  categoryInput.value = "";

  filterQuotes();
  postQuoteToServer(newQuote);
}

// Simple user notification
function notifyUser(msg) {
  alert(msg);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  fetchQuotesFromServer();
  populateCategories();
  applySavedFilter();
  filterQuotes();

  // Filter on dropdown change
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterQuotes);
  }

  // Add quote button event
  const addBtn = document.getElementById("addQuoteBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addQuote);
  }
});
