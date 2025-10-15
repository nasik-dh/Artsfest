// Main page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadTeams();
});

async function loadTeams() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=getTeams`);
        const teams = await response.json();
        displayTeams(teams);
    } catch (error) {
        console.error('Error loading teams:', error);
        showError('Failed to load teams. Please try again later.');
    }
}

function displayTeams(teams) {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';

    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';
        teamDiv.onclick = () => window.location.href = `team.html?team=${team.team_id}`;
        
        teamDiv.innerHTML = `
            <h3>${team.team_name}</h3>
            <div class="team-leaders">
                <div class="leader main">Leader: ${team.leader_name}</div>
                <div class="leader">Assistant: ${team.assistant1_name}</div>
                <div class="leader">Assistant: ${team.assistant2_name}</div>
            </div>
        `;
        
        container.appendChild(teamDiv);
    });
}

function showError(message) {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
}

function showSuccess(message) {
    const container = document.getElementById('teamsContainer');
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    container.insertBefore(successDiv, container.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}
