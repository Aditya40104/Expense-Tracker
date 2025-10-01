# Personal Expense Tracker

A simple and elegant web application to track your personal income and expenses, built with HTML, CSS, JavaScript, and localStorage.

## Features

### 💰 Transaction Management
- Add income and expense transactions
- Categorize transactions (Salary, Groceries, Entertainment, etc.)
- Multiple payment methods (Cash, Credit Card, Bank Transfer, etc.)
- Add descriptions and dates
- Delete transactions

### 📊 Financial Overview
- Real-time balance calculation
- Total income and expenses summary
- Visual balance indicators (green for positive, red for negative)

### 🔍 Filtering & Search
- Filter by transaction type (Income/Expense)
- Filter by category
- Filter by month
- Clear all filters option

### 📈 Reports & Analytics
- **Category Breakdown**: See spending by category with percentages
- **Monthly Trends**: Compare income vs expenses across months
- **Top 5 Categories**: Visual bars showing biggest expense categories

### 📱 User Experience
- Responsive design (works on desktop and mobile)
- Modern, clean interface
- Smooth animations and transitions
- Form validation
- Success/error messages
- Auto-saves data to browser

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (browser storage)
- **Icons**: Font Awesome
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Hosting**: Can be deployed on GitHub Pages

## Data Structure

### Transaction Object
```javascript
{
    id: 1,
    amount: 150.75,
    type: 'expense',
    category: 'groceries',
    paymentMethod: 'credit-card',
    date: '2025-10-01',
    description: 'Weekly grocery shopping',
    timestamp: '2025-10-01T10:30:00.000Z'
}
```

### Categories
**Income Categories:**
- Salary, Freelance, Business, Investment, Gift, Other Income

**Expense Categories:**
- Groceries, Transportation, Entertainment, Utilities, Healthcare, Shopping, Dining Out, Education, Insurance, Other Expense

### Payment Methods
- Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet

## Getting Started

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Start adding your transactions!

## Deployment on GitHub Pages

1. Create a new repository on GitHub
2. Upload all project files (index.html, styles.css, script.js, README.md)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" → "main" → "/ (root)"
5. Your app will be live at `https://username.github.io/repository-name`

## Project Structure

```
expense-tracker/
├── index.html          # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality and localStorage
└── README.md           # Project documentation
```

## Features Overview

### Dashboard
- Clean, modern interface with balance cards
- Real-time updates when adding/deleting transactions
- Color-coded amounts (green for income, red for expenses)

### Add Transaction Form
- Intuitive form with validation
- Dynamic category dropdown based on transaction type
- Date picker with today's date as default
- Optional description field

### Transaction List
- Chronological list (newest first)
- Icons and color coding for easy identification
- Delete functionality with confirmation
- Responsive design for mobile devices

### Reports Section
- **Category Chart**: Visual breakdown of spending by category
- **Monthly Trends**: Month-by-month income vs expense comparison
- Automatically updates as you add more data

### Filtering System
- Filter by type, category, or month
- Real-time filtering without page reload
- Clear filters option to reset view

## Data Persistence

- All data is stored in the browser's localStorage
- Data persists between browser sessions
- No external database required
- Data is lost only if browser cache is cleared

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Future Enhancements

Potential features that could be added:
- Export data to CSV/Excel
- Import transactions from bank statements
- Budget setting and alerts
- More detailed charts and graphs
- Data backup/restore functionality
- Multiple currencies support

## License

This project is open source and available under the MIT License.

---

**Note**: This application uses localStorage, so your data is stored locally in your browser. Make sure to backup your data if needed, as clearing browser data will remove all transactions.