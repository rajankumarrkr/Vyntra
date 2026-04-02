import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

const TYPE_ICONS = { 
  like: { icon: "❤️", color: "#ED4956" }, 
  comment: { icon: "💬", color: "#0095F6" }, 
  follow: { icon: "👤", color: "#A855F7" } 
};

function NotificationItem({ n, index }) {
  const typeData = TYPE_ICONS[n.type] || { icon: "🔔", color: "var(--accent)" };
  const dateStr = n.createdAt
    ? new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
  const timeStr = n.createdAt
    ? new Date(n.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="notif-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="notif-icon" style={{ background: `${typeData.color}15`, color: typeData.color }}>
        {typeData.icon}
      </div>
      <div className="notif-body">
        <div className="notif-msg" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>
          {n.message}
        </div>
        <div className="notif-time" style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
          {dateStr} • {timeStr}
        </div>
      </div>
      {!n.read && (
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
      )}
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="notif-card" style={{ padding: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface-hover)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "70%", borderRadius: 4, background: "var(--surface-hover)" }} />
        <div style={{ height: 10, width: "30%", borderRadius: 4, background: "var(--surface-hover)" }} />
      </div>
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    socket.on("get_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => socket.off("get_notification");
  }, []);

  return (
    <div className="ig-main" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Activity</h2>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonItem key={i} />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-strong" style={{ textAlign: "center", padding: "80px 20px", borderRadius: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No activity yet</h3>
          <p style={{ color: "var(--text-info)", fontSize: 14 }}>Notifications about likes, comments, and following will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {notifications.map((n, i) => (
            <NotificationItem key={n._id} n={n} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;