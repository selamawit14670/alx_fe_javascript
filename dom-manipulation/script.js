// Post a new quote to the mock API server
async function postQuoteToServer(quote) {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    const result = await response.json();
    console.log("Posted quote:", result);
    notifyUser("Quote posted to server successfully!");
  } catch (error) {
    console.error("Error posting quote:", error);
    notifyUser("Failed to post quote to server.");
  }
}

// Modify the addQuote function to post the quote to server after adding locally
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Post new quote to server
  postQuoteToServer(newQuote);

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}
