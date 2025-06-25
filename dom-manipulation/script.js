let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Show a random quote from the current list
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Populate categories dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const lastCategory = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastCategory;
  filterQuotes();
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  let filteredQuotes;

  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  }
}

// Add a new quote from inputs
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// Notify user with a temporary message
function notifyUser(message) {
  const notification = document.getElementById("notification");
  if (!notification) {
    const newNotification = document.createElement("div");
    newNotification.id = "notification";
    newNotification.style.position = "fixed";
    newNotification.style.bottom = "10px";
    newNotification.style.right = "10px";
    newNotification.style.backgroundColor = "#333";
    newNotification.style.color = "white";
    newNotification.style.padding = "10px 15px";
    newNotification.style.borderRadius = "5px";
    document.body.appendChild(newNotification);
    setTimeout(() => newNotification.remove(), 3000);
    newNotification.textContent = message;
  } else {
    notification.textContent = message;
    clearTimeout(notification.timeout);
    notification.timeout = setTimeout(() => notification.remove(), 3000);
  }
}

// Async function to fetch quotes from mock API and sync with local quotes
async function fetchQuotesFromServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Map server data to quote format and take only first 5 posts
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    let added = 0;
    serverQuotes.forEach(sq => {
      const exists = quotes.some(q => q.text === sq.text && q.category === sq.category);
      if (!exists) {
        quotes.push(sq);
        added++;
      }
    });

    if (added > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser(`${added} new quotes synced from server.`);
    }
  } catch (error) {
    notifyUser("Failed to sync with server.");
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  document.getElementById("newQuoteButton").addEventListener("click", addQuote);

  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

  // Periodically sync with server every 60 seconds
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 60000);
});
