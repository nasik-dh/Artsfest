// ==========================================
// DATA STORAGE
// ==========================================

const teamsData = {
    arakkal: {
        name: 'ARAKKAL',
        members: [
            { adNo: 988, name: 'MOHAMMED HADI V', stageCount: 4, nonStageCount: 3, total: 7 },
            { adNo: 993, name: 'AQIB MUHAMMED KT', stageCount: 3, nonStageCount: 2, total: 5 },
            { adNo: 997, name: 'MUHAMMED QASIM MP', stageCount: 2, nonStageCount: 3, total: 5 },
            { adNo: 1000, name: 'ALI RAFI EP', stageCount: 2, nonStageCount: 4, total: 6 },
            { adNo: 1002, name: 'HAMDAN CC', stageCount: 4, nonStageCount: 2, total: 6 },
            { adNo: 1008, name: 'HISHAM RAHMATHULLAH O', stageCount: 4, nonStageCount: 8, total: 12 },
            { adNo: 1009, name: 'SAHL SHAN O', stageCount: 4, nonStageCount: 5, total: 9 },
            { adNo: 1012, name: 'MUHAMMED HASHIM KH', stageCount: 3, nonStageCount: 8, total: 11 },
            { adNo: 1014, name: 'MISHAB PT', stageCount: 5, nonStageCount: 3, total: 8 },
            { adNo: 1019, name: 'MUHAMMED RAMEES VP', stageCount: 2, nonStageCount: 2, total: 4 },
            { adNo: 1020, name: 'ABDAUL HADI', stageCount: 5, nonStageCount: 2, total: 7 }
        ]
    },
    marakkar: {
        name: 'MARAKKAR',
        members: [
            { adNo: 987, name: 'MUHAMMED LASIN KC', stageCount: 3, nonStageCount: 5, total: 8 },
            { adNo: 992, name: 'MUHAMMED SHAHAL', stageCount: 4, nonStageCount: 4, total: 8 },
            { adNo: 995, name: 'MUHAMMED RABEEH PP', stageCount: 2, nonStageCount: 4, total: 6 },
            { adNo: 996, name: 'MUHAMMED SHAFEEQUE T', stageCount: 3, nonStageCount: 4, total: 7 },
            { adNo: 998, name: 'MUHAMMED HASHIM V', stageCount: 3, nonStageCount: 2, total: 5 },
            { adNo: 999, name: 'MUHAMMED RASAL PP', stageCount: 2, nonStageCount: 6, total: 8 },
            { adNo: 1005, name: 'MUHAMMED ANSHAD VP', stageCount: 3, nonStageCount: 6, total: 9 },
            { adNo: 1010, name: 'SADHAQATHULLA C', stageCount: 2, nonStageCount: 4, total: 6 },
            { adNo: 1013, name: 'SAIDALAVI SHAMIL MC', stageCount: 5, nonStageCount: 3, total: 8 },
            { adNo: 1016, name: 'MUHAMMED ASLAM', stageCount: 5, nonStageCount: 0, total: 5 },
            { adNo: 1017, name: 'MUHAMMED MUSTHAFA SM', stageCount: 6, nonStageCount: 4, total: 10 }
        ]
    },
    makhdoom: {
        name: 'MAKHDOOM',
        members: [
            { adNo: 986, name: 'MUHAMMED YASEEN K', stageCount: 2, nonStageCount: 6, total: 8 },
            { adNo: 989, name: 'MUHAMMED HAYYAN VP', stageCount: 3, nonStageCount: 2, total: 5 },
            { adNo: 990, name: 'MOHAMMED AFRAH N', stageCount: 3, nonStageCount: 3, total: 6 },
            { adNo: 991, name: 'MUHAMMED ZIYAD C', stageCount: 2, nonStageCount: 7, total: 9 },
            { adNo: 1001, name: 'MUHAMMED SINAN CK', stageCount: 6, nonStageCount: 2, total: 8 },
            { adNo: 1003, name: 'MUHAMMED ALI M', stageCount: 4, nonStageCount: 5, total: 9 },
            { adNo: 1004, name: 'MUHAMMED SHAFAN A', stageCount: 5, nonStageCount: 1, total: 6 },
            { adNo: 1006, name: 'MUHAMMED NASWIH IK', stageCount: 1, nonStageCount: 6, total: 7 },
            { adNo: 1011, name: 'MUHAMMED SAHL', stageCount: 6, nonStageCount: 3, total: 9 },
            { adNo: 1015, name: 'MUHAMMED RASIN KP', stageCount: 4, nonStageCount: 5, total: 9 },
            { adNo: 1018, name: 'MUHAMMED SHAFIN', stageCount: 2, nonStageCount: 2, total: 4 }
        ]
    }
};

const allCandidates = [
    { adNo: 986, name: 'MUHAMMED YASEEN K', team: 'MAKHDOOM' },
    { adNo: 987, name: 'MUHAMMED LASIN KC', team: 'MARAKKAR' },
    { adNo: 988, name: 'MOHAMMED HADI V', team: 'ARAKKAL' },
    { adNo: 989, name: 'MUHAMMED HAYYAN VP', team: 'MAKHDOOM' },
    { adNo: 990, name: 'MOHAMMED AFRAH N', team: 'MAKHDOOM' },
    { adNo: 991, name: 'MUHAMMED ZIYAD C', team: 'MAKHDOOM' },
    { adNo: 992, name: 'MUHAMMED SHAHAL', team: 'MARAKKAR' },
    { adNo: 993, name: 'AQIB MUHAMMED KT', team: 'ARAKKAL' },
    { adNo: 995, name: 'MUHAMMED RABEEH PP', team: 'MARAKKAR' },
    { adNo: 996, name: 'MUHAMMED SHAFEEQUE T', team: 'MARAKKAR' },
    { adNo: 997, name: 'MUHAMMED QASIM MP', team: 'ARAKKAL' },
    { adNo: 998, name: 'MUHAMMED HASHIM V', team: 'MARAKKAR' },
    { adNo: 999, name: 'MUHAMMED RASAL PP', team: 'MARAKKAR' },
    { adNo: 1000, name: 'ALI RAFI EP', team: 'ARAKKAL' },
    { adNo: 1001, name: 'MUHAMMED SINAN CK', team: 'MAKHDOOM' },
    { adNo: 1002, name: 'HAMDAN CC', team: 'ARAKKAL' },
    { adNo: 1003, name: 'MUHAMMED ALI M', team: 'MAKHDOOM' },
    { adNo: 1004, name: 'MUHAMMED SHAFAN A', team: 'MAKHDOOM' },
    { adNo: 1005, name: 'MUHAMMED ANSHAD VP', team: 'MARAKKAR' },
    { adNo: 1006, name: 'MUHAMMED NASWIH IK', team: 'MAKHDOOM' },
    { adNo: 1008, name: 'HISHAM RAHMATHULLAH O', team: 'ARAKKAL' },
    { adNo: 1009, name: 'SAHL SHAN O', team: 'ARAKKAL' },
    { adNo: 1010, name: 'SADHAQATHULLA C', team: 'MARAKKAR' },
    { adNo: 1011, name: 'MUHAMMED SAHL', team: 'MAKHDOOM' },
    { adNo: 1012, name: 'MUHAMMED HASHIM KH', team: 'ARAKKAL' },
    { adNo: 1013, name: 'SAIDALAVI SHAMIL MC', team: 'MARAKKAR' },
    { adNo: 1014, name: 'MISHAB PT', team: 'ARAKKAL' },
    { adNo: 1015, name: 'MUHAMMED RASIN KP', team: 'MAKHDOOM' },
    { adNo: 1016, name: 'MUHAMMED ASLAM', team: 'MARAKKAR' },
    { adNo: 1017, name: 'MUHAMMED MUSTHAFA SM', team: 'MARAKKAR' },
    { adNo: 1018, name: 'MUHAMMED SHAFIN', team: 'MAKHDOOM' },
    { adNo: 1019, name: 'MUHAMMED RAMEES VP', team: 'ARAKKAL' },
    { adNo: 1020, name: 'ABDAUL HADI', team: 'ARAKKAL' }
];

// ==========================================
// NAVIGATION & SMOOTH SCROLLING
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Initialize sections
    initializeCandidates();
    initializeChart();
    
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
    
    // Add CSS for modal members
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
    
    // For now, showing the same table (can be expanded with different data)
    console.log('Showing results for:', type);
}

// ==========================================
// CANDIDATES FILTERING & DISPLAY
// ==========================================

function initializeCandidates() {
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
    let filteredCandidates = allCandidates;
    
    if (filterTeam !== 'all') {
        filteredCandidates = allCandidates.filter(c => c.team.toLowerCase() === filterTeam);
    }
    
    let html = '';
    filteredCandidates.forEach(candidate => {
        const teamData = teamsData[candidate.team.toLowerCase()];
        const memberData = teamData.members.find(m => m.adNo === candidate.adNo);
        
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
// RESULTS CHART
// ==========================================

function initializeChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ARAKKAL', 'MARAKKAR', 'MAKHDOOM'],
            datasets: [
                {
                    label: 'Stage Points',
                    data: [94, 85, 105],
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Non-Stage Points',
                    data: [96, 100, 117],
                    backgroundColor: 'rgba(124, 58, 237, 0.8)',
                    borderColor: 'rgba(124, 58, 237, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Group & General',
                    data: [35, 36, 37],
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

// Observe all sections for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});
