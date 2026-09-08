import React from 'react';
import { useSelector } from 'react-redux';

const PLATFORM_COLOR = {
  Instagram: '#d6336c',
  TikTok: '#212529',
  LinkedIn: '#0a66c2',
  X: '#1d1d1d',
  Facebook: '#1877f2',
};

export default function UpcomingPosts() {
  const posts = useSelector((state) => state.posts.posts);

  const draftsCount = posts.filter((p) => !p.date).length;
  const scheduled = posts
    .filter((p) => p.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <aside className="upcoming-panel">
      <div className="stat-row">
        <div className="stat-card">
          <strong>{draftsCount}</strong>
          <span>Drafts</span>
        </div>
        <div className="stat-card">
          <strong>{scheduled.length}</strong>
          <span>Scheduled</span>
        </div>
      </div>

      <h3>Upcoming posts</h3>
      {scheduled.length === 0 && <p className="empty">Nothing scheduled yet.</p>}
      <ul className="upcoming-list">
        {scheduled.slice(0, 6).map((post) => (
          <li key={post.id}>
            <span className="dot" style={{ background: PLATFORM_COLOR[post.platform] || '#999' }} />
            <div>
              <div className="upcoming-title">{post.title}</div>
              <div className="upcoming-meta">
                {post.platform} · {new Date(post.date).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}