import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile({ theme }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      // Assuming there's an endpoint to fetch current user's posts or filtering feed
      const { data } = await API.get("/posts/feed"); 
      const myPosts = data.filter(p => p.user?._id === user?._id);
      setPosts(myPosts);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchUserPosts(); }, []);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <div style={{ maxWidth: "935px", margin: "0 auto", padding: "30px 20px" }}>
      
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar-ring" style={{ background: "var(--ig-gradient)", width: "150px", height: "150px" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#000", padding: "4px" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700" }}>
                {initials}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-username-row">
            <h2 style={{ fontSize: "28px", fontWeight: "300" }}>{user?.username}</h2>
            <button style={{ background: "#333", border: "none", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Edit Profile
            </button>
            <button className="nav-icon-btn" onClick={() => window.toggleTheme && window.toggleTheme()} title="Toggle Theme">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {theme === "light" ? (
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="5" />
                    <g>
                      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </g>
                  </>
                )}
              </svg>
            </button>
            <button className="nav-icon-btn">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
          </div>

          <div className="profile-stats-row text-sm">
            <div className="stat-item">
              <span className="stat-num">{posts.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">245</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">312</span>
              <span className="stat-label">following</span>
            </div>
          </div>

          <div style={{ fontSize: "14px" }}>
            <div style={{ fontWeight: "700" }}>{user?.username}</div>
            <div style={{ color: "var(--text-muted)" }}>Digital Creator</div>
            <div style={{ marginTop: "4px" }}>Visual storyteller exploring the world 🌎✨</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "60px", borderTop: "1px solid var(--border)", marginTop: "40px" }}>
        <div style={{ paddingTop: "15px", borderTop: "1px solid #fff", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z"/></svg>
          Posts
        </div>
        <div style={{ paddingTop: "15px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", color: "var(--text-muted)" }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></svg>
          Saved
        </div>
      </div>

      {/* Grid */}
      <div className="profile-grid">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="grid-item animate-pulse" />
          ))
        ) : posts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📸</div>
            <h3 style={{ fontSize: "24px", fontWeight: "800" }}>Share Photos</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>When you share photos, they will appear on your profile.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="grid-item">
              <img src={post.image} alt="post" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
