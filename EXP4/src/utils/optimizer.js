export const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook'];

const PLATFORM_BEST_TIMES = {
  Instagram: [
    { hour: 11, minute: 0 },
    { hour: 19, minute: 0 },
  ],
  TikTok: [
    { hour: 9, minute: 0 },
    { hour: 20, minute: 0 },
  ],
  LinkedIn: [
    { hour: 8, minute: 30, weekdaysOnly: true },
    { hour: 12, minute: 0, weekdaysOnly: true },
  ],
  X: [
    { hour: 9, minute: 0 },
    { hour: 17, minute: 0 },
  ],
  Facebook: [
    { hour: 13, minute: 0 },
    { hour: 15, minute: 0 },
  ],
};

function pad(n) {
  return String(n).padStart(2, '0');
}

export function toLocalInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatLabel(date, from) {
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const isToday = date.toDateString() === from.toDateString();
  const tomorrow = new Date(from);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`;
}

export function getSuggestedSlots(platform, { count = 4, from = new Date() } = {}) {
  const slots = PLATFORM_BEST_TIMES[platform] || PLATFORM_BEST_TIMES.Instagram;
  const candidates = [];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const day = new Date(from);
    day.setDate(day.getDate() + dayOffset);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    slots.forEach((slot) => {
      if (slot.weekdaysOnly && isWeekend) return;
      const candidate = new Date(day);
      candidate.setHours(slot.hour, slot.minute, 0, 0);
      if (candidate.getTime() <= from.getTime()) return;
      candidates.push(candidate);
    });
  }

  candidates.sort((a, b) => a - b);
  return candidates.slice(0, count).map((date) => ({
    date,
    value: toLocalInputValue(date),
    label: formatLabel(date, from),
  }));
}

export function getBestOverallSlot(from = new Date()) {
  const all = PLATFORMS.flatMap((platform) =>
    getSuggestedSlots(platform, { count: 1, from }).map((s) => ({ ...s, platform }))
  );
  all.sort((a, b) => a.date - b.date);
  return all[0] || null;
}