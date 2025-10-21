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

// CSV Parser - Fixed to handle quoted fields and commas
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const row = [];
        let currentField = '';
        let insideQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                row.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField.trim());
        result.push(row);
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
        showLoading();
        
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
        
        console.log('Loaded data:', {
            arakkal: arakkData,
            marakkar: marakkarData,
            makhdoom: makhdoomData,
            candidates: candidatesData,
            schedule: schedData,
            teamBase: teamBase,
            results: resultData
        });
        
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
        
        allCandidates = processCandidates(candidatesData);
        scheduleData = processSchedule(schedData);
        teamBaseData = processTeamBase(teamBase);
        resultsData = processResults(resultData);
        
        updateAllSections();
        hideLoading();
    } catch (error) {
        console.error('Error loading data:', error);
        hideLoading();
        alert('Error loading data. Please refresh the page.');
    }
}

function processTeamMembers(data) {
    if (!data || data.length < 2) return [];
    
    const members = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) {
            members.push({
                adNo: parseInt(row[0]) || 0,
                name: row[1] || '',
                stageCount: parseInt(row[2]) || 0,
                nonStageCount: parseInt(row[3]) || 0,
                total: parseInt(row[4]) || 0
            });
        }
    }
    return members;
}

function processCandidates(data) {
    if (!data || data.length < 2) return [];
    
    const candidates = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) {
            candidates.push({
                adNo: parseInt(row[0]) || 0,
                name: row[1] || '',
                team: row[2] || ''
            });
        }
    }
    return candidates;
}

function processSchedule(data) {
    if (!data || data.length < 2) return [];
    
    const schedule = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) {
            schedule.push({
                date: row[0] || '',
                time: row[1] || '',
                event: row[2] || ''
            });
        }
    }
    return schedule;
}

function processTeamBase(data) {
    if (!data || data.length < 2) return {};
    
    const result = {};
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
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
    }
    return result;
}

function processResults(data) {
    if (!data || data.length < 2) return [];
    
    const results = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) {
            results.push({
                rank: parseInt(row[0]) || 0,
                team: row[1] || '',
                stagePoints: parseInt(row[2]) || 0,
                nonStagePoints: parseInt(row[3]) || 0,
                groupGeneral: parseInt(row[4]) || 0,
                totalPoints: parseInt(row[5]) || 0,
                percentage: parseFloat(row[6]) || 0
            });
        }
    }
    return results;
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
        const first = podiumItems[1];
        first.querySelector('h4').textContent = sortedTeams[0].team;
        first.querySelector('.podium-score').textContent = sortedTeams[0].totalPoints + ' Points';
        first.querySelector('.podium-percentage').textContent = sortedTeams[0].percentage.toFixed(2) + '%';
        
        const second = podiumItems[0];
        second.querySelector('h4').textContent = sortedTeams[1].team;
        second.querySelector('.podium-score').textContent = sortedTeams[1].totalPoints + ' Points';
        second.querySelector('.podium-percentage').textContent = sortedTeams[1].percentage.toFixed(2) + '%';
        
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
    
    const eventsByDate = {};
    scheduleData.forEach(item => {
        const date = item.date;
        if (date) {
            if (!eventsByDate[date]) {
                eventsByDate[date] = [];
            }
            eventsByDate[date].push({ time: item.time, event: item.event });
        }
    });
    
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
    
    const sortedResults = [...resultsData].sort((a, b) => a.rank - b.rank);
    
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
    
    const sortedResults = [...resultsData].sort((a, b) => a.rank - b.rank);
    const labels = sortedResults.map(r => r.team);
    const stageData = sortedResults.map(r => r.stagePoints);
    const nonStageData = sortedResults.map(r => r.nonStagePoints);
    const groupData = sortedResults.map(r => r.groupGeneral);
    
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

document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    
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
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
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

setInterval(() => {
    loadAllData();
}, 5 * 60 * 1000);

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

function filterEvents(category) {
    const filterBtns = document.querySelectorAll('.events-filter .filter-btn');
    const eventCategories = document.querySelectorAll('.events-category');
    
    filterBtns.forEach(btn => btn.classList.remove('active'));
    window.event.target.classList.add('active');
    
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

function showResultsTable(type) {
    const tableBtns = document.querySelectorAll('.table-btn');
    tableBtns.forEach(btn => btn.classList.remove('active'));
    window.event.target.classList.add('active');
    
    console.log('Showing results for:', type);
}

function updateCandidates() {
    displayCandidates('all');
}

function filterCandidates(team) {
    const filterBtns = document.querySelectorAll('.candidates-filter .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    window.event.target.classList.add('active');
    
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
