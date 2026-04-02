import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile({ theme }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use provided username or fallback to match screenshot closely for visual effect
  const username = user?.username || "mah.akal6278";
  const name = "mahakal ji";

  useEffect(() => {
    // Mock 6 posts to match the grid visually
    setPosts(Array(6).fill({ id: 1, image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Post" }));
    setLoading(false);
  }, []);

  return (
    <div className="profile-page-wrapper" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", fontFamily: "var(--font-family, -apple-system, system-ui, sans-serif)" }}>
      
      {/* ── Custom Profile Top Navbar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "16px", fontWeight: "700" }}>
          {username}
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginTop: "2px" }}><path d="M7 10l5 5 5-5H7z"/></svg>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ED4956", marginLeft: "2px" }}></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-4h3v-2h-3v2zm1.5-10c-1.66 0-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1c0 1.5-2 1.5-2 3.5h2c0-1.5 2-1.88 2-3.5 0-1.66-1.34-3-3-3z"/></svg>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </div>

      {/* ── Profile Info Block ── */}
      <div style={{ padding: "16px" }}>
        {/* Avatar & Stats Row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
          {/* Avatar Area */}
          <div style={{ position: "relative", marginRight: "28px" }}>
            <div style={{ width: "86px", height: "86px", borderRadius: "50%", background: "var(--surface-secondary)", padding: "2px", border: "1px solid var(--border)" }}>
               <img src="https://via.placeholder.com/86" alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: "0", right: "0", background: "#0095F6", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg)" }}>
              <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>
            </div>
          </div>
          
          {/* Stats Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>{name}</div>
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "16px" }}>5</span>
                <span style={{ fontSize: "13px", color: "var(--text)" }}>posts</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "16px" }}>4</span>
                <span style={{ fontSize: "13px", color: "var(--text)" }}>followers</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "16px" }}>0</span>
                <span style={{ fontSize: "13px", color: "var(--text)" }}>following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ fontSize: "14px", lineHeight: "1.4", marginBottom: "12px" }}>
          <span>best platform</span>
        </div>

        {/* Add Banners Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: "16px", fontSize: "13px", fontWeight: "600", marginBottom: "16px" }}>
           <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           Add banners
        </div>

        {/* Professional Dashboard */}
        <div style={{ background: "#262626", borderRadius: "8px", padding: "12px 14px", marginBottom: "12px" }}>
          <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "2px" }}>Professional dashboard</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>9 views in the last 30 days.</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ flex: 1, background: "#262626", color: "#fff", border: "none", padding: "8px 0", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Edit profile</button>
          <button style={{ flex: 1, background: "#262626", color: "#fff", border: "none", padding: "8px 0", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Share profile</button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid var(--border)", marginTop: "10px" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "12px 0", borderBottom: "2px solid var(--text)", cursor: "pointer" }}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "12px 0", color: "var(--text-muted)", cursor: "pointer" }}>
           <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v16H3V4zm2 2v12h14V6H5zm3 3h2v2H8V9zm4 0h4v2h-4V9zm-4 4h2v2H8v-2zm4 0h4v2h-4v-2z"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "12px 0", color: "var(--text-muted)", cursor: "pointer" }}>
           <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.33 0-4.32-1.45-5.12-3.5h10.24c-.8 2.05-2.79 3.5-5.12 3.5z"/></svg>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
        {posts.map((_, i) => (
          <div key={i} style={{ aspectRatio: "1/1", position: "relative", background: "#333" }}>
            <img src={`https://picsum.photos/seed/${i + 130}/300/300`} alt="post snippet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Reels Icon Overlay */}
            <div style={{ position: "absolute", top: "8px", right: "8px" }}>
              <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default Profile;
