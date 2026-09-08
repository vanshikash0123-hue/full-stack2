import { trackRender } from '../utils/renderTracker';

// Call at the top of a component body (alongside other hooks). Records
// one render of `name` every time that component renders.
export function useTrackRender(name, amount = 1) {
  trackRender(name, amount);
}