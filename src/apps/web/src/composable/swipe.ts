import { computed, ref, reactive } from 'vue';
import { useEventListener } from '@vueuse/core';

export function useSwipeMatches() {
  const { abs, floor, ceil } = Math;

  const coordsStart = reactive<{x: number, y:number}>({ x: 0, y: 0 });
  const coordsEnd = reactive<{x: number, y:number}>({ x: 0, y: 0 });

  const diffX = computed(() => coordsStart.x - coordsEnd.x);
  const diffY = computed(() => coordsStart.y - coordsEnd.y);

  const isSwiping = ref(false);
  const isScroll = ref(false);

  const activePosition = ref(1);
  const activeRate = ref(1);

  const direction = computed(() => {
    if (abs(diffX.value) > abs(diffY.value)) {
      return diffX.value > 0 ? 'LEFT' : 'RIGHT'
    }
    else {
      return diffY.value > 0 ? 'UP' : 'DOWN'
    }
  })

  const updateCoords = (e: TouchEvent, start: boolean) => {
    const [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
    if (start) {
      coordsStart.x = x
      coordsStart.y = y
    } else {
      coordsEnd.x = x
      coordsEnd.y = y
    }
  }
  const eventTouchEndOrCancel = (e: TouchEvent) => {
    if (!isScroll.value) {
      const rate = (direction.value === 'RIGHT') ? floor(activeRate.value) : ceil(activeRate.value);
      if (rate > 2 || rate < 0) {
        activeRate.value = activePosition.value;
      } else {
        activeRate.value = rate;
        setTimeout(() => {
          activePosition.value = rate;
        }, 500);
      }
    }
    isSwiping.value = false;
    isScroll.value = false;
  }

  useEventListener(document, 'touchstart', (e: TouchEvent) => {
    updateCoords(e, true);
    (direction.value === 'UP' || direction.value === 'DOWN') && (isScroll.value = true);
  }, { passive: false });
  useEventListener(document, 'touchmove', (e: TouchEvent) => {
    if (!isSwiping.value) isSwiping.value = true;
    if (direction.value === 'LEFT' || direction.value === 'RIGHT') {
      if (!isScroll.value) {
        e.preventDefault();
        const rate = activeRate.value = activePosition.value + 1/innerWidth * diffX.value;
        activeRate.value = (rate > 2 || rate < 0) ? activePosition.value : rate;
      }
    }
    updateCoords(e, false);
  }, { passive: false })
  useEventListener(document, 'touchend', eventTouchEndOrCancel);
  useEventListener(document, 'touchcancel', eventTouchEndOrCancel);

  return { activePosition, activeRate, isSwiping }
}