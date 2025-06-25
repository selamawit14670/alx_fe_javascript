let quotes = [];

// Load quotes from localStorage on page load
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "To be or not to be.", category: "Philosophy" },
      { text: "I think, therefore I am.", category: "Philosophy" }
    ];
    saveQuotes();
  }
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display notification message to user (simple example)
function notifyUser(message) {
  alert(message); // replace with nicer UI in real app
}

// Fetch quotes from mock API server
async function fetchQuotesFromServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // mock API endpoint
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serverQuotes = await response.json();
    // For simulation, just log or do merging logic here
    // In real app: merge serverQuotes with local quotes array, server data takes precedence
    console.log("Fetched from server:", serverQuotes);
    notifyUser("Quotes fetched from server.");
  } catch (error) {
    console.error("Fetch error:", error);
    notifyUser("Failed to fetch quotes from server.");
  }
}

// Post local quotes to the server (mock API)
async function postQuotesToServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // mock API endpoint
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(quotes)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    notifyUser("Quotes posted to server successfully.");
    console.log("Server response:", result);
    return result;
  } catch (error) {
    console.error("Post error:", error);
    notifyUser("Failed to post quotes to server.");
  }
}

// Sync quotes: fetch from server and then post local quotes
async function syncQuotes() {
  try {
    await fetchQuotesFromServer();
    await postQuotesToServer();
    notifyUser("Quotes synchronized successfully.");
  } catch (error) {
    console.error("Sync error:", error);
    notifyUser("Failed to synchronize quotes.");
  }
}

// Initialize app on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  syncQuotes();
});
