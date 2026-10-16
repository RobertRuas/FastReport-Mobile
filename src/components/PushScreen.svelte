<script>
  // Ecrã empurrado da direita, com o gesto de deslizar da borda para voltar (como no iOS).
  import { cubicOut } from 'svelte/easing';
  let { onback, children, z = 10 } = $props();
  let dx = $state(0);
  let dragging = $state(false);
  let startX = 0, startY = 0, width = 1, locked = false;
  function push(node) {
    return { duration: 420, easing: cubicOut, css: (t) => `transform: translateX(${(1 - t) * 100}%); box-shadow: -10px 0 30px rgba(0,0,0,${0.25 * t})` };
  }
  function ts(e) {
    const t = e.touches[0];
    width = e.currentTarget.parentElement.offsetWidth;
    startX = t.clientX; startY = t.clientY; locked = false; dragging = true;
  }
  function tm(e) {
    if (!dragging) return;
    const t = e.touches[0];
    if (!locked && Math.abs(t.clientY - startY) > Math.abs(t.clientX - startX) + 6) { dragging = false; dx = 0; return; }
    locked = true;
    dx = Math.max(0, t.clientX - startX);
  }
  function te() {
    if (!dragging) return;
    dragging = false;
    if (dx > width * 0.33) { dx = width; setTimeout(() => { onback?.(); dx = 0; }, 220); }
    else dx = 0;
  }
</script>

<div class="screen push" style:z-index={z} style:transform={dx ? `translateX(${dx}px)` : null} class:dragging transition:push>
  {@render children()}
  <div class="edge" ontouchstart={ts} ontouchmove={tm} ontouchend={te} ontouchcancel={te} role="presentation"></div>
</div>

<style>
  .push { transition: transform 0.25s var(--ease); box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25); }
  .push.dragging { transition: none; }
  .edge { position: absolute; left: 0; top: 0; bottom: 0; width: 22px; z-index: 50; }
</style>
