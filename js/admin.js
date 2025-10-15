// Admin panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
});

async function loadInitialData() {
    try {
        await Promise.all([
            loadTeamsForSelect(),
            loadCandidatesForSelect(),
            loadProgramsForSelect(),
            loadCandidatesList(),
            loadProgramsList(),
            loadScheduleList()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

function setupEventListeners() {
    // Form submissions
    document.getElementById('candidateForm').addEventListener('submit', handleCandidateSubmit);
    document.getElementById('programForm').addEventListener('submit', handleProgramSubmit);
    document.getElementById('resultForm').addEventListener('submit', handleResultSubmit);
    document.getElementById('scheduleForm').addEventListener('submit', handleScheduleSubmit);
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Load data functions
async function loadTeamsForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getTeams`);
        const teams = await response.json();
        
        const select = document.getElementById('candidateTeam');
        select.innerHTML = '<option value="">Select Team</option>';
        
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.team_id;
            option.textContent = team.team_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

async function loadCandidatesForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getCandidates`);
        const candidates = await response.json();
        
        const select = document.getElementById('resultCandidate');
        select.innerHTML = '<option value="">Select Candidate</option>';
        
        candidates.forEach(candidate => {
            const option = document.createElement('option');
            option.value = candidate.candidate_id;
            option.textContent = candidate.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading candidates:', error);
    }
}

async function loadProgramsForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getPrograms`);
        const programs = await response.json();
        
        const selects = ['resultProgram', 'scheduleProgram'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select Program</option>';
            
            programs.forEach(program => {
                const option = document.createElement('option');
                option.value = program.program_id;
                option.textContent = program.program_name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}

async function loadCandidatesList() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getCandidates`);
        const candidates = await response.json();
        
        const container = document.getElementById('candidatesList');
        container.innerHTML = '';
        
        candidates.forEach(candidate => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <strong>${candidate.name}</strong> - Team ${candidate.team_id} - Points: ${candidate.total_points}
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading candidates list:', error);
    }
}

async function loadProgramsList() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getPrograms`);
        const programs = await response.json();
        
        const container = document.getElementById('programsList');
        container.innerHTML = '';
        
        programs.forEach(program => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <strong>${program.program_name}</strong> - ${program.category} - ${program.venue}<br>
                Participants: ${program.min_participants} - ${program.max_participants}
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading programs list:', error);
    }
}

async function loadScheduleList() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getSchedule`);
        const schedule = await response.json();
        
        const container = document.getElementById('scheduleList');
        container.innerHTML = '';
        
        schedule.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                Program ID: ${item.program_id} - ${item.date}<br>
                Time: ${item.start_time} - ${item.end_time}<br>
                Venue: ${item.venue}
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading schedule:', error);
    }
}

// Form handlers
async function handleCandidateSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('candidateName').value,
        team_id: document.getElementById('candidateTeam').value,
        image_url: document.getElementById('candidateImage').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}?action=addCandidate&name=${encodeURIComponent(formData.name)}&team_id=${formData.team_id}&image_url=${encodeURIComponent(formData.image_url)}`);
        const result = await response.json();
        
        if (result.success) {
            showMessage('Candidate added successfully!', 'success');
            document.getElementById('candidateForm').reset();
            loadCandidatesList();
            loadCandidatesForSelect();
        }
    } catch (error) {
        console.error('Error adding candidate:', error);
        showMessage('Error adding candidate', 'error');
    }
}

async function handleProgramSubmit(e) {
    e.preventDefault();
    
    const formData = {
        program_name: document.getElementById('programName').value,
        category: document.getElementById('programCategory').value,
        min_participants: document.getElementById('minParticipants').value,
        max_participants: document.getElementById('maxParticipants').value,
        venue: document.getElementById('programVenue').value
    };
    
    try {
        const params = new URLSearchParams(formData);
        const response = await fetch(`${API_BASE_URL}?action=addProgram&${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
            showMessage('Program added successfully!', 'success');
            document.getElementById('programForm').reset();
            loadProgramsList();
            loadProgramsForSelect();
        }
    } catch (error) {
        console.error('Error adding program:', error);
        showMessage('Error adding program', 'error');
    }
}

async function handleResultSubmit(e) {
    e.preventDefault();
    
    const formData = {
        candidate_id: document.getElementById('resultCandidate').value,
        program_id: document.getElementById('resultProgram').value,
        position: document.getElementById('resultPosition').value,
        grade: document.getElementById('resultGrade').value
    };
    
    try {
        const params = new URLSearchParams(formData);
        const response = await fetch(`${API_BASE_URL}?action=addResult&${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
            showMessage(`Result added successfully! Points awarded: ${result.points}`, 'success');
            document.getElementById('resultForm').reset();
            loadCandidatesList(); // Refresh to show updated points
        }
    } catch (error) {
        console.error('Error adding result:', error);
        showMessage('Error adding result', 'error');
    }
}

async function handleScheduleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        program_id: document.getElementById('scheduleProgram').value,
        date: document.getElementById('scheduleDate').value,
        start_time: document.getElementById('startTime').value,
        end_time: document.getElementById('endTime').value,
        venue: document.getElementById('scheduleVenue').value
    };
    
    try {
        const params = new URLSearchParams(formData);
        const response = await fetch(`${API_BASE_URL}?action=addSchedule&${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
            showMessage('Schedule added successfully!', 'success');
            document.getElementById('scheduleForm').reset();
            loadScheduleList();
        }
    } catch (error) {
        console.error('Error adding schedule:', error);
        showMessage('Error adding schedule', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    const activeTab = document.querySelector('.tab-content.active');
    activeTab.insertBefore(messageDiv, activeTab.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
