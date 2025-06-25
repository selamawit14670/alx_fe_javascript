let quotes = [];

// Create or select notification div for messages
function getNotificationDiv() {
  let notifDiv = document.getElementById('notification');
  if (!notifDiv) {
    notifDiv = document.createElement('div');
    notifDiv.id = 'notification';
    notifDiv.style.position = 'fixed';
    notifDiv.style.top = '10px';
    notifDiv.style.right = '10px';
    notifDiv.style.padding = '10px 20px';
    notifDiv.style.backgroundColor = '#28a745';
    notifDiv.style.color = 'white';
    notifDiv.style.borderRadius = '5px';
    notifDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    notifDiv.style.display = 'none';
    document.body.appendChild(notifDiv);
  }
  return notifDiv;
}

// Show notification message temporarily
function showNotification(message, duration = 3000) {
  const notifDiv = getNotificationDiv();
  notifDiv.textContent = message;
  notifDiv.style.display = 'block';

  setTimeout(() => {
    notifDiv.style.display = 'none';
  }, duration);
}

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

  textInput.value = '';
  categoryInput.value = '';

  showNotification('Quote added and synced with server!');
}

// Fetch quotes from the mock server
async function fetchQuotesFromServer() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with actual API
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const serverQuotes = await response.json();

    const mergedQuotes = [...quotes];

    serverQuotes.forEach(sq => {
      const exists = mergedQuotes.some(
        q => q.text === sq.text && q.category === sq.category
      );
      if (!exists) {
        mergedQuotes.push(sq);
      }
    });

    // Check if quotes changed
    if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
      quotes = mergedQuotes;
      saveQuotes();
      displayQuotes(quotes);
      showNotification('Quotes synced with server!');
    }
  } catch (error) {
    console.error('Failed to fetch quotes from server:', error);
    showNotification('Failed to sync quotes with server.', 4000);
  }
}

// Post a new quote to the mock server
async function postQuoteToServer(quote) {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with real API

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
    showNotification('Failed to post quote to server.', 4000);
  }
}

// Sync quotes initially by fetching from server
function syncQuotes() {
  fetchQuotesFromServer();
}

// Periodically fetch new quotes every 5 minutes
function startPeriodicFetch() {
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 300000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  syncQuotes();
  startPeriodicFetch();
});

window.addQuote = addQuote;
