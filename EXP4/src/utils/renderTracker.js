// A tiny render counter, kept outside React state on purpose. Components
// call trackRender(name) once per render; a separate panel polls the
// counts instead of subscribing reactively, so we never trigger a
// "setState while another component is rendering" warning.

let counts = {
  CalendarView: 0,
  Events: 0,
  PostModal: 0,
  Sidebar: 0,
};

export function trackRender(name, amount = 1) {
  counts[name] = (counts[name] || 0) + amount;
}

export function getRenderCounts() {
  return { ...counts };
}

export function resetRenderCounts() {
  Object.keys(counts).forEach((key) => { counts[key] = 0; });
}