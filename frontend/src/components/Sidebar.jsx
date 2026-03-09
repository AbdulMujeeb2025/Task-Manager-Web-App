import "../styles/Sidebar.css";

export default function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "mytasks", label: "My Tasks", icon: "✓" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
