import { WritableSignal } from '@angular/core';
import { MonoTypeOperatorFunction, timer } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Hold the UI after an AI result so the solving orb can be seen. */
export const AI_REVEAL_MS = 1500;

export function holdAfterAi<T>(ms = AI_REVEAL_MS): MonoTypeOperatorFunction<T> {
  return delay(ms);
}

export function armAiReady(ready: WritableSignal<boolean>, ms = AI_REVEAL_MS) {
  ready.set(false);
  return timer(ms).subscribe(() => ready.set(true));
}
