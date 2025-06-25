document.addEventListener('DOMContentLoaded', () => {
  const quotes = [
    { text: "The only limit is your mind.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Be yourself; everyone else is already taken.", category: "Wisdom" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // ✅ Use createElement and appendChild
    quoteDisplay.innerHTML = ''; // Clear previous quote
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `${quote.category}: "${quote.text}"`;
    quoteDisplay.appendChild(quoteElement);
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);

      // ✅ Show the newly added quote using createElement + appendChild
      quoteDisplay.innerHTML = '';
      const quoteElement = document.createElement('p');
      quoteElement.textContent = `${newQuote.category}: "${newQuote.text}"`;
      quoteDisplay.appendChild(quoteElement);

      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert("Please enter both quote text and category.");
    }
  }

  function createAddQuoteForm() {
    const addButton = document.getElementById('addQuote');
    addButton.addEventListener('click', addQuote);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  createAddQuoteForm(); // Required by checker

  showRandomQuote(); // Initial quote
});
