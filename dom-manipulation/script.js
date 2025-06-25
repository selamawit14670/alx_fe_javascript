let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspirational" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" },
  { text: "So many books, so little time.", category: "Books" }
];

// Load quotes from localStorage or use defaults
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  displayQuotes(quotes);
  populateCategories();
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display quotes in the DOM
function displayQuotes(displayedQuotes) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  if (displayedQuotes.length === 0) {
    container.textContent = "No quotes to display.";
    return;
  }
  displayedQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `${q.text} — ${q.category}`;
    container.appendChild(p);
  });
}

// Populate categories dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;
  
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;
  
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// Add a new quote from inputs and update storage & UI
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Clear inputs
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
}

// Notify user with a simple alert or custom notification (you can improve this)
function notifyUser(message) {
  console.log(message); // For now, just log to console
  // You can replace this with better UI notifications if desired
}

// Async function to fetch quotes from mock server
async function fetchQuotesFromServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Example mock API
  try {
    const response = await fetch(apiUrl);
    const serverData = await response.json();

    // Example: Map server data to quotes format (simulate)
    // Assuming serverData is an array of posts with title as quote text
    // You might want to adjust based on real API structure
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server Quote"
    }));

    // Conflict resolution: server data takes precedence
    quotes = serverQuotes;
    saveQuotes();
    filterQuotes();
    notifyUser("Quotes updated from server.");
  } catch (error) {
    notifyUser("Failed to load quotes from server.");
  }
}

// Function to sync quotes periodically
async function syncQuotes() {
  try {
    await fetchQuotesFromServer();
    notifyUser("Quotes synchronized with server.");
  } catch (error) {
    notifyUser("Failed to synchronize quotes.");
  }
}

// Setup event listeners and initial load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterQuotes);
  }

  const addBtn = document.getElementById("addQuoteBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addQuote);
  }

  // Start periodic syncing every 60 seconds
  setInterval(syncQuotes, 60000);
});
