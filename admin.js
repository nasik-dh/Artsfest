// ==========================================
// CONFIGURATION
// ==========================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7QSfhZ0Oq-Pu4wVUR6FapA5c_OKbYYlxEVF8mnJqMgKfWOmOGEi0yRWuc1v7O94lU/exec';

const SHEET_NAMES = {
    arakkal: 'ARAKKAL',
    marakkar: 'MARAKKAR',
    makhdoom: 'MAKHDOOM',
    candidates: 'TOTAL CANDIDATES',
    schedule: 'SCHEDULE',
    results: 'RESULT',
    teambase: 'TEAM BASE'
};

let currentSheet = 'arakkal';
let sheetData = {};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load initial data
    loadSheetData('arakkal');
    
    // Setup form submit handler
    document.getElementById('dataForm').addEventListener('submit', handleFormSubmit);
});

function isAuthenticated() {
    return localStorage.getItem('adminAuth') === 'true';
}

function logout() {
    localStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

// ==========================================
// TAB SWITCHING
// ==========================================

function switchTab(tabName) {
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    currentSheet = tabName;
    
    // Load data if not already loaded
    if (!sheetData[tabName]) {
        loadSheetData(tabName);
    }
}

// ==========================================
// DATA LOADING
// ==========================================

async function loadSheetData(sheetName) {
    showLoading(sheetName);
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAllData`);
        const result = await response.json();
        
        if (result.success) {
            const allData = result.data;
            const sheetKey = SHEET_NAMES[sheetName];
            sheetData[sheetName] = allData[sheetKey] || [];
            renderTable(sheetName, sheetData[sheetName]);
            showAlert('Data loaded successfully!', 'success');
        } else {
            throw new Error(result.message || 'Failed to load data');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Error loading data: ' + error.message, 'error');
    } finally {
        hideLoading(sheetName);
    }
}

function showLoading(sheetName) {
    const loading = document.getElementById(`loading-${sheetName}`);
    if (loading) loading.classList.add('show');
}

function hideLoading(sheetName) {
    const loading = document.getElementById(`loading-${sheetName}`);
    if (loading) loading.classList.remove('show');
}

// ==========================================
// TABLE RENDERING
// ==========================================

function renderTable(sheetName, data) {
    const tbody = document.querySelector(`#table-${sheetName} tbody`);
    if (!tbody) return;
    
    let html = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px;">No data available</td></tr>';
        return;
    }
    
    // Skip header row for display, but keep it in sheetData
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row.every(cell => cell === '')) continue; // Skip empty rows
        
        html += '<tr>';
        
        if (sheetName === 'arakkal' || sheetName === 'marakkar' || sheetName === 'makhdoom') {
            html += `
                <td class="editable-cell" data-row="${i}" data-col="0">${row[0] || ''}</td>
                <td class="editable-cell" data-row="${i}" data-col="1">${row[1] || ''}</td>
                <td class="editable-cell" data-row="${i}" data-col="2">${row[2] || 0}</td>
                <td class="editable-cell" data-row="${i}" data-col="3">${row[3] || 0}</td>
                <td class="editable-cell" data-row="${i}" data-col="4">${row[4] || 0}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteRow('${sheetName}', ${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        } else if (sheetName === 'candidates') {
            html += `
                <td class="editable-cell" data-row="${i}" data-col="0">${row[0] || ''}</td>
                <td class="editable-cell" data-row="${i}" data-col="1">${row[1] || ''}</td>
                <td class="editable-cell" data-row="${i}" data-col="2">${row[2] || ''}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteRow('${sheetName}', ${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        } else if (sheetName === 'schedule') {
            html += `
                <td class="editable-cell" data-row="${i}" data-col="0">${formatDate(row[0])}</td>
                <td class="editable-cell" data-row="${i}" data-col="1">${row[1] || ''}</td>
                <td class="editable-cell" data-row="${i}" data-col="2">${row[2] || ''}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteRow('${sheetName}', ${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        } else if (sheetName === 'results' || sheetName === 'teambase') {
            for (let j = 0; j < row.length; j++) {
                html += `<td class="editable-cell" data-row="${i}" data-col="${j}">${row[j] || ''}</td>`;
            }
        }
        
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
    
    // Add click handlers for editable cells
    setTimeout(() => {
        document.querySelectorAll('.editable-cell').forEach(cell => {
            cell.addEventListener('click', makeEditable);
        });
    }, 100);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return dateString;
    }
}

function makeEditable(e) {
    const cell = e.target;
    if (cell.querySelector('input')) return;
    
    const currentValue = cell.textContent;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cell-input';
    input.value = currentValue;
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();
    
    function saveValue() {
        const newValue = input.value;
        cell.textContent = newValue;
        updateCellData(currentSheet, row, col, newValue);
    }
    
    input.addEventListener('blur', saveValue);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveValue();
        }
    });
}

function updateCellData(sheetName, row, col, value) {
    if (sheetData[sheetName] && sheetData[sheetName][row]) {
        sheetData[sheetName][row][col] = value;
    }
}

// ==========================================
// SAVE DATA
// ==========================================

async function saveSheetData(sheetName) {
    if (!sheetData[sheetName]) {
        showAlert('No data to save', 'error');
        return;
    }
    
    showLoading(sheetName);
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=updateSheet&sheet=${SHEET_NAMES[sheetName]}&data=${encodeURIComponent(JSON.stringify(sheetData[sheetName]))}`);
        const result = await response.json();
        
        if (result.success) {
            showAlert('Data saved successfully!', 'success');
        } else {
            throw new Error(result.message || 'Failed to save data');
        }
    } catch (error) {
        console.error('Error saving data:', error);
        showAlert('Error saving data: ' + error.message, 'error');
    } finally {
        hideLoading(sheetName);
    }
}

// ==========================================
// ADD NEW ROW
// ==========================================

function openAddModal(sheetName) {
    currentSheet = sheetName;
    const modal = document.getElementById('dataModal');
    const modalTitle = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');
    
    modalTitle.textContent = `Add New Entry to ${SHEET_NAMES[sheetName]}`;
    
    let fieldsHTML = '';
    
    if (sheetName === 'arakkal' || sheetName === 'marakkar' || sheetName === 'makhdoom') {
        fieldsHTML = `
            <div class="form-group">
                <label>AD NO</label>
                <input type="number" name="adNo" required>
            </div>
            <div class="form-group">
                <label>NAME</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>STAGE</label>
                <input type="number" name="stage" value="0" required>
            </div>
            <div class="form-group">
                <label>NON-STAGE</label>
                <input type="number" name="nonStage" value="0" required>
            </div>
            <div class="form-group">
                <label>TOTAL</label>
                <input type="number" name="total" value="0" required>
            </div>
        `;
    } else if (sheetName === 'candidates') {
        fieldsHTML = `
            <div class="form-group">
                <label>AD NO</label>
                <input type="number" name="adNo" required>
            </div>
            <div class="form-group">
                <label>NAME</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>TEAM</label>
                <select name="team" required>
                    <option value="">Select Team</option>
                    <option value="ARAKKAL">ARAKKAL</option>
                    <option value="MARAKKAR">MARAKKAR</option>
                    <option value="MAKHDOOM">MAKHDOOM</option>
                </select>
            </div>
        `;
    } else if (sheetName === 'schedule') {
        fieldsHTML = `
            <div class="form-group">
                <label>DATE</label>
                <input type="date" name="date" required>
            </div>
            <div class="form-group">
                <label>TIME</label>
                <input type="time" name="time" required>
            </div>
            <div class="form-group">
                <label>EVENT</label>
                <input type="text" name="event" required>
            </div>
        `;
    }
    
    formFields.innerHTML = fieldsHTML;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('dataModal');
    modal.style.display = 'none';
    document.getElementById('dataForm').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    let newRow = [];
    
    if (currentSheet === 'arakkal' || currentSheet === 'marakkar' || currentSheet === 'makhdoom') {
        newRow = [
            formData.get('adNo'),
            formData.get('name'),
            formData.get('stage'),
            formData.get('nonStage'),
            formData.get('total')
        ];
    } else if (currentSheet === 'candidates') {
        newRow = [
            formData.get('adNo'),
            formData.get('name'),
            formData.get('team')
        ];
    } else if (currentSheet === 'schedule') {
        newRow = [
            formData.get('date'),
            formData.get('time'),
            formData.get('event')
        ];
    }
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=appendRow&sheet=${SHEET_NAMES[currentSheet]}&data=${encodeURIComponent(JSON.stringify(newRow))}`);
        const result = await response.json();
        
        if (result.success) {
            showAlert('New entry added successfully!', 'success');
            closeModal();
            loadSheetData(currentSheet);
        } else {
            throw new Error(result.message || 'Failed to add entry');
        }
    } catch (error) {
        console.error('Error adding entry:', error);
        showAlert('Error adding entry: ' + error.message, 'error');
    }
}

// ==========================================
// DELETE ROW
// ==========================================

async function deleteRow(sheetName, rowIndex) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    
    showLoading(sheetName);
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=deleteRow&sheet=${SHEET_NAMES[sheetName]}&row=${rowIndex}`);
        const result = await response.json();
        
        if (result.success) {
            showAlert('Entry deleted successfully!', 'success');
            loadSheetData(sheetName);
        } else {
            throw new Error(result.message || 'Failed to delete entry');
        }
    } catch (error) {
        console.error('Error deleting entry:', error);
        showAlert('Error deleting entry: ' + error.message, 'error');
    } finally {
        hideLoading(sheetName);
    }
}

// ==========================================
// ALERTS
// ==========================================

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('dataModal');
    if (event.target === modal) {
        closeModal();
    }
};
