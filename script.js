// Global variables and data structure
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;

// Categories for income and expenses
const categories = {
    income: [
        'Salary',
        'Freelance',
        'Business',
        'Investment',
        'Gift',
        'Other Income'
    ],
    expense: [
        'Groceries',
        'Transportation',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Shopping',
        'Dining Out',
        'Education',
        'Insurance',
        'Other Expense'
    ]
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Initialize form event listeners
    setupFormListeners();
    
    // Initialize filter listeners
    setupFilterListeners();
    
    // Load and display existing data
    updateSummary();
    displayTransactions();
    generateReports();
    populateFilterOptions();
}

function setupFormListeners() {
    const form = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('type');
    
    // Handle type change to update categories
    typeSelect.addEventListener('change', updateCategories);
    
    // Handle form submission
    form.addEventListener('submit', handleFormSubmit);
}

function setupFilterListeners() {
    const filterType = document.getElementById('filterType');
    const filterCategory = document.getElementById('filterCategory');
    const filterMonth = document.getElementById('filterMonth');
    const clearFilters = document.getElementById('clearFilters');
    
    filterType.addEventListener('change', applyFilters);
    filterCategory.addEventListener('change', applyFilters);
    filterMonth.addEventListener('change', applyFilters);
    clearFilters.addEventListener('click', clearAllFilters);
}

function updateCategories() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    
    // Clear existing options
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (type && categories[type]) {
        categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase().replace(/\s+/g, '-');
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const transaction = {
        id: nextId++,
        amount: parseFloat(formData.get('amount')),
        type: formData.get('type'),
        category: formData.get('category'),
        paymentMethod: formData.get('paymentMethod'),
        date: formData.get('date'),
        description: formData.get('description') || '',
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!transaction.amount || !transaction.type || !transaction.category || !transaction.paymentMethod || !transaction.date) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Add transaction
    transactions.push(transaction);
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('nextId', nextId.toString());
    
    // Reset form
    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('category').innerHTML = '<option value="">Select Category</option>';
    
    // Update displays
    updateSummary();
    displayTransactions();
    generateReports();
    populateFilterOptions();
    
    // Show success message
    showMessage('Transaction added successfully!', 'success');
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });
    
    const totalBalance = totalIncome - totalExpenses;
    
    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `$${totalBalance.toFixed(2)}`;
    
    // Update balance color
    const balanceElement = document.getElementById('totalBalance');
    if (totalBalance >= 0) {
        balanceElement.style.color = '#27ae60';
    } else {
        balanceElement.style.color = '#e74c3c';
    }
}

function displayTransactions(filteredTransactions = null) {
    const transactionsList = document.getElementById('transactionsList');
    const transactionsToShow = filteredTransactions || transactions;
    
    if (transactionsToShow.length === 0) {
        transactionsList.innerHTML = '<p class="no-transactions">No transactions found.</p>';
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactionsToShow].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    transactionsList.innerHTML = sortedTransactions.map(transaction => {
        const categoryName = getCategoryDisplayName(transaction.category);
        const paymentMethodName = getPaymentMethodDisplayName(transaction.paymentMethod);
        const icon = transaction.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        
        return `
            <div class="transaction-item">
                <div class="transaction-icon ${transaction.type}">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${categoryName}</h4>
                    <p>${transaction.description || 'No description'}</p>
                    <p><strong>Date:</strong> ${formatDate(transaction.date)} | <strong>Method:</strong> ${paymentMethodName}</p>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-danger btn-small" onclick="deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        updateSummary();
        displayTransactions();
        generateReports();
        populateFilterOptions();
        
        showMessage('Transaction deleted successfully!', 'success');
    }
}

function populateFilterOptions() {
    // Populate category filter
    const filterCategory = document.getElementById('filterCategory');
    const existingCategories = [...new Set(transactions.map(t => t.category))];
    
    filterCategory.innerHTML = '<option value="">All Categories</option>';
    existingCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = getCategoryDisplayName(category);
        filterCategory.appendChild(option);
    });
    
    // Populate month filter
    const filterMonth = document.getElementById('filterMonth');
    const existingMonths = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();
    
    filterMonth.innerHTML = '<option value="">All Months</option>';
    existingMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = formatMonth(month);
        filterMonth.appendChild(option);
    });
}

function applyFilters() {
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const filterMonth = document.getElementById('filterMonth').value;
    
    let filtered = transactions;
    
    if (filterType) {
        filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (filterCategory) {
        filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    if (filterMonth) {
        filtered = filtered.filter(t => t.date.startsWith(filterMonth));
    }
    
    displayTransactions(filtered);
}

function clearAllFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterMonth').value = '';
    displayTransactions();
}

function generateReports() {
    generateCategoryChart();
    generateMonthlyTrends();
    generatePieChart();
}

function generateCategoryChart() {
    const chartContainer = document.getElementById('categoryChart');
    
    // Calculate expenses by category
    const categoryTotals = {};
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const category = getCategoryDisplayName(transaction.category);
            categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
            totalExpenses += transaction.amount;
        }
    });
    
    if (totalExpenses === 0) {
        chartContainer.innerHTML = '<div class="no-data-message"><i class="fas fa-chart-bar"></i><p>Add some expenses to see the breakdown</p></div>';
        return;
    }
    
    // Sort categories by amount (show all categories, not just top 5)
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a);
    
    chartContainer.innerHTML = sortedCategories.map(([category, amount]) => {
        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
        const barWidth = Math.max(percentage, 5); // Minimum 5% width for visibility
        
        return `
            <div class="category-item">
                <div class="category-info">
                    <span class="category-name">${category}</span>
                    <span class="category-amount">$${amount.toFixed(2)} (${percentage}%)</span>
                </div>
                <div class="category-bar" style="width: ${barWidth}%"></div>
            </div>
        `;
    }).join('');
}

function generateMonthlyTrends() {
    const trendsContainer = document.getElementById('monthlyTrends');
    
    // Group transactions by month
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expenses: 0 };
        }
        
        if (transaction.type === 'income') {
            monthlyData[month].income += transaction.amount;
        } else {
            monthlyData[month].expenses += transaction.amount;
        }
    });
    
    if (Object.keys(monthlyData).length === 0) {
        trendsContainer.innerHTML = '<div class="no-data-message"><i class="fas fa-chart-line"></i><p>Add transactions to see monthly trends</p></div>';
        return;
    }
    
    // Sort months and display
    const sortedMonths = Object.entries(monthlyData).sort(([a], [b]) => b.localeCompare(a));
    
    trendsContainer.innerHTML = sortedMonths.map(([month, data]) => {
        const balance = data.income - data.expenses;
        const balanceClass = balance >= 0 ? 'positive' : 'negative';
        
        return `
            <div class="trend-item">
                <div class="trend-month">${formatMonth(month)}</div>
                <div class="trend-amounts">
                    <span class="trend-income">Income: $${data.income.toFixed(2)}</span>
                    <span class="trend-expense">Expenses: $${data.expenses.toFixed(2)}</span>
                    <span class="trend-balance ${balanceClass}">Balance: $${balance.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function generatePieChart() {
    const canvas = document.getElementById('expensePieChart');
    const legendContainer = document.getElementById('pieChartLegend');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Calculate expenses by category
    const categoryTotals = {};
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const category = getCategoryDisplayName(transaction.category);
            categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
            totalExpenses += transaction.amount;
        }
    });
    
    if (totalExpenses === 0) {
        // Clear canvas and show no data message
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        legendContainer.innerHTML = '<div class="no-data-message"><i class="fas fa-chart-pie"></i><p>Add some expenses to see the pie chart</p></div>';
        return;
    }
    
    // Color palette for pie slices
    const colors = [
        '#c03c15', // rust
        '#eaac8a', // tumbleweed
        '#a5270f', // rufous
        '#4fab9a', // polished pine
        '#bed4d9', // columbia blue
        '#504450', // quartz
        '#ff6b8a', // additional colors
        '#4ecdc4',
        '#45b7d1',
        '#f9ca24'
    ];
    
    // Sort categories by amount
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pie slices
    let currentAngle = -Math.PI / 2; // Start from top
    
    sortedCategories.forEach(([category, amount], index) => {
        const sliceAngle = (amount / totalExpenses) * 2 * Math.PI;
        const color = colors[index % colors.length];
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add slice border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Generate legend
    legendContainer.innerHTML = sortedCategories.map(([category, amount], index) => {
        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
        const color = colors[index % colors.length];
        
        return `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${category}: ${percentage}%</span>
            </div>
        `;
    }).join('');
}

// Helper functions
function getCategoryDisplayName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getPaymentMethodDisplayName(method) {
    return method.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatMonth(monthString) {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the form section
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(messageDiv, formSection.firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add some sample data for demonstration (only if no data exists)
function addSampleData() {
    if (transactions.length === 0) {
        const sampleTransactions = [
            {
                id: 1,
                amount: 3000,
                type: 'income',
                category: 'salary',
                paymentMethod: 'bank-transfer',
                date: '2025-10-01',
                description: 'Monthly salary',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                amount: 150.75,
                type: 'expense',
                category: 'groceries',
                paymentMethod: 'credit-card',
                date: '2025-10-01',
                description: 'Weekly grocery shopping',
                timestamp: new Date().toISOString()
            },
            {
                id: 3,
                amount: 45.20,
                type: 'expense',
                category: 'transportation',
                paymentMethod: 'debit-card',
                date: '2025-09-30',
                description: 'Gas fill-up',
                timestamp: new Date().toISOString()
            }
        ];
        
        transactions = sampleTransactions;
        nextId = 4;
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('nextId', nextId.toString());
        
        updateSummary();
        displayTransactions();
        generateReports();
        populateFilterOptions();
    }
}

// Uncomment the line below to add sample data on first load
addSampleData();
