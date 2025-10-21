// ==========================================
// GOOGLE SHEETS DATA FETCHING
// ==========================================

const SHEET_URLS = {
    arakkal: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=436920225&single=true&output=csv',
    marakkar: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1491954663&single=true&output=csv',
    makhdoom: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=943975063&single=true&output=csv',
    positionGrade: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1379136267&single=true&output=csv',
    schedule: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=754287169&single=true&output=csv',
    tArakkal: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=2123172704&single=true&output=csv',
    tMarakkar: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=491533326&single=true&output=csv',
    tMakhdoom: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1326814678&single=true&output=csv',
    teamBase: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1283347559&single=true&output=csv',
    totalCandidates: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1883498839&single=true&output=csv',
    result: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQrBJCudcS2saOS_KkWLNLMoZ5diRe5Np2R2TbFYQkXArwG53M8rs17gcHP_yQsVIvYJTOmTrhltJe/pub?gid=1562650117&single=true&output=csv'
};

let teamsData = {};
let allCandidates = [];
let scheduleData = [];
let resultsData = {};
let teamBaseData = {};

// CSV Parser
function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const obj = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : '';
        }
        result.push(obj);
    }
    return result;
}

// Fetch CSV data
async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const csv = await response.text();
        return parseCSV(csv);
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return [];
    }
}

// Load all data from Google Sheets
async function loadAllData() {
    try {
        // Show loading indicator
        showLoading();
        
        // Fetch all data in parallel
        const [
            arakkData,
            marakkarData,
            makhdoomData,
            candidatesData,
            schedData,
            teamBase,
            resultData
        ] = await Promise.all([
            fetchCSV(SHEET_URLS.arakkal),
            fetchCSV(SHEET_URLS.marakkar),
            fetchCSV(SHEET_URLS.makhdoom),
            fetchCSV(SHEET_URLS.totalCandidates),
            fetchCSV(SHEET_URLS.schedule),
            fetchCSV(SHEET_URLS.teamBase),
            fetchCSV(SHEET_URLS.result)
        ]);
        
        // Process teams data
        teamsData = {
            arakkal: {
                name: 'ARAKKAL',
                members: processTeamMembers(arakkData)
            },
            marakkar: {
                name: 'MARAKKAR',
                members: processTeamMembers(marakkarData)
            },
            makhdoom: {
                name: 'MAKHDOOM',
                members: processTeamMembers(makhdoomData)
            }
        };
        
        // Process candidates
        allCandidates = candidatesData.map(row => ({
            adNo: parseInt(row['AD NO'] || row['adNo'] || 0),
            name: row['NAME'] || row['name'] || '',
            team: row['TEAM'] || row['team'] || ''
        }));
        
        // Process schedule
        scheduleData = schedData;
        
        // Process team base
        teamBaseData = processTeamBase(teamBase);
        
        // Process results
        resultsData = processResults(resultData);
        
        // Update UI
        updateAllSections();
        
        hideLoading();
    } catch (error) {
        console.error('Error loading data:', error);
        hideLoading();
        alert('Error loading data. Please refresh the page.');
    }
}

function processTeamMembers(data) {
    return data.map(row => ({
        adNo: parseInt(row['AD NO'] || row['adNo'] || 0),
        name: row['NAME'] || row['name'] || '',
        stageCount: parseInt(row['STAGE'] || row['stage'] || row['stageCount'] || 0),
        nonStageCount: parseInt(row['NON-STAGE'] || row['nonStage'] || row['nonStageCount'] || 0),
        total: parseInt(row['TOTAL'] || row['total'] || 0)
    }));
}

function processTeamBase(data) {
    const result = {};
    data.forEach(row => {
        const team = (row['TEAM'] || row['team'] || '').toLowerCase();
        if (team) {
            result[team] = {
                stagePoints: parseInt(row['STAGE'] || row['stage'] || 0),
                nonStagePoints: parseInt(row['NON-STAGE'] || row['nonStage'] || 0),
                groupGeneral: parseInt(row['GROUP & GENERAL'] || row['groupGeneral'] || 0),
                totalPoints: parseInt(row['TOTAL'] || row['total'] || 0),
                percentage: parseFloat(row['PERCENTAGE'] || row['percentage'] || 0)
            };
        }
    });
    return result;
}

function processResults(data) {
    return data.map(row => ({
        rank: parseInt(row['RANK'] || row['rank'] || 0),
        team: row['TEAM'] || row['team'] || '',
        stagePoints: parseInt(row['STAGE'] || row['stage'] || 0),
        nonStagePoints: parseInt(row['NON-STAGE'] || row['nonStage'] || 0),
        groupGeneral: parseInt(row['GROUP & GENERAL'] || row['groupGeneral'] || 0),
        totalPoints: parseInt(row['TOTAL'] || row['total'] || 0),
        percentage: parseFloat(row['PERCENTAGE'] || row['percentage'] || 0)
    }));
}

function showLoading() {
    const loader = document.createElement('div');
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

function hideLoading() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) loader.remove();
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
    scheduleData.forEach(row => {
        const date = row['DATE'] || row['date'] || '';
        const time = row['TIME'] || row['time'] || '';
        const event = row['EVENT'] || row['event'] || '';
        
        if (date && event) {
            if (!eventsByDate[date]) {
                eventsByDate[date] = [];
            }
            eventsByDate[date].push({ time, event });
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
    
    new Chart(ctx, {
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
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Team Performance Comparison',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
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
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
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
});

// Auto refresh data every 5 minutes
setInterval(() => {
    loadAllData();
}, 5 * 60 * 1000);

// ==========================================
// TEAM DETAILS MODAL
// ==========================================

function showTeamDetails(team) {
    const modal = document.getElementById('teamModal');
    const modalTeamName = document.getElementById('modalTeamName');
    const modalTeamMembers = document.getElementById('modalTeamMembers');
    
    const teamData = teamsData[team];
    
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
    
    membersHTML += `
        <style>
            .modal-members-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 20px;
            }
            .modal-member-card {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 20px;
                background: var(--light-bg);
                border-radius: 10px;
                transition: all 0.3s ease;
            }
            .modal-member-card:hover {
                background: #fff;
                box-shadow: var(--shadow);
                transform: translateX(5px);
            }
            .modal-member-number {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            .modal-member-info {
                flex: 1;
            }
            .modal-member-info h4 {
                margin-bottom: 5px;
                color: var(--text-dark);
            }
            .modal-member-info p {
                color: var(--text-light);
                font-size: 0.9rem;
            }
            .modal-member-stats {
                display: flex;
                gap: 15px;
            }
            .modal-stat {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 8px;
                min-width: 60px;
            }
            .modal-stat-value {
                display: block;
                font-size: 1.3rem;
                font-weight: bold;
                color: var(--primary-color);
            }
            .modal-stat-label {
                display: block;
                font-size: 0.75rem;
                color: var(--text-light);
            }
        </style>
    `;
    
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

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});
