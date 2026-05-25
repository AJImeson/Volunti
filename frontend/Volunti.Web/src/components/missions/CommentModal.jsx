import React, { useState, useEffect, useRef } from "react";
import "./CommentModal.css";
import {
  getJobComments,
  addJobComment,
  deleteJobComment,
  toggleCommentLike,
} from "../../services/jobService";
import { getCurrentUser, getProfileImageUrl } from "../../services/authService";

export default function CommentModal({ mission, onClose, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const currentUser = getCurrentUser();
  const inputRef = useRef(null);

  const countTotal = (list) =>
    list.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  useEffect(() => {
    let cancelled = false;
    getJobComments(mission.id)
      .then((data) => {
        if (cancelled) return;
        setComments(data);
        onCountChange?.(countTotal(data));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda kommentarer.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mission.id]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed || isPosting) return;

    setIsPosting(true);
    setError("");
    try {
      const parentIdToSend = replyingTo?.parentId ?? replyingTo?.id ?? null;
      const finalContent =
        replyingTo?.mentionName && replyingTo?.parentId
          ? `@${replyingTo.mentionName} ${trimmed}`
          : trimmed;

      const newComment = await addJobComment(
        mission.id,
        finalContent,
        parentIdToSend,
      );

      setComments((prev) => {
        let next;
        if (parentIdToSend) {
          next = prev.map((c) =>
            c.id === parentIdToSend
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c,
          );
          setExpandedReplies((p) => new Set(p).add(parentIdToSend));
        } else {
          next = [newComment, ...prev];
        }
        onCountChange?.(countTotal(next));
        return next;
      });

      setInput("");
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Du måste vara inloggad för att kommentera.");
      } else {
        setError(err.response?.data?.detail || "Kunde inte skicka kommentar.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleDelete = async (commentId, isReply = false, parentId = null) => {
    if (!window.confirm("Ta bort denna kommentar?")) return;

    try {
      await deleteJobComment(mission.id, commentId);
      setComments((prev) => {
        let next;
        if (isReply && parentId) {
          next = prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
              : c,
          );
        } else {
          next = prev.filter((c) => c.id !== commentId);
        }
        onCountChange?.(countTotal(next));
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Kunde inte ta bort kommentaren.");
    }
  };

  // Svara på top level kommentar
  const handleReplyToComment = (comment) => {
    setReplyingTo({
      id: comment.id,
      parentId: null,
      authorName: comment.authorName,
      mentionName: null,
    });
    inputRef.current?.focus();
  };

  // Svara på ett svar
  const handleReplyToReply = (reply, parentId) => {
    setReplyingTo({
      id: reply.id,
      parentId: parentId,
      authorName: reply.authorName,
      mentionName: reply.authorName,
    });
    inputRef.current?.focus();
  };

  const handleToggleLike = async (commentId, isReply, parentId) => {
    // Optimistic update
    const updateLike = (c) => {
      const newLiked = !c.likedByMe;
      return {
        ...c,
        likedByMe: newLiked,
        likeCount: (c.likeCount || 0) + (newLiked ? 1 : -1),
      };
    };

    setComments((prev) =>
      prev.map((c) => {
        if (!isReply && c.id === commentId) return updateLike(c);
        if (isReply && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? updateLike(r) : r,
            ),
          };
        }
        return c;
      }),
    );

    try {
      const result = await toggleCommentLike(commentId);
      // Synka med serverns räknare
      setComments((prev) =>
        prev.map((c) => {
          if (!isReply && c.id === commentId) {
            return { ...c, likedByMe: result.liked, likeCount: result.count };
          }
          if (isReply && c.id === parentId) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? { ...r, likedByMe: result.liked, likeCount: result.count }
                  : r,
              ),
            };
          }
          return c;
        }),
      );
    } catch (err) {
      console.error(err);
      // Rollback
      setComments((prev) =>
        prev.map((c) => {
          if (!isReply && c.id === commentId) return updateLike(c);
          if (isReply && c.id === parentId) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? updateLike(r) : r,
              ),
            };
          }
          return c;
        }),
      );
    }
  };

  const fmtTime = (dateStr) => {
    const date = new Date(dateStr);
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return "nyss";
    if (diffMin < 60) return `${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} tim`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD} d`;
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  };

  return (
    <div className="comment-modal-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comment-modal-header">
          <h3>Kommentarer</h3>
          <button
            className="comment-modal-close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>

        <div className="comment-modal-body">
          {isLoading && <p className="comment-status">Laddar kommentarer...</p>}
          {!isLoading && comments.length === 0 && (
            <p className="comment-status">Inga kommentarer ännu. Var först!</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="comment-thread">
              <CommentItem
                comment={c}
                onReply={() => handleReplyToComment(c)}
                onDelete={handleDelete}
                onToggleLike={() => handleToggleLike(c.id, false, null)}
                currentUserId={currentUser?.id}
                fmtTime={fmtTime}
              />
              {c.replies?.length > 0 && (
                <div className="comment-replies-wrap">
                  <button
                    type="button"
                    className="comment-toggle-replies"
                    onClick={() => toggleReplies(c.id)}
                  >
                    <span className="comment-toggle-line"></span>
                    {expandedReplies.has(c.id)
                      ? `Dölj svar`
                      : `Visa ${c.replies.length} ${
                          c.replies.length === 1 ? "svar" : "svar"
                        }`}
                  </button>

                  {expandedReplies.has(c.id) && (
                    <div className="comment-replies">
                      {c.replies.map((r) => (
                        <CommentItem
                          key={r.id}
                          comment={r}
                          isReply
                          parentId={c.id}
                          onReply={() => handleReplyToReply(r, c.id)}
                          onDelete={handleDelete}
                          onToggleLike={() =>
                            handleToggleLike(r.id, true, c.id)
                          }
                          currentUserId={currentUser?.id}
                          fmtTime={fmtTime}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <form className="comment-modal-input-wrap" onSubmit={handleSubmit}>
          {replyingTo && (
            <div className="comment-reply-banner">
              Svarar på <strong>{replyingTo.authorName}</strong>
              <button
                type="button"
                className="comment-cancel-reply"
                onClick={() => setReplyingTo(null)}
              >
                ×
              </button>
            </div>
          )}
          {error && <p className="comment-error">{error}</p>}
          <div className="comment-input-row">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                replyingTo ? "Skriv ett svar..." : "Skriv en kommentar..."
              }
              className="comment-input"
              disabled={isPosting}
              maxLength={1000}
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={isPosting || !input.trim()}
            >
              {isPosting ? "..." : "Skicka"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMMENT ITEM
   ========================================================================== */
function CommentItem({
  comment,
  isReply = false,
  parentId = null,
  onReply,
  onDelete,
  onToggleLike,
  currentUserId,
  fmtTime,
}) {
  const isOwn = currentUserId && comment.userId === currentUserId;

  return (
    <div className={`comment-item ${isReply ? "is-reply" : ""}`}>
      <div className="comment-avatar">
        {comment.authorImageUrl ? (
          <img src={getProfileImageUrl(comment.authorImageUrl)} alt="" />
        ) : (
          <span>{comment.authorName?.charAt(0)?.toUpperCase() || "?"}</span>
        )}
      </div>
      <div className="comment-body">
        <div className="comment-bubble">
          <p className="comment-author">{comment.authorName}</p>
          <p className="comment-text">{comment.content}</p>
        </div>
        <div className="comment-actions">
          <span className="comment-time">{fmtTime(comment.createdAt)}</span>

          <button
            type="button"
            className={`comment-like-btn ${comment.likedByMe ? "liked" : ""}`}
            onClick={onToggleLike}
            aria-label="Gilla kommentar"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={comment.likedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
          </button>

          {onReply && (
            <button
              type="button"
              className="comment-action-btn"
              onClick={onReply}
            >
              Svara
            </button>
          )}
          {isOwn && (
            <button
              type="button"
              className="comment-action-btn comment-delete-btn"
              onClick={() => onDelete(comment.id, isReply, parentId)}
            >
              Ta bort
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
