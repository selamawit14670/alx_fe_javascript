# Dynamic Quote Generator

A JavaScript-based application that allows users to:

- Display random quotes
- Filter by categories
- Add new quotes dynamically
- Save quotes using `localStorage`
- Sync quotes with a simulated server (JSONPlaceholder)
- Automatically resolve quote conflicts
- Notify user of sync updates

## Features

- DOM Manipulation (Create, Append, Filter)
- Web Storage (localStorage)
- Fetch API Integration
- Basic Conflict Resolution
- Real-time Notifications

## Syncing
Quotes are periodically synced from a mock server using:
`https://jsonplaceholder.typicode.com/posts`

New quotes from the server are automatically added without duplication.

---

## Run Locally

Simply open `index.html` in your browser.
