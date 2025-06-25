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
    quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote();
    } else {
      alert("Please enter both quote text and category.");
    }
  }

  function createAddQuoteForm() {
    const addButton = document.getElementById('addQuote');
    addButton.addEventListener('click', addQuote);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  createAddQuoteForm(); // Required function name

  showRandomQuote(); // Show one on load
});
