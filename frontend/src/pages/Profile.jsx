import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile({ theme, toggleTheme, installPrompt }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const username = user?.username || "Vyntra Member";
  const initials = username.slice(0, 2).toUpperCase();

  // Real Stats from Database
  const postCount = posts.length || 0;
  const followerCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    
    const fetchUserPosts = async () => {
      try {
        const { data } = await API.get(`/posts/user/${user._id}`);
        setPosts(data);
      } catch (_) {
        setPosts([]); // Pure real data: No mock fallback
      }
      setLoading(false);
    };
    
    if (user?._id) fetchUserPosts();
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

  const handleDownloadApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`PWA Outcome: ${outcome}`);
    } else {
      alert("To download Vyntra on your mobile, select 'Add to Home Screen' in your browser's menu.");
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Vyntra Social',
        text: `Join me on Vyntra! Discover a premium social experience. ✨`,
        url: window.location.origin
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      alert("App link copied! Share it with your friends. 🚀");
    }
  };

  const ThemeToggle = ({ isLight }) => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      {isLight ? (
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      ) : (
        <g><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42 1.42M18.36 5.64l1.42 1.42" /></g>
      )}
    </svg>
  );

  return (
    <div className="profile-wrapper animate-fadeIn" style={{ 
      maxWidth: 935, margin: "0 auto", padding: isMobile ? "0 0 80px" : "30px 20px 80px" 
    }}>
      
      {/* ── Profile Header ── */}
      <header style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "20px 16px" : "0 0 44px",
        gap: isMobile ? 20 : "8%", 
        alignItems: isMobile ? "flex-start" : "center",
        borderBottom: isMobile ? "1px solid var(--border)" : "none"
      }}>
        <div style={{ display: "flex", flexDirection: "row", gap: isMobile ? 24 : 0, width: "100%", alignItems: "center" }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ 
              width: isMobile ? 77 : 150, 
              height: isMobile ? 77 : 150, 
              borderRadius: "50%", 
              background: "var(--ig-gradient)", padding: isMobile ? 2 : 4 
            }}>
              <div style={{ 
                width: "100%", height: "100%", borderRadius: "50%", 
                background: "var(--surface)", border: isMobile ? "2px solid var(--bg)" : "4px solid var(--bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? 24 : 48, fontWeight: 900
              }}>
                {initials}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 300 }}>{username}</h2>
              <div style={{ display: "flex", gap: 8, width: isMobile ? "100%" : "auto", flexWrap: "wrap" }}>
                <button style={{ 
                  flex: isMobile ? 1 : "initial",
                  background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)", 
                  padding: "6px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" 
                }}>Edit Profile</button>
                
                <button 
                  onClick={handleDownloadApp}
                  title="Download App (PWA)"
                  style={{ 
                    background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)", 
                    padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>

                <button 
                  onClick={handleShareApp}
                  title="Share App"
                  style={{ 
                    background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)", 
                    padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8.684 10.703L15.316 14.122M15.316 9.878L8.684 13.297M21 17a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 11-6 0 3 3 0 016 0zM21 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>

                <button 
                  onClick={toggleTheme}
                  title="Toggle Theme"
                  style={{ 
                    background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)", 
                    padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <ThemeToggle isLight={theme === "light"} />
                </button>
              </div>
            </div>
            
            {!isMobile && (
              <div style={{ display: "flex", gap: 40, margin: "10px 0" }}>
                <div><strong style={{ fontWeight: 700 }}>{postCount}</strong> <span style={{ color: "var(--text-info)" }}>posts</span></div>
                <div><strong style={{ fontWeight: 700 }}>{followerCount}</strong> <span style={{ color: "var(--text-info)" }}>followers</span></div>
                <div><strong style={{ fontWeight: 700 }}>{followingCount}</strong> <span style={{ color: "var(--text-info)" }}>following</span></div>
              </div>
            )}
            
            {!isMobile && (
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700 }}>{username}</div>
                <p>Welcome to your Vyntra profile! ✨</p>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <div style={{ fontSize: 14, lineHeight: 1.4, width: "100%", padding: "0 4px" }}>
            <div style={{ fontWeight: 700 }}>{username}</div>
            <p>Welcome to your Vyntra profile! ✨</p>
          </div>
        )}

        {isMobile && (
          <div style={{ 
            display: "flex", width: "100%", justifyContent: "space-around", 
            padding: "12px 0", borderTop: "1px solid var(--border)", marginTop: 10
          }}>
            <div style={{ textAlign: "center", fontSize: 14 }}><div style={{ fontWeight: 700 }}>{postCount}</div><span style={{ color: "var(--text-muted)", fontSize: 13 }}>posts</span></div>
            <div style={{ textAlign: "center", fontSize: 14 }}><div style={{ fontWeight: 700 }}>{followerCount}</div><span style={{ color: "var(--text-muted)", fontSize: 13 }}>followers</span></div>
            <div style={{ textAlign: "center", fontSize: 14 }}><div style={{ fontWeight: 700 }}>{followingCount}</div><span style={{ color: "var(--text-muted)", fontSize: 13 }}>following</span></div>
          </div>
        )}
      </header>

      {/* ── Tabs ── */}
      <div style={{ 
        borderTop: isMobile ? "none" : "1px solid var(--border)", 
        display: "flex", justifyContent: "center", gap: isMobile ? 0 : 60,
        height: 44, alignItems: "center"
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", height: "100%", borderTop: !isMobile && "1px solid var(--text)", marginTop: -1, cursor: "pointer", color: "var(--accent)" }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", height: "100%", color: "var(--text-muted)", cursor: "pointer" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", height: "100%", color: "var(--text-muted)", cursor: "pointer" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.33 0-4.32-1.45-5.12-3.5h10.24c-.8 2.05-2.79 3.5-5.12 3.5z"/></svg>
        </div>
      </div>

      {/* ── Post Grid ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: isMobile ? 2 : 28,
        marginTop: isMobile ? 0 : 10 
      }}>
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ aspectRatio: "1/1", background: "var(--surface-hover)", animation: "pulse 1.5s infinite" }} />
          ))
        ) : posts.length === 0 ? (
          <div style={{ gridColumn: "span 3", textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
            <h3 style={{ fontSize: 20, fontWeight: 300 }}>No Posts Yet</h3>
          </div>
        ) : (
          posts.map((p, i) => (
            <div key={p._id || i} style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", cursor: "pointer", background: "var(--surface)" }}>
              <img 
                src={p.image} 
                alt="post" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {!isMobile && (
                <div style={{ 
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", opacity: 0, 
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "var(--transition)" 
                }} 
                onMouseEnter={(e) => e.target.style.opacity = 1} 
                onMouseLeave={(e) => e.target.style.opacity = 0}>
                  <div style={{ display: "flex", gap: 15, fontWeight: 700 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 42</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.5 8.38 8.38 0 013.9.9L22 3l-1.5 5.5L21 11.5z"/></svg> 12</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Profile;
