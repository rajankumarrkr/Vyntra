import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function StoryItem({ name, active = true, isUser = false }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  return (
    <div className="story-item">
      <div className="story-ring" style={{ background: active ? "var(--ig-gradient)" : "var(--border)" }}>
        <div className="story-avatar">
          {isUser ? (
            <div style={{ width: "100%", height: "100%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800" }}>
              {initials}
            </div>
          ) : (
             <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          {isUser && (
            <div style={{ 
              position: "absolute", bottom: 0, right: 0, width: 22, height: 22, 
              borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" 
            }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
          )}
        </div>
      </div>
      <span className="story-username">{name}</span>
    </div>
  );
}

function StoriesBar() {
  const mockStories = ["cristiano", "leomessi", "nasa", "nike", "natgeo"];
  return (
    <div className="stories-container glass" style={{ marginBottom: 20 }}>
      <StoryItem name="Your story" active={false} isUser={true} />
      {mockStories.map((s, i) => (
        <StoryItem key={i} name={s} active={true} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(c => wasLiked ? c - 1 : c + 1);
    try { 
      await API.post(`/posts/${post._id}/like`); 
    } catch (_) { 
      setLiked(wasLiked); 
      setLikeCount(c => wasLiked ? c + 1 : c - 1); 
    } finally {
      setIsLiking(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/posts/${post._id}/comments`);
      setComments(data);
    } catch (_) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText("");
      fetchComments();
    } catch (_) {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="post-card animate-fadeIn">
      <div className="post-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="story-ring" style={{ width: 44, height: 44, padding: 2, background: "var(--ig-gradient)" }}>
            <div className="story-avatar" style={{ border: "2px solid var(--bg)" }}>
               <div style={{ width: "100%", height: "100%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                 {post.user?.username?.slice(0, 2).toUpperCase() || "??"}
               </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{post.user?.username}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.48 10-10S17.5 2 12 2zm-1.1 14.5l-4.5-4.5 1.4-1.4 3.1 3.1 7.1-7.1 1.4 1.4-8.5 8.5z"/></svg>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Suggested for you</span>
          </div>
        </div>
        <button className="nav-icon-btn">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      <div className="post-img-container" onDoubleClick={handleLike} style={{ cursor: "pointer" }}>
        <img src={post.image} alt="post" className="post-img" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>

      <div className="post-actions-row" style={{ padding: "8px 12px" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={handleLike} className="nav-icon-btn" style={{ color: liked ? "var(--danger)" : "var(--text)", padding: 0 }}>
            {liked ? (
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ) : (
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg>
            )}
          </button>
          <button className="nav-icon-btn" style={{ padding: 0 }} onClick={() => { if(!showComments) fetchComments(); setShowComments(!showComments); }}>
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.5 8.38 8.38 0 013.9.9L22 3l-1.5 5.5L21 11.5z"/></svg>
          </button>
          <button className="nav-icon-btn" style={{ padding: 0 }}>
             <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
        <button className="nav-icon-btn" style={{ padding: 0 }}>
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></svg>
        </button>
      </div>

      <div style={{ padding: "0 14px 12px" }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{likeCount.toLocaleString()} likes</div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          <strong style={{ marginRight: 6 }}>{post.user?.username}</strong>
          {post.caption}
        </div>
        
        {comments.length > 0 && !showComments && (
          <button 
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 14, padding: "8px 0 0", cursor: "pointer", fontWeight: 500 }}
            onClick={() => { fetchComments(); setShowComments(true); }}
          >
            View all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="glass-strong" style={{ marginTop: 12, borderRadius: 12, padding: 12 }}>
            {comments.map((c, i) => (
              <div key={i} style={{ fontSize: 13, marginBottom: 6 }}>
                <strong style={{ marginRight: 6 }}>{c.user?.username}</strong> {c.text}
              </div>
            ))}
            <form onSubmit={handleComment} style={{ marginTop: 10 }}>
              <input 
                placeholder="Add a comment..." 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)}
                className="input"
                style={{ padding: "8px 12px", fontSize: 13, borderRadius: 10 }}
              />
            </form>
          </div>
        )}

        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {timeAgo(post.createdAt)}
        </div>
      </div>
    </div>
  );
}

function Feed({ onActivityClick, onMessagesClick }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts/feed");
      setPosts(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="ig-main" style={{ padding: "0 0 100px" }}>
      {/* ── Feed Header ── */}
      <header style={{ 
        height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "0 16px", position: "sticky", top: 0, zIndex: 100, background: "var(--bg)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ fontFamily: "'Grand Hotel', cursive", fontSize: "2.2rem", cursor: "pointer" }}>
          Vyntra
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="nav-icon-btn" onClick={onActivityClick} title="Activity">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg>
          </button>
          <button className="nav-icon-btn" onClick={onMessagesClick} title="Messages">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </header>

      <div style={{ padding: "16px 0" }}>
        <StoriesBar />
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div className="spinner" style={{ width: 40, height: 40 }}></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-strong" style={{ textAlign: "center", padding: "60px 20px", borderRadius: 20 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Welcome to Vyntra</h2>
          <p style={{ color: "var(--text-info)", fontSize: 14 }}>Follow people to start seeing their photos and videos.</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

export default Feed;