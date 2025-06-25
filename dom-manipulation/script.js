document.addEventListener('DOMContentLoaded', () => {
  let quotes = [];

  // Load from localStorage
  function loadQuotes() {
    const saved = localStorage.getItem('quotes');
    if (saved) {
      quotes = JSON.parse(saved);
    } else {
      quotes = [
        { text: "The only limit is your mind.", category: "Motivation" },
        { text: "Be yourself; everyone else is already taken.", category: "Wisdom" }
      ];
      saveQuotes(); // Save defaults
    }
  }

  // Save to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = `${quote.category}: "${quote.text}"`;
    quoteDisplay.appendChild(p);

    // Optional: Save last quote to sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  // Add new quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      showRandomQuote();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please fill both quote and category.');
    }
  }

  // Export quotes as JSON
  function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Import from JSON file
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          quotes.push(...imported);
          saveQuotes();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format.');
        }
      } catch {
        alert('Error reading file.');
      }
    };
    reader.readAsText(file);
  }

  // Event bindings
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
  document.getElementById('exportJson').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  // Load quotes and show first one
  loadQuotes();
  showRandomQuote();
});
