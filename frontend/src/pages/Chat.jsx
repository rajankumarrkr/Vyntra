import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

const MOCK_CONVERSATIONS = [
  { id: "1", username: "cristiano", lastMsg: "Looking forward to it! 🔥", time: "2m", active: true },
  { id: "2", username: "leomessi", lastMsg: "Gracias amigo! 🙌", time: "15m", active: false },
  { id: "3", username: "natgeo", lastMsg: "New wildlife feature soon.", time: "2h", active: false },
  { id: "4", username: "nike", lastMsg: "Just do it.", time: "1d", active: false },
  { id: "5", username: "nasa", lastMsg: "Mars rover update incoming.", time: "3d", active: false },
];

const MOCK_MESSAGES = [
  { id: "m1", text: "Hey! How's the new Vyntra UI coming along?", sender: "them", time: "10:00 AM" },
  { id: "m2", text: "It's incredible! The glassmorphism looks very premium.", sender: "me", time: "10:05 AM" },
  { id: "m3", text: "That's exactly what I wanted to hear! Mobile responsive too?", sender: "them", time: "10:10 AM" },
  { id: "m4", text: "Yes, perfectly optimized for all devices. 🚀", sender: "me", time: "10:12 AM" },
];

function Chat() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMsg = { 
      id: Date.now().toString(), 
      text: message, 
      sender: "me", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages([...messages, newMsg]);
    
    socket.emit("send_message", {
      receiverId: activeChat.id,
      message,
    });
    
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        text: data.message, 
        sender: "them", 
        time: "Now" 
      }]);
    });
    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="ig-main" style={{ maxWidth: 935, height: "calc(100vh - 120px)", padding: 0 }}>
      <div className="chat-container glass-strong animate-fadeIn" style={{ height: "100%", borderRadius: 24 }}>
        
        {/* ── Sidebar ── */}
        <aside style={{ 
          width: 350, borderRight: "1px solid var(--border)", 
          display: activeChat ? "none" : "flex", flexDirection: "column",
          flexShrink: 0
        }} className="desktop-flex">
          <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>{user?.username}</h2>
            <button className="nav-icon-btn" style={{ marginLeft: "auto" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, padding: "8px 12px" }}>Messages</h3>
            {MOCK_CONVERSATIONS.map((conv) => (
              <div 
                key={conv.id} 
                className="conversation-item"
                onClick={() => setActiveChat(conv)}
                style={{ 
                  padding: 12, borderRadius: 16, display: "flex", gap: 12, 
                  alignItems: "center", cursor: "pointer", transition: "var(--transition)",
                  background: activeChat?.id === conv.id ? "var(--accent-light)" : "transparent"
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ig-gradient)", padding: 2 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {conv.username[0].toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{conv.username}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.lastMsg}
                  </div>
                </div>
                {conv.active && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <main style={{ flex: 1, display: activeChat ? "flex" : "none", flexDirection: "column" }} className="desktop-flex">
          {activeChat ? (
            <>
              <div style={{ height: 60, padding: "0 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <button className="nav-icon-btn mobile-only" onClick={() => setActiveChat(null)} style={{ padding: 0 }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ig-gradient)", padding: 2 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
                    {activeChat.username[0].toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{activeChat.username}</div>
                  <div style={{ fontSize: 11, color: "var(--success)" }}>Active now</div>
                </div>
                <button className="nav-icon-btn" style={{ marginLeft: "auto" }}>
                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5h18M3 10h18M3 15h18M3 20h18"/></svg>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px", display: "flex", flexDirection: "column", gap: 8 }} ref={scrollRef}>
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--ig-gradient)", padding: 4, margin: "0 auto 16px" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--surface)", border: "4px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>
                      {activeChat.username[0].toUpperCase()}
                    </div>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>{activeChat.username}</h3>
                  <p style={{ color: "var(--text-info)", fontSize: 14 }}>{activeChat.username} • Vyntra Member</p>
                  <button style={{ background: "var(--surface-hover)", border: "none", color: "var(--text)", padding: "8px 16px", borderRadius: 8, marginTop: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>View Profile</button>
                </div>
                
                <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", margin: "20px 0", textTransform: "uppercase", letterSpacing: 1 }}>Today</div>

                {messages.map((m) => (
                  <div key={m.id} className={`message-bubble ${m.sender === "me" ? "message-sent" : "message-received"}`}>
                    {m.text}
                  </div>
                ))}
              </div>

              <form style={{ padding: "20px 24px" }} onSubmit={handleSendMessage}>
                <div style={{ 
                  display: "flex", alignItems: "center", padding: "4px 16px", 
                  background: "var(--bg-sub)", borderRadius: 30, border: "1px solid var(--border)"
                }}>
                  <button type="button" className="nav-icon-btn"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></button>
                  <input 
                    className="chat-input" 
                    placeholder="Write a message..." 
                    style={{ background: "none", border: "none", color: "var(--text)", fontSize: 15, padding: "12px 10px", width: "100%", outline: "none" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {message.trim() ? (
                    <button type="submit" style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 800, cursor: "pointer", padding: "0 8px" }}>Send</button>
                  ) : (
                    <>
                      <button type="button" className="nav-icon-btn"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></button>
                      <button type="button" className="nav-icon-btn"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></button>
                    </>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
               <div style={{ 
                 width: 100, height: 100, borderRadius: "50%", border: "2px solid var(--text)", 
                 display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                 <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
               </div>
               <h2 style={{ fontSize: 22, fontWeight: 300 }}>Your Messages</h2>
               <p style={{ color: "var(--text-info)", fontSize: 14 }}>Send private photos and messages to a friend.</p>
               <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>Send Message</button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default Chat;