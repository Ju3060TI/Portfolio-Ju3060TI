/* ============================================================
   NERON_CORE // INTERACTION LAYER
   ============================================================ */

(function () {
  'use strict';

  /* ---------- UPTIME COUNTER ---------- */
  var uptimeEl = document.getElementById('uptime');
  var startTime = Date.now();

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function tick() {
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    var h = Math.floor(elapsed / 3600);
    var m = Math.floor((elapsed % 3600) / 60);
    var s = elapsed % 60;
    if (uptimeEl) uptimeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  setInterval(tick, 1000);
  tick();

  /* ---------- PANIC MODULE (BSOD) ---------- */
  var statusField = document.getElementById('status-field');
  var panicOverlay = document.getElementById('panic-overlay');
  var bsodPercent = document.getElementById('bsod-percent');
  var percentInterval = null;
  var percentValue = 0;

  function openPanic() {
    if (!panicOverlay) return;
    panicOverlay.classList.add('active');
    panicOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    percentValue = 0;
    if (bsodPercent) bsodPercent.textContent = '0';

    clearInterval(percentInterval);
    percentInterval = setInterval(function () {
      // Windows BSOD style: stalls at ~30% typically
      if (percentValue < 30) {
        percentValue += Math.floor(Math.random() * 4) + 1;
      } else {
        percentValue += Math.random() < 0.15 ? 1 : 0;
      }
      if (percentValue > 99) percentValue = 99;
      if (bsodPercent) bsodPercent.textContent = percentValue;
    }, 420);
  }

  function closePanic() {
    if (!panicOverlay) return;
    panicOverlay.classList.remove('active');
    panicOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearInterval(percentInterval);
    percentInterval = null;
  }

  if (statusField) {
    statusField.addEventListener('dblclick', function (e) {
      e.preventDefault();
      openPanic();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      if (panicOverlay && panicOverlay.classList.contains('active')) {
        e.preventDefault();
        closePanic();
      }
    }
  });

  /* ---------- CARD HOVER BEACON (subtle log) ---------- */
  var cards = document.querySelectorAll('.card');
  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var title = card.querySelector('.card-title');
      if (title) {
        title.style.textShadow = '0 0 12px rgba(6, 182, 212, 0.9)';
      }
    });
    card.addEventListener('mouseleave', function () {
      var title = card.querySelector('.card-title');
      if (title) {
        title.style.textShadow = '0 0 6px rgba(6, 182, 212, 0.35)';
      }
    });
  });

  /* ---------- ACTION BUTTON FEEDBACK ---------- */
  var actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var original = btn.textContent;
      btn.textContent = 'LINKING...';
      setTimeout(function () {
        btn.textContent = original;
      }, 800);
    });
  });

  /* ---------- GLSL BLOCK SAFE HIGHLIGHT ---------- */
  if (window.Prism && typeof window.Prism.highlightAll === 'function') {
    window.addEventListener('load', function () {
      window.Prism.highlightAll();
    });
  }

})();
