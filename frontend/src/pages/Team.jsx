import '../styles/Dashboard.css';

export default function Team() {
  const teamMembers = [
    { id: 1, name: 'Ali Ahmed', role: 'Project Manager', email: 'ali@example.com' },
    { id: 2, name: 'Sara Khan', role: 'Developer', email: 'sara@example.com' },
    { id: 3, name: 'Ahmed Raza', role: 'Designer', email: 'ahmed@example.com' },
    { id: 4, name: 'Fatima Bibi', role: 'QA Engineer', email: 'fatima@example.com' },
  ];

  return (
    <div className="page-content">
      <h2>Team Members</h2>
      <p>Apni team ke members yahan dekh sakte ho:</p>

      <div className="team-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="team-card">
              <div className="team-avatar">{member.name.charAt(0)}</div>
              <h3>{member.name}</h3>
            <p className="team-role">{member.role}</p>
              <p className="team-email">{member.email}</p>
              </div>
        ))}
      </div>

      <button className="add-team-btn">+ Add Team Member</button>
    </div>
  );
}

