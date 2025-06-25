let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
  displayQuotes(quotes);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display quotes in the DOM
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  quotesToDisplay.forEach(quote => {
    const p = document.createElement('p');
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  });
}

// Add a new quote from user input
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim(),
  };

  if (newQuote.text === '' || newQuote.category === '') {
    alert('Please enter both quote and category.');
    return;
  }

  quotes.push(newQuote);
  saveQuotes();
  displayQuotes(quotes);
  postQuoteToServer(newQuote);

  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
}

// Fetch quotes from the mock server
async function fetchQuotesFromServer() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with real or mock endpoint for quotes
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const serverQuotes = await response.json();

    // Example assumes serverQuotes is an array of quote objects like {text: ..., category: ...}
    // You may need to adjust depending on the actual API response structure
    // Merge server quotes with local quotes, prioritizing server data:
    const mergedQuotes = [...quotes];

    serverQuotes.forEach(sq => {
      // Simple merge logic: add if not already in local quotes (by text+category)
      const exists = mergedQuotes.some(
        q => q.text === sq.text && q.category === sq.category
      );
      if (!exists) {
        mergedQuotes.push(sq);
      }
    });

    quotes = mergedQuotes;
    saveQuotes();
    displayQuotes(quotes);
  } catch (error) {
    console.error('Failed to fetch quotes from server:', error);
  }
}

// Post a new quote to the mock server
async function postQuoteToServer(quote) {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with real or mock endpoint for posting

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    console.log('Quote posted successfully:', result);
  } catch (error) {
    console.error('Failed to post quote to server:', error);
  }
}

// Sync quotes initially by fetching from server
function syncQuotes() {
  fetchQuotesFromServer();
}

// Periodically fetch new quotes every 5 minutes (300000 ms)
function startPeriodicFetch() {
  // Fetch immediately once on start
  fetchQuotesFromServer();

  // Then repeat every 5 minutes
  setInterval(fetchQuotesFromServer, 300000);
}

// Initialize app on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  syncQuotes();
  startPeriodicFetch();
});

// Expose addQuote to global scope if used inline in HTML
window.addQuote = addQuote;
