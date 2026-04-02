import { useEffect, useState, useCallback } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import socket from "./services/socket";

const AppIcons = {
  Home: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Search: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Create: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Reels: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M10 8l6 4-6 4V8z" fill={active ? "var(--bg)" : "none"} />
    </svg>
  ),
  Heart: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
    </svg>
  ),
  Direct: ({ active }) => (
    <svg width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  ThemeToggle: ({ isLight }) => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {isLight ? (
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      ) : (
        <g><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42 1.42M18.36 5.64l1.42 1.42" /></g>
      )}
    </svg>
  )
};

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("feed");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (user?._id) socket.emit("register", user._id);
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return <Login />;

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <div className="v-app-container">
      

      {/* ── Main Content Area ── */}
      <main className="ig-view-port">
        {page === "feed" && <Feed onActivityClick={() => handlePageChange("notifications")} onMessagesClick={() => handlePageChange("chat")} />}
        {page === "create" && <CreatePost onPostCreated={() => handlePageChange("feed")} />}
        {page === "notifications" && <Notifications />}
        {page === "profile" && <Profile theme={theme} toggleTheme={toggleTheme} />}
        {page === "chat" && <Chat />}
        {page === "search" && <div className="ig-main" style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>Search is coming soon</div>}
        {page === "reels" && <div className="ig-main" style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>Reels are coming soon</div>}
      </main>

      {/* ── Unified Navigation (Bottom Bar) ── */}
      <nav className="ig-bottom-nav glass" style={{ display: "flex", justifyContent: "space-around" }}>
        <button className="nav-icon-btn" onClick={() => handlePageChange("feed")} title="Home">
          <AppIcons.Home active={page === "feed"} />
        </button>
        <button className="nav-icon-btn" onClick={() => handlePageChange("search")} title="Search">
          <AppIcons.Search active={page === "search"} />
        </button>
        <button className="nav-icon-btn" onClick={() => handlePageChange("create")} title="Create">
          <AppIcons.Create active={page === "create"} />
        </button>
        <button className="nav-icon-btn" onClick={() => handlePageChange("chat")} title="Messages">
          <AppIcons.Direct active={page === "chat"} />
        </button>
        <button className="nav-icon-btn" onClick={() => handlePageChange("profile")} title="Profile">
           <div style={{ 
              width: 28, height: 28, borderRadius: "50%", 
              background: page === "profile" ? "var(--ig-gradient)" : "var(--border)", padding: "2px" 
            }}>
              <div style={{ 
                width: "100%", height: "100%", borderRadius: "50%", 
                background: "var(--surface)", display: "flex", 
                alignItems: "center", justifyContent: "center", 
                fontSize: 10, fontWeight: 800 
              }}>
                {initials}
              </div>
            </div>
        </button>
      </nav>

    </div>
  );
}

export default App;