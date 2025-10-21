// ==========================================
// GOOGLE SHEETS DATA FETCHING
// ==========================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7QSfhZ0Oq-Pu4wVUR6FapA5c_OKbYYlxEVF8mnJqMgKfWOmOGEi0yRWuc1v7O94lU/exec';

let teamsData = {};
let allCandidates = [];
let scheduleData = [];
let resultsData = {};
let teamBaseData = {};

// Load all data from Google Sheets
async function loadAllData() {
    try {
        showLoading();
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAllData`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            // Process teams data
            teamsData = {
                arakkal: {
                    name: 'ARAKKAL',
                    members: processTeamMembers(data['ARAKKAL'])
                },
                marakkar: {
                    name: 'MARAKKAR',
                    members: processTeamMembers(data['MARAKKAR'])
                },
                makhdoom: {
                    name: 'MAKHDOOM',
                    members: processTeamMembers(data['MAKHDOOM'])
                }
            };
            
            // Process candidates
            allCandidates = processCandidates(data['TOTAL CANDIDATES']);
            
            // Process schedule
            scheduleData = processSchedule(data['SCHEDULE']);
            
            // Process team base
            teamBaseData = processTeamBase(data['TEAM BASE']);
            
            // Process results
            resultsData = processResults(data['RESULT']);
            
            // Update UI
            updateAllSections();
            
            hideLoading();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        hideLoading();
        showError('Error loading data. Please refresh the page.');
    }
}

function processTeamMembers(data) {
    // Skip header row
    return data.slice(1).map(row => ({
        adNo: parseInt(row[0]) || 0,
        name: row[1] || '',
        stageCount: parseInt(row[2]) || 0,
        nonStageCount: parseInt(row[3]) || 0,
        total: parseInt(row[4]) || 0
    }));
}

function processCandidates(data) {
    // Skip header row
    return data.slice(1).map(row => ({
        adNo: parseInt(row[0]) || 0,
        name: row[1] || '',
        team: row[2] || ''
    }));
}

function processSchedule(data) {
    // Skip header row
    return data.slice(1).map(row => ({
        date: row[0] || '',
        time: row[1] || '',
        event: row[2] || ''
    }));
}

function processTeamBase(data) {
    const result = {};
    // Skip header row
    data.slice(1).forEach(row => {
        const team = (row[0] || '').toLowerCase();
        if (team) {
            result[team] = {
                stagePoints: parseInt(row[1]) || 0,
                nonStagePoints: parseInt(row[2]) || 0,
                groupGeneral: parseInt(row[3]) || 0,
                totalPoints: parseInt(row[4]) || 0,
                percentage: parseFloat(row[5]) || 0
            };
        }
    });
    return result;
}

function processResults(data) {
    // Skip header row
    return data.slice(1).map(row => ({
        rank: parseInt(row[0]) || 0,
        team: row[1] || '',
        stagePoints: parseInt(row[2]) || 0,
        nonStagePoints: parseInt(row[3]) || 0,
        groupGeneral: parseInt(row[4]) || 0,
        totalPoints: parseInt(row[5]) || 0,
        percentage: parseFloat(row[6]) || 0
    }));
}

function showLoading() {
    let loader = document.getElementById('loadingOverlay');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingOverlay';
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                        justify-content: center; z-index: 9999;">
                <div style="text-align: center; color: white;">
                    <div style="border: 8px solid #f3f3f3; border-top: 8px solid #2563eb; 
                                border-radius: 50%; width: 60px; height: 60px; 
                                animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p style="font-size: 1.2rem;">Loading data...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }
}

function hideLoading() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) loader.remove();
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function updateAllSections() {
    updateTeamCards();
    updateTeamRankings();
    updateCandidates();
    updateSchedule();
    updateResults();
    updateChart();
}

function updateTeamCards() {
    const teams = ['arakkal', 'marakkar', 'makhdoom'];
    teams.forEach(team => {
        const card = document.querySelector(`.team-card[data-team="${team}"]`);
        if (card && teamBaseData[team]) {
            const data = teamBaseData[team];
            const stats = card.querySelectorAll('.stat-value');
            if (stats[0]) stats[0].textContent = teamsData[team].members.length;
            if (stats[1]) stats[1].textContent = data.totalPoints;
            if (stats[2]) stats[2].textContent = data.percentage.toFixed(2) + '%';
        }
    });
}

function updateTeamRankings() {
    const sortedTeams = Object.entries(teamBaseData)
        .map(([key, data]) => ({
            team: key.toUpperCase(),
            ...data
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);
    
    const podiumItems = document.querySelectorAll('.podium-item');
    if (podiumItems.length >= 3 && sortedTeams.length >= 3) {
        // First place (middle)
        const first = podiumItems[1];
        first.querySelector('h4').textContent = sortedTeams[0].team;
        first.querySelector('.podium-score').textContent = sortedTeams[0].totalPoints + ' Points';
        first.querySelector('.podium-percentage').textContent = sortedTeams[0].percentage.toFixed(2) + '%';
        
        // Second place (left)
        const second = podiumItems[0];
        second.querySelector('h4').textContent = sortedTeams[1].team;
        second.querySelector('.podium-score').textContent = sortedTeams[1].totalPoints + ' Points';
        second.querySelector('.podium-percentage').textContent = sortedTeams[1].percentage.toFixed(2) + '%';
        
        // Third place (right)
        const third = podiumItems[2];
        third.querySelector('h4').textContent = sortedTeams[2].team;
        third.querySelector('.podium-score').textContent = sortedTeams[2].totalPoints + ' Points';
        third.querySelector('.podium-percentage').textContent = sortedTeams[2].percentage.toFixed(2) + '%';
    }
}

function updateSchedule() {
    if (scheduleData.length === 0) return;
    
    const scheduleTimeline = document.querySelector('.schedule-timeline');
    if (!scheduleTimeline) return;
    
    // Group events by date
    const eventsByDate = {};
    scheduleData.forEach(event => {
        const date = event.date;
        if (date) {
            if (!eventsByDate[date]) {
                eventsByDate[date] = [];
            }
            eventsByDate[date].push(event);
        }
    });
    
    // Generate HTML
    let html = '';
    Object.entries(eventsByDate).forEach(([date, events]) => {
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const dayNum = dateObj.getDate();
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        
        html += `
            <div class="schedule-day">
                <div class="day-header">
                    <div class="day-date">
                        <span class="date-num">${dayNum}</span>
                        <span class="date-month">${month}</span>
                    </div>
                    <div class="day-info">
                        <h3>${dayName}</h3>
                        <p>${date}</p>
                    </div>
                </div>
                <div class="day-events">
        `;
        
        events.forEach(evt => {
            html += `
                <div class="schedule-event">
                    <span class="event-time">${evt.time}</span>
                    <span class="event-name">${evt.event}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    scheduleTimeline.innerHTML = html;
}

function updateResults() {
    const tbody = document.querySelector('.results-table tbody');
    if (!tbody || resultsData.length === 0) return;
    
    const sortedResults = resultsData.sort((a, b) => a.rank - b.rank);
    
    let html = '';
    sortedResults.forEach(result => {
        const rankClass = result.rank === 1 ? 'gold' : result.rank === 2 ? 'silver' : result.rank === 3 ? 'bronze' : '';
        const rankLabel = result.rank === 1 ? '1st' : result.rank === 2 ? '2nd' : result.rank === 3 ? '3rd' : result.rank + 'th';
        
        html += `
            <tr class="rank-${result.rank}">
                <td><span class="rank-badge ${rankClass}">${rankLabel}</span></td>
                <td><strong>${result.team}</strong></td>
                <td>${result.stagePoints}</td>
                <td>${result.nonStagePoints}</td>
                <td>${result.groupGeneral}</td>
                <td><strong>${result.totalPoints}</strong></td>
                <td>${result.percentage.toFixed(2)}%</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function updateChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx || resultsData.length === 0) return;
    
    const labels = resultsData.map(r => r.team);
    const stageData = resultsData.map(r => r.stagePoints);
    const nonStageData = resultsData.map(r => r.nonStagePoints);
    const groupData = resultsData.map(r => r.groupGeneral);
    
    // Destroy existing chart if it exists
    if (window.resultsChartInstance) {
        window.resultsChartInstance.destroy();
    }
    
    window.resultsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Stage Points',
                    data: stageData,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Non-Stage Points',
                    data: nonStageData,
                    backgroundColor: 'rgba(124, 58, 237, 0.8)',
                    borderColor: 'rgba(124, 58, 237, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Group & General',
                    data: groupData,
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Team Performance Comparison'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ==========================================
// NAVIGATION & SMOOTH SCROLLING
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load data from Google Sheets
    loadAllData();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('teamModal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
        
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// Auto refresh data every 2 minutes
setInterval(() => {
    loadAllData();
}, 2 * 60 * 1000);

// ==========================================
// TEAM DETAILS MODAL
// ==========================================

function showTeamDetails(team) {
    const modal = document.getElementById('teamModal');
    const modalTeamName = document.getElementById('modalTeamName');
    const modalTeamMembers = document.getElementById('modalTeamMembers');
    
    const teamData = teamsData[team];
    if (!teamData) return;
    
    modalTeamName.textContent = teamData.name + ' Team Members';
    
    let membersHTML = '<div class="modal-members-list">';
    teamData.members.forEach((member, index) => {
        membersHTML += `
            <div class="modal-member-card">
                <div class="modal-member-number">${index + 1}</div>
                <div class="modal-member-info">
                    <h4>${member.name}</h4>
                    <p>AD No: ${member.adNo}</p>
                </div>
                <div class="modal-member-stats">
                    <div class="modal-stat">
                        <span class="modal-stat-value">${member.stageCount}</span>
                        <span class="modal-stat-label">Stage</span>
                    </div>
                    <div class="modal-stat">
                        <span class="modal-stat-value">${member.nonStageCount}</span>
                        <span class="modal-stat-label">Non-Stage</span>
                    </div>
                    <div class="modal-stat">
                        <span class="modal-stat-value">${member.total}</span>
                        <span class="modal-stat-label">Total</span>
                    </div>
                </div>
            </div>
        `;
    });
    membersHTML += '</div>';
    
    modalTeamMembers.innerHTML = membersHTML;
    modal.style.display = 'block';
}

// ==========================================
// EVENTS FILTERING
// ==========================================

function filterEvents(category) {
    const filterBtns = document.querySelectorAll('.events-filter .filter-btn');
    const eventCategories = document.querySelectorAll('.events-category');
    
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'all') {
        eventCategories.forEach(cat => cat.style.display = 'block');
    } else {
        eventCategories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
}

// ==========================================
// RESULTS TABLE SWITCHING
// ==========================================

function showResultsTable(type) {
    const tableBtns = document.querySelectorAll('.table-btn');
    tableBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // This would show different tables based on type
    console.log('Showing results for:', type);
}

// ==========================================
// CANDIDATES FILTERING & DISPLAY
// ==========================================

function updateCandidates() {
    displayCandidates('all');
}

function filterCandidates(team) {
    const filterBtns = document.querySelectorAll('.candidates-filter .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayCandidates(team);
}

function displayCandidates(filterTeam) {
    const candidatesGrid = document.getElementById('candidatesGrid');
    if (!candidatesGrid) return;
    
    let filteredCandidates = allCandidates;
    
    if (filterTeam !== 'all') {
        filteredCandidates = allCandidates.filter(c => c.team.toLowerCase() === filterTeam);
    }
    
    let html = '';
    filteredCandidates.forEach(candidate => {
        const teamData = teamsData[candidate.team.toLowerCase()];
        const memberData = teamData ? teamData.members.find(m => m.adNo === candidate.adNo) : null;
        
        const stageCount = memberData ? memberData.stageCount : 0;
        const nonStageCount = memberData ? memberData.nonStageCount : 0;
        const total = memberData ? memberData.total : 0;
        
        html += `
            <div class="candidate-card ${candidate.team.toLowerCase()}">
                <div class="candidate-header">
                    <div class="candidate-avatar">${candidate.name.charAt(0)}</div>
                    <div class="candidate-info">
                        <h4>${candidate.name}</h4>
                        <span class="candidate-id">AD No: ${candidate.adNo}</span>
                    </div>
                </div>
                <span class="candidate-team">${candidate.team}</span>
                <div class="candidate-stats">
                    <div class="candidate-stat">
                        <span class="candidate-stat-value">${stageCount}</span>
                        <span class="candidate-stat-label">Stage Events</span>
                    </div>
                    <div class="candidate-stat">
                        <span class="candidate-stat-value">${nonStageCount}</span>
                        <span class="candidate-stat-label">Non-Stage</span>
                    </div>
                </div>
                <div class="candidate-stat" style="grid-column: 1 / -1; margin-top: 10px;">
                    <span class="candidate-stat-value">${total}</span>
                    <span class="candidate-stat-label">Total Events</span>
                </div>
            </div>
        `;
    });
    
    candidatesGrid.innerHTML = html;
}
