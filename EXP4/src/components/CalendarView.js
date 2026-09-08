import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost, schedulePost, deletePost } from '../redux/postsSlice';
import { getBestOverallSlot } from '../utils/optimizer';
import { useTrackRender } from '../hooks/useTrackRender';
import { trackRender } from '../utils/renderTracker';
import PostModal from './PostModal';

const PLATFORM_COLOR = {
  Instagram: '#d6336c',
  TikTok: '#212529',
  LinkedIn: '#0a66c2',
  X: '#1d1d1d',
  Facebook: '#1877f2',
};

export default function CalendarView() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [modalState, setModalState] = useState(null);

  useTrackRender('CalendarView');

  const events = useMemo(() => {
    const list = posts
      .filter((p) => p.date)
      .map((p) => ({
        id: p.id,
        title: p.title,
        start: p.date,
        backgroundColor: PLATFORM_COLOR[p.platform] || '#495057',
        borderColor: PLATFORM_COLOR[p.platform] || '#495057',
        extendedProps: { platform: p.platform },
      }));
    trackRender('Events', list.length);
    return list;
  }, [posts]);

  const handleDateClick = (info) => setModalState({ post: null, date: info.dateStr, platform: null });
  const handleEventClick = (info) => {
    const post = posts.find((p) => p.id === info.event.id);
    if (post) setModalState({ post, date: null, platform: null });
  };
  const handleEventDrop = (info) => dispatch(schedulePost({ id: info.event.id, date: info.event.startStr }));
  const handleEventReceive = (info) => {
    dispatch(schedulePost({ id: info.event.id, date: info.event.startStr }));
    info.event.remove();
  };

  const handleOptimize = () => {
    const best = getBestOverallSlot();
    if (!best) return;
    setModalState({ post: null, date: best.value, platform: best.platform });
  };

  const closeModal = () => setModalState(null);

  const handleSave = (values) => {
    if (modalState.post) {
      dispatch(updatePost({ id: modalState.post.id, changes: values }));
    } else {
      dispatch(addPost({ ...values, date: values.date || modalState.date }));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
    closeModal();
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        customButtons={{
          newPost: { text: '+ New post', click: () => setModalState({ post: null, date: null, platform: null }) },
          optimize: { text: 'Optimize calendar', click: handleOptimize },
        }}
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay newPost optimize',
        }}
        events={events}
        editable
        droppable
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventReceive={handleEventReceive}
        height="auto"
      />

      {modalState && (
        <PostModal
          initialPost={modalState.post}
          initialPlatform={modalState.platform}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}