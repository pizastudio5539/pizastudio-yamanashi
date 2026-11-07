
/* Accessible, self-contained film player. Muted on first open; no third-party requests. */
window.PizaFilm = (() => {
  'use strict';
  let filmURL = null, cleanup = null;
  function assetURL() {
    if (filmURL) return filmURL;
    const external = document.getElementById('piza-film-source');
    if (external && external.dataset.src) return (filmURL = external.dataset.src);
    const holder = document.getElementById('piza-film-data');
    if (!holder) throw new Error('Film data is missing.');
    const raw = atob(holder.textContent.trim()), size = 65536, chunks = [];
    for (let start = 0; start < raw.length; start += size) {
      const text = raw.slice(start, start + size), bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
      chunks.push(bytes);
    }
    filmURL = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    return filmURL;
  }
  function destroy() { if (cleanup) { cleanup(); cleanup = null; } }
  function mount(root) {
    destroy();
    const player = root.querySelector('.motion-film-player');
    if (!player) return;
    const video = player.querySelector('video'), start = player.querySelector('.motion-film-start'),
      play = player.querySelector('.film-play'), restart = player.querySelector('.film-restart'),
      sound = player.querySelector('.film-sound'), scrub = player.querySelector('.film-scrub'),
      fullscreen = player.querySelector('.film-full'), stamp = player.querySelector('.film-time'),
      chapters = [...player.querySelectorAll('[data-film-time]')], error = player.querySelector('.motion-film-error');
    const controller = new AbortController(), opts = { signal: controller.signal };
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const time = value => { value = Math.max(0, Number(value) || 0); return String(Math.floor(value / 60)).padStart(2,'0') + ':' + String(Math.floor(value % 60)).padStart(2,'0'); };
    let seeking = false;
    function refresh() {
      const duration = Number.isFinite(video.duration) ? video.duration : 24;
      const t = video.currentTime || 0;
      if (!seeking) scrub.value = String(t);
      scrub.max = String(duration); scrub.setAttribute('aria-valuetext', time(t) + '、全体 ' + time(duration));
      stamp.textContent = time(t) + ' / ' + time(duration);
      start.hidden = !video.paused && !video.ended;
      start.querySelector('[data-start-label]').textContent = video.ended ? 'もう一度見る' : '再生する';
      play.setAttribute('aria-label', video.paused ? 'モーションを再生する' : 'モーションを一時停止する');
      play.querySelector('[data-play-icon]').innerHTML = video.paused ? '<path d="m7 4 13 8-13 8Z" fill="currentColor" stroke="none"/>' : '<path d="M8 5v14M16 5v14" stroke-width="3"/>';
      sound.setAttribute('aria-label', video.muted ? '音声をオンにする' : '音声をオフにする');
      sound.setAttribute('aria-pressed', String(!video.muted));
      sound.querySelector('span').textContent = video.muted ? '音声オン' : '音声オフ';
      chapters.forEach((b, i) => b.setAttribute('aria-current', String(Math.min(5, Math.floor(t / 4)) === i)));
    }
    async function begin() {
      if (video.ended || video.currentTime >= 23.98) video.currentTime = 0;
      try { await video.play(); } catch (_) { start.hidden = false; }
      refresh();
    }
    function toggle() { if (video.paused) begin(); else { video.pause(); refresh(); } }
    video.muted = true; video.volume = .7;
    try { video.src = assetURL(); video.load(); } catch (_) { error.hidden = false; return; }
    video.controls = false;
    start.addEventListener('click', begin, opts);
    play.addEventListener('click', toggle, opts);
    restart.addEventListener('click', () => { video.currentTime = 0; begin(); }, opts);
    sound.addEventListener('click', () => { video.muted = !video.muted; refresh(); }, opts);
    scrub.addEventListener('input', () => { seeking = true; video.currentTime = Math.max(0, Math.min(Number(scrub.value), video.duration || 24)); refresh(); }, opts);
    scrub.addEventListener('change', () => { seeking = false; refresh(); }, opts);
    chapters.forEach(b => b.addEventListener('click', () => { video.currentTime = Number(b.dataset.filmTime); refresh(); }, opts));
    ['timeupdate','loadedmetadata','play','pause','ended','volumechange','seeked'].forEach(name => video.addEventListener(name, refresh, opts));
    video.addEventListener('error', () => { error.hidden = false; start.hidden = true; }, opts);
    if (!player.requestFullscreen && !video.webkitEnterFullscreen) fullscreen.hidden = true;
    fullscreen.addEventListener('click', async () => {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else if (player.requestFullscreen) await player.requestFullscreen(); else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); } catch (_) { fullscreen.title = 'この表示環境では全画面に切り替えられません。'; }
    }, opts);
    player.addEventListener('keydown', e => { if (e.code === 'Space' && (e.target === video || e.target === player)) { e.preventDefault(); toggle(); } }, opts);
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); }, opts);
    const observer = new MutationObserver(() => { if (document.documentElement.classList.contains('motion-paused')) video.pause(); });
    observer.observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
    cleanup = () => { controller.abort(); observer.disconnect(); video.pause(); video.removeAttribute('src'); video.load(); };
    refresh();
    if (!mq.matches && !document.documentElement.classList.contains('motion-paused')) begin();
  }
  window.addEventListener('pagehide', () => { destroy(); if (filmURL && filmURL.startsWith('blob:')) URL.revokeObjectURL(filmURL); filmURL = null; });
  return Object.freeze({ mount, destroy });
})();

