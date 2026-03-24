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
    <svg width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Direct: ({ active }) => (
    <svg width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  Search: ({ active }) => (
    <svg width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "3" : "2"} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Reels: ({ active }) => (
    <svg width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <polygon points="10 8 16 12 10 16 10 8" fill={active ? "var(--bg)" : "none"} />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  Create: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Heart: ({ active }) => (
    <svg width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
    </svg>
  ),
  ThemeToggle: ({ isLight }) => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {isLight ? (
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      ) : (
        <circle cx="12" cy="12" r="5" />
      )}
      {!isLight && (
        <g>
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
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
    console.log("VYN_THEME:", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    window.setPage = setPage;
    window.setTheme = setTheme;
    window.toggleTheme = toggleTheme;
    
    // Simple URL support (e.g. typing /chat or /profile)
    const handleLocation = () => {
      const path = window.location.pathname.replace("/", "");
      const validPages = ["feed", "chat", "create", "notifications", "profile", "search", "reels"];
      if (validPages.includes(path)) setPage(path);
      else if (path === "") setPage("feed");
    };

    window.addEventListener("popstate", handleLocation);
    handleLocation(); // Check current URL on mount

    return () => window.removeEventListener("popstate", handleLocation);
  }, [toggleTheme]);

  useEffect(() => {
    // Sync URL when page changes internally
    const currentPath = window.location.pathname.replace("/", "") || "feed";
    if (currentPath !== page) {
      const newPath = page === "feed" ? "/" : `/${page}`;
      window.history.pushState({}, "", newPath);
    }
    console.log("VYN_PAGE:", page);
  }, [page]);

  if (!user) return <Login />;

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <div className="v-app-container" style={{ minHeight: "100vh" }}>
      
      {/* ── Top Navbar ── */}
      <header className="ig-navbar">
        <div className="ig-navbar-inner">
          <div className="ig-nav-left mobile-only">
            <button className="nav-icon-btn" onClick={() => setPage("create")}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="ig-logo" onClick={() => setPage("feed")}>
            Vyntra
          </div>

          <div className="ig-nav-actions">
            {/* Desktop Only Icons */}
            <button className="nav-icon-btn desktop-only" onClick={() => setPage("feed")} title="Home">
              <AppIcons.Home active={page === "feed"} />
            </button>
            <button className="nav-icon-btn desktop-only" onClick={() => setPage("search")} title="Search">
              <AppIcons.Search active={page === "search"} />
            </button>
            <button className="nav-icon-btn desktop-only" onClick={() => setPage("create")} title="Create">
              <AppIcons.Create />
            </button>

            {/* Mobile & Desktop Icons */}
            <button className="nav-icon-btn" onClick={() => setPage("notifications")} title="Activity">
              <AppIcons.Heart active={page === "notifications"} />
            </button>
            <button className="nav-icon-btn" onClick={() => setPage("chat")} title="Messages">
              <AppIcons.Direct active={page === "chat"} />
            </button>
            
            {/* Desktop Profile Icon (hidden on mobile top) */}
            <button className="nav-icon-btn desktop-only" onClick={() => setPage("profile")} title="Profile">
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-secondary)", color: "var(--text)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: page === "profile" ? "1px solid var(--text)" : "1.5px solid var(--border)" }}>
                {initials}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="ig-view-port">
        {page === "feed" && <Feed />}
        {page === "create" && <CreatePost onPostCreated={() => setPage("feed")} />}
        {page === "notifications" && <Notifications />}
        {page === "profile" && <Profile theme={theme} />}
        {page === "chat" && <Chat />}
        {page === "search" && <div className="ig-main" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Search Page Coming Soon</div>}
        {page === "reels" && <div className="ig-main" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Reels Coming Soon</div>}
      </main>

      {/* ── Bottom Nav (Mobile Only) ── */}
      <nav className="ig-bottom-nav mobile-only">
        <button className="nav-icon-btn" onClick={() => setPage("feed")}>
          <AppIcons.Home active={page === "feed"} />
        </button>
        <button className="nav-icon-btn" onClick={() => setPage("search")}>
          <AppIcons.Search active={page === "search"} />
        </button>
        <button className="nav-icon-btn" onClick={() => setPage("create")}>
          <AppIcons.Create />
        </button>
        <button className="nav-icon-btn" onClick={() => setPage("reels")} title="Reels">
          <AppIcons.Reels active={page === "reels"} />
        </button>
        <button className="nav-icon-btn" onClick={() => setPage("profile")}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface-secondary)", color: "var(--text)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: page === "profile" ? "1px solid var(--text)" : "1.5px solid var(--border)" }}>
            {initials}
          </div>
        </button>
      </nav>

    </div>
  );
}


export default App;