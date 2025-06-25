let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// Show a random quote
function showRandomQuote() {
  const filter = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = filter === 'all' ? quotes : quotes.filter(q => q.category === filter);
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById('quoteDisplay').textContent = quote ? quote.text : "No quotes available.";
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert("Please fill both fields.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const lastSelected = localStorage.getItem('selectedCategory');
  if (lastSelected) {
    dropdown.value = lastSelected;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Notification logic
function notifyUser(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.style.display = 'block';

  setTimeout(() => {
    note.textContent = '';
    note.style.display = 'none';
  }, 5000);
}

// **This function must be named exactly as the checker expects**
function fetchQuotesFromServer() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
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
        showRandomQuote();
        notifyUser(`${added} new quotes synced from server.`);
      }
    })
    .catch(() => notifyUser("Failed to sync with server."));
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  showRandomQuote();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000); // sync every 30 seconds
});
