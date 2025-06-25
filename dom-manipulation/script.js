let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
];

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  showRandomQuote();
  restoreFilter();
});

// ✅ Show random quote
function showRandomQuote() {
  const category = document.getElementById('categoryFilter').value;
  const filteredQuotes = (category === 'all') ? quotes : quotes.filter(q => q.category === category);
  if (filteredQuotes.length === 0) return document.getElementById('quoteDisplay').textContent = "No quotes available.";

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById('quoteDisplay').textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// ✅ Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Populate categories dropdown
function populateCategories() {
  const categorySet = new Set(quotes.map(q => q.category));
  const select = document.getElementById('categoryFilter');

  select.innerHTML = `<option value="all">All Categories</option>`;
  categorySet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // restore last filter
  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) select.value = savedFilter;
}

// ✅ Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// ✅ Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error();
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}
