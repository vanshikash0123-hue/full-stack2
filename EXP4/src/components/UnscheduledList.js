import React, { useEffect, useMemo, useRef } from 'react';
import { Draggable } from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import { useTrackRender } from '../hooks/useTrackRender';

export default function UnscheduledList() {
  const listRef = useRef(null);
  useTrackRender('Sidebar');

  const optimized = useSelector((state) => state.settings.optimized);

  // Optimized: select just the posts array — stable reference unless
  // posts actually change, so this component only re-renders when its
  // own data changes.
  // Not optimized: select the ENTIRE store — a new object reference after
  // every single dispatched action anywhere in the app, so this
  // component re-renders on everything, not just relevant changes.
  const selected = useSelector((state) => (optimized ? state.posts.posts : state));
  const allPosts = optimized ? selected : selected.posts.posts;

  const posts = useMemo(() => allPosts.filter((p) => !p.date), [allPosts]);

  useEffect(() => {
    if (!listRef.current) return;
    const draggable = new Draggable(listRef.current, {
      itemSelector: '.unscheduled-post',
      eventData: (el) => ({
        id: el.dataset.id,
        title: el.dataset.title,
        extendedProps: { platform: el.dataset.platform },
      }),
    });
    return () => draggable.destroy();
  }, []);

  return (
    <div className="unscheduled-list" ref={listRef}>
      <h3>Unscheduled posts</h3>
      <p className="hint">Drag a post onto a date to schedule it.</p>
      {posts.length === 0 && <p className="empty">Nothing waiting to be scheduled.</p>}
      {posts.map((post) => (
        <div
          key={post.id}
          className="unscheduled-post"
          data-id={post.id}
          data-title={post.title}
          data-platform={post.platform}
        >
          <span className="platform-dot" data-platform={post.platform} />
          <span>{post.title}</span>
          <small>{post.platform}</small>
        </div>
      ))}
    </div>
  );
}