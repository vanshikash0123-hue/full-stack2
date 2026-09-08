import React, { useState, useEffect, useMemo } from 'react';
import { getSuggestedSlots, PLATFORMS } from '../utils/optimizer';
import { useTrackRender } from '../hooks/useTrackRender';

export default function PostModal({ initialPost, initialPlatform, onSave, onDelete, onClose }) {
  useTrackRender('PostModal');

  const [title, setTitle] = useState(initialPost?.title || '');
  const [platform, setPlatform] = useState(initialPost?.platform || initialPlatform || PLATFORMS[0]);
  const [date, setDate] = useState(initialPost?.date ? initialPost.date.slice(0, 16) : '');

  useEffect(() => {
    setTitle(initialPost?.title || '');
    setPlatform(initialPost?.platform || initialPlatform || PLATFORMS[0]);
    setDate(initialPost?.date ? initialPost.date.slice(0, 16) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPost]);

  const suggestions = useMemo(() => getSuggestedSlots(platform, { count: 4 }), [platform]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), platform, date: date ? new Date(date).toISOString() : null });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{initialPost ? 'Edit post' : 'New post'}</h3>

        <label>
          Content
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post caption or title" autoFocus />
        </label>

        <label>
          Platform
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <div className="optimizer-block">
          <span className="optimizer-label">Suggested best times</span>
          <div className="optimizer-chips">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s.value}
                className={`chip ${date === s.value ? 'chip-active' : ''}`}
                onClick={() => setDate(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label>
          Publish date &amp; time
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div className="modal-actions">
          {initialPost && (
            <button type="button" className="danger" onClick={() => onDelete(initialPost.id)}>Delete</button>
          )}
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}