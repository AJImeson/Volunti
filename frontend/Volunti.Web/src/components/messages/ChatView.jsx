import React, { useState, useEffect, useRef } from "react";
import {
  getGroupDetails,
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
  markGroupAsRead,
} from "../../services/messageService";
import { getProfileImageUrl } from "../../services/authService";

export default function ChatView({
  groupId,
  onBack,
  onMessageSent,
  onOpenSettings,
}) {
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ladda gruppdetaljer + meddelanden
  useEffect(() => {
    let cancelled = false;

    Promise.all([getGroupDetails(groupId), getGroupMessages(groupId)])
      .then(([groupData, msgsData]) => {
        if (cancelled) return;
        setGroup(groupData);
        setMessages(msgsData);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda chatten.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // Polling var 5 sek för nya meddelanden
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const latest = await getGroupMessages(groupId);
        setMessages((prev) => {
          // Sammanslagning: ersätt om antalet skiljer sig
          if (latest.length !== prev.length) return latest;
          // Annars kolla om sista id:t skiljer sig
          if (latest[latest.length - 1]?.id !== prev[prev.length - 1]?.id) {
            return latest;
          }
          return prev;
        });
      } catch {
        // Tyst fail på polling
      }
    }, 5000);
    return () => clearInterval(id);
  }, [groupId]);

  // Markera som läst när vi öppnar/får nya meddelanden
  useEffect(() => {
    if (!isLoading) {
      markGroupAsRead(groupId).catch(() => {});
    }
  }, [groupId, isLoading, messages.length]);

  // Scrolla till botten när nya meddelanden kommer
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const trimmed = input.trim();
    if ((!trimmed && pendingFiles.length === 0) || isSending) return;

    setIsSending(true);
    try {
      const newMsg = await sendGroupMessage(groupId, trimmed, pendingFiles);
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      setPendingFiles([]);
      onMessageSent?.();
    } catch (err) {
      console.error(err);
      setError("Kunde inte skicka meddelandet.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Ta bort detta meddelande?")) return;
    try {
      await deleteGroupMessage(groupId, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error(err);
      alert("Kunde inte ta bort meddelandet.");
    }
  };

  if (isLoading) {
    return <div className="chat-status">Laddar chatten...</div>;
  }

  if (error && !group) {
    return <div className="chat-status chat-error">{error}</div>;
  }

  return (
    <div className="chat-view">
      {/* HEADER */}
      <div className="chat-header">
        <button
          className="chat-back-btn"
          onClick={onBack}
          aria-label="Tillbaka"
        >
          ‹
        </button>
        <div className="chat-header-avatar">
          {group.imageUrl ? (
            <img src={getProfileImageUrl(group.imageUrl)} alt="" />
          ) : (
            <span>{(group.name?.charAt(0) || "?").toUpperCase()}</span>
          )}
        </div>
        <div className="chat-header-info">
          <h2>{group.name}</h2>
          <p>{group.members?.length || 0} medlemmar</p>
        </div>
        <button
          type="button"
          className="chat-header-settings"
          onClick={onOpenSettings}
          aria-label="Gruppinställningar"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      {/* MEDDELANDEN */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-status">
            Inga meddelanden ännu. Skriv något för att starta!
          </p>
        ) : (
          messages.map((msg, i) => {
            const showDateDivider =
              i === 0 || !sameDay(messages[i - 1].createdAt, msg.createdAt);
            const showAuthor =
              !msg.isMine &&
              (i === 0 ||
                messages[i - 1].senderUserId !== msg.senderUserId ||
                showDateDivider);

            return (
              <React.Fragment key={msg.id}>
                {showDateDivider && (
                  <div className="chat-date-divider">
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                )}
                <MessageBubble
                  message={msg}
                  showAuthor={showAuthor}
                  onDelete={() => handleDelete(msg.id)}
                />
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form className="chat-input-wrap" onSubmit={handleSend}>
        {pendingFiles.length > 0 && (
          <div className="chat-pending-files">
            {pendingFiles.map((f, i) => (
              <div key={i} className="chat-pending-file">
                <span>📎 {f.name}</span>
                <button
                  type="button"
                  onClick={() => removePendingFile(i)}
                  aria-label="Ta bort"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {error && <p className="chat-error-inline">{error}</p>}
        <div className="chat-input-row">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="chat-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Bifoga fil"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder="Skriv ett meddelande..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            maxLength={4000}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isSending || (!input.trim() && pendingFiles.length === 0)}
          >
            {isSending ? "..." : "Skicka"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================================================
   MESSAGE BUBBLE
   ========================================================================== */
function MessageBubble({ message, showAuthor, onDelete }) {
  const apiBase = import.meta.env.VITE_API_BASE;

  return (
    <div className={`chat-message ${message.isMine ? "is-mine" : ""}`}>
      {!message.isMine && (
        <div className="chat-msg-avatar">
          {message.senderImageUrl ? (
            <img src={getProfileImageUrl(message.senderImageUrl)} alt="" />
          ) : (
            <span>{(message.senderName?.charAt(0) || "?").toUpperCase()}</span>
          )}
        </div>
      )}
      <div className="chat-msg-body">
        {showAuthor && <p className="chat-msg-author">{message.senderName}</p>}
        <div className="chat-msg-bubble">
          {message.content && (
            <p className="chat-msg-text">{message.content}</p>
          )}
          {message.attachments?.length > 0 && (
            <div className="chat-msg-attachments">
              {message.attachments.map((a) => (
                <AttachmentItem key={a.id} attachment={a} apiBase={apiBase} />
              ))}
            </div>
          )}
        </div>
        <div className="chat-msg-meta">
          <span className="chat-msg-time">
            {new Date(message.createdAt).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.isMine && (
            <button
              type="button"
              className="chat-msg-delete"
              onClick={onDelete}
              aria-label="Ta bort"
            >
              Ta bort
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AttachmentItem({ attachment, apiBase }) {
  const url = `${apiBase}${attachment.downloadUrl}`;

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (attachment.isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-attachment-image"
      >
        <img src={url} alt={attachment.originalFileName} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-attachment-file"
    >
      <span className="chat-attachment-icon">📄</span>
      <div className="chat-attachment-info">
        <span className="chat-attachment-name">
          {attachment.originalFileName}
        </span>
        <span className="chat-attachment-size">
          {formatSize(attachment.fileSizeBytes)}
        </span>
      </div>
    </a>
  );
}

/* ==========================================================================
   HJÄLPARE
   ========================================================================== */
function sameDay(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Idag";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Igår";

  return date.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
