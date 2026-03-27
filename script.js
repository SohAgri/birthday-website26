/**
 * script.js — Birthday Website for Jhia 💛
 * Handles: intro sequence, particles, candle blowing,
 *          cake cutting, gift/note/sparkle interactions,
 *          confetti, cursor sparkles, final celebration.
 */

/* ==============================================
   UTILITY HELPERS
   ============================================== */

/** Returns a random number between min and max */
function rand(min, max) { return Math.random() * (max - min) + min; }

/** Returns a random integer between min and max (inclusive) */
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

/** Clamps a value between lo and hi */
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ==============================================
   CUSTOM SPARKLE CURSOR
   ============================================== */
(function initCursorSparkle() {
  const canvas = document.getElementById('cursor-sparkle-canvas');
  const ctx    = canvas.getContext('2d');
  const sparks = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Also update CSS cursor dot position
  document.addEventListener('mousemove', function(e) {
    document.body.style.setProperty('--cursor-x', e.clientX + 'px');
    document.body.style.setProperty('--cursor-y', e.clientY + 'px');

    // Spawn a tiny sparkle particle on move
    for (let i = 0; i < 2; i++) {
      sparks.push({
        x:    e.clientX,
        y:    e.clientY,
        vx:   rand(-1.5, 1.5),
        vy:   rand(-2.5, -0.5),
        size: rand(2, 5),
        life: 1,
        color: `hsl(${randInt(35, 55)}, 100%, 65%)`
      });
    }
  });

  // Sparkle burst on click
  document.addEventListener('click', function(e) {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = rand(2, 6);
      sparks.push({
        x:    e.clientX,
        y:    e.clientY,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed,
        size: rand(3, 7),
        life: 1,
        color: `hsl(${randInt(30, 60)}, 100%, 65%)`
      });
    }
  });

  function animateSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x    += s.vx;
      s.y    += s.vy;
      s.vy   += 0.08; // gravity
      s.life -= 0.025;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = s.life;
      ctx.fillStyle   = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animateSparks);
  }
  animateSparks();
})();

/* ==============================================
   INTRO PARTICLES (dark golden)
   ============================================== */
(function initIntroParticles() {
  const canvas = document.getElementById('intro-particles');
  const ctx    = canvas.getContext('2d');
  const dots   = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create floating golden dots
  for (let i = 0; i < 80; i++) {
    dots.push({
      x:    rand(0, canvas.width),
      y:    rand(0, canvas.height),
      r:    rand(1, 3.5),
      vx:   rand(-0.3, 0.3),
      vy:   rand(-0.6, -0.1),
      life: rand(0.3, 1),
      dLife: rand(0.002, 0.006)
    });
  }

  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(function(d) {
      d.x    += d.vx;
      d.y    += d.vy;
      d.life -= d.dLife;
      if (d.life <= 0 || d.y < -5) {
        d.x    = rand(0, canvas.width);
        d.y    = canvas.height + 5;
        d.life = rand(0.4, 1);
      }

      ctx.save();
      ctx.globalAlpha = d.life;
      ctx.fillStyle   = `hsl(${randInt(40, 55)}, 90%, 70%)`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawDots);
  }
  drawDots();
})();

/* ==============================================
   CELEBRATION PARTICLES (warm sparkles)
   ============================================== */
function initCelebrationParticles() {
  const canvas = document.getElementById('celebration-particles');
  const ctx    = canvas.getContext('2d');
  const dots   = [];

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FFD700','#FFB3BA','#FFDCA8','#FFF3B0','#D4BFFF','#FFC0CB'];

  for (let i = 0; i < 60; i++) {
    dots.push({
      x:    rand(0, canvas.width),
      y:    rand(0, canvas.height),
      r:    rand(1.5, 4),
      vx:   rand(-0.4, 0.4),
      vy:   rand(-0.7, -0.1),
      color: colors[randInt(0, colors.length - 1)],
      life: rand(0.2, 0.9),
      dLife: rand(0.002, 0.005)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(function(d) {
      d.x    += d.vx;
      d.y    += d.vy;
      d.life -= d.dLife;
      if (d.life <= 0 || d.y < -5) {
        d.x    = rand(0, canvas.width);
        d.y    = canvas.height + 5;
        d.life = rand(0.3, 0.9);
      }

      ctx.save();
      ctx.globalAlpha = d.life;
      ctx.fillStyle   = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==============================================
   FINAL PARTICLES (cinematic golden)
   ============================================== */
function initFinalParticles() {
  const canvas = document.getElementById('final-particles');
  const ctx    = canvas.getContext('2d');
  const dots   = [];

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 100; i++) {
    dots.push({
      x:    rand(0, canvas.width),
      y:    rand(0, canvas.height),
      r:    rand(1, 4),
      vx:   rand(-0.4, 0.4),
      vy:   rand(-0.8, -0.15),
      life: rand(0.2, 1),
      dLife: rand(0.002, 0.005)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(function(d) {
      d.x    += d.vx;
      d.y    += d.vy;
      d.life -= d.dLife;
      if (d.life <= 0 || d.y < -5) {
        d.x    = rand(0, canvas.width);
        d.y    = canvas.height + 5;
        d.life = rand(0.3, 1);
      }

      ctx.save();
      ctx.globalAlpha = d.life;
      ctx.fillStyle   = `hsl(${randInt(38, 56)}, 95%, 70%)`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==============================================
   SPRINKLES GENERATOR (cake topping)
   ============================================== */
function generateSprinkles() {
  const colors = ['#FF6B9D','#FFD700','#6BCB77','#4D96FF','#FF9500','#D4BFFF'];
  const container = document.getElementById('top-sprinkles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const s = document.createElement('div');
    s.style.cssText = [
      'position:absolute',
      `left:${rand(5, 95)}%`,
      `top:${rand(10, 85)}%`,
      `width:${rand(5, 12)}px`,
      `height:${rand(2, 4)}px`,
      `background:${colors[randInt(0, colors.length - 1)]}`,
      `border-radius:2px`,
      `transform:rotate(${rand(0, 180)}deg)`,
      `opacity:0.85`
    ].join(';');
    container.appendChild(s);
  }

  // Also scatter dots on sides
  const midDec = document.getElementById('mid-decorations');
  const botDec = document.getElementById('bot-decorations');
  [midDec, botDec].forEach(function(dec) {
    if (!dec) return;
    for (let i = 0; i < 12; i++) {
      const d = document.createElement('div');
      d.style.cssText = [
        'position:absolute',
        `left:${rand(2, 96)}%`,
        `top:${rand(15, 80)}%`,
        `width:6px`,
        `height:6px`,
        `background:rgba(255,255,255,0.45)`,
        `border-radius:50%`
      ].join(';');
      dec.appendChild(d);
    }
  });
}

/* ==============================================
   CONFETTI BURST
   ============================================== */
const confettiCanvas = document.getElementById('confetti-canvas');
const confCtx        = confettiCanvas.getContext('2d');
let   confettiPieces = [];

function resizeConfetti() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti(x, y, count) {
  count = count || 120;
  x     = x     || window.innerWidth  / 2;
  y     = y     || window.innerHeight / 3;

  const palette = ['#FFD700','#FF6B9D','#6BCB77','#4D96FF','#FF9500','#D4BFFF','#FFFFFF','#FFB3BA'];
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(4, 14);
    confettiPieces.push({
      x:    x,
      y:    y,
      vx:   Math.cos(angle) * speed,
      vy:   Math.sin(angle) * speed - rand(2, 8),
      w:    rand(6, 14),
      h:    rand(3, 7),
      rot:  rand(0, 360),
      dRot: rand(-6, 6),
      color: palette[randInt(0, palette.length - 1)],
      life: 1,
      dLife: rand(0.006, 0.014)
    });
  }
}

function drawConfetti() {
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   += 0.25; // gravity
    p.vx   *= 0.99; // air friction
    p.rot  += p.dRot;
    p.life -= p.dLife;
    if (p.life <= 0) { confettiPieces.splice(i, 1); continue; }

    confCtx.save();
    confCtx.globalAlpha = p.life;
    confCtx.fillStyle   = p.color;
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.rot * Math.PI / 180);
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  }
  requestAnimationFrame(drawConfetti);
}
drawConfetti();

/* ==============================================
   SCREEN SPARKLE BURST (floating stars)
   ============================================== */
function triggerSparkles() {
  const canvas = document.getElementById('cursor-sparkle-canvas');
  const ctx    = canvas.getContext('2d');
  const stars  = [];

  for (let i = 0; i < 50; i++) {
    stars.push({
      x:    rand(0, window.innerWidth),
      y:    rand(0, window.innerHeight * 0.6),
      r:    rand(2, 8),
      vx:   rand(-2, 2),
      vy:   rand(-4, -0.5),
      life: 1,
      color:`hsl(${randInt(35, 60)}, 100%, 65%)`
    });
  }

  function draw() {
    if (!stars.length) return;
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x    += s.vx;
      s.y    += s.vy;
      s.vy   += 0.05;
      s.life -= 0.02;
      if (s.life <= 0) { stars.splice(i, 1); }
    }
    requestAnimationFrame(draw);
  }
  // Launch a big confetti burst as well
  launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
  draw();
}

/* ==============================================
   INTRO SEQUENCE
   Reveals lines one-by-one then fades to main page
   ============================================== */
function runIntroSequence() {
  const line1  = document.getElementById('intro-line-1');
  const line2  = document.getElementById('intro-line-2');
  const line3  = document.getElementById('intro-line-3');
  const screen = document.getElementById('intro-screen');
  const main   = document.getElementById('main-celebration');

  // Show line 1
  setTimeout(function() { line1.classList.add('visible'); }, 600);
  // Show line 2
  setTimeout(function() { line2.classList.add('visible'); }, 2000);
  // Show line 3
  setTimeout(function() { line3.classList.add('visible'); }, 3600);

  // Fade out intro, show main
  setTimeout(function() {
    screen.classList.add('fade-out');
    setTimeout(function() {
      screen.style.display = 'none';
      main.classList.remove('hidden');
      initCelebrationParticles();
      generateSprinkles();
      revealSectionsSequentially();
    }, 1200);
  }, 5400);
}

/* ==============================================
   SEQUENTIAL SECTION REVEAL
   Gradually show memory + surprises + photos + final
   ============================================== */
function revealSectionsSequentially() {
  // Show memory section after a few seconds
  setTimeout(function() {
    const mem = document.getElementById('memory-section');
    if (mem) mem.classList.remove('hidden');
  }, 1500);

  // Show surprises section
  setTimeout(function() {
    const surp = document.getElementById('surprises-section');
    if (surp) surp.classList.remove('hidden');
  }, 2400);

  // Show photo section
  setTimeout(function() {
    const ph = document.getElementById('photos-section');
    if (ph) ph.classList.remove('hidden');
  }, 3200);

  // Show final section
  setTimeout(function() {
    const fin = document.getElementById('final-section');
    if (fin) {
      fin.classList.remove('hidden');
      initFinalParticles();
    }
  }, 4200);
}

/* ==============================================
   CANDLE BLOWING
   ============================================== */
let candlesBlown = false;

document.getElementById('blow-btn').addEventListener('click', function() {
  if (candlesBlown) return;
  candlesBlown = true;

  const btn    = this;
  const flames = document.querySelectorAll('.candle-flame-wrap');
  const smokes = document.querySelectorAll('.candle-smoke');

  btn.disabled = true;
  btn.style.opacity = '0.6';

  // Screen flash effect
  document.getElementById('main-celebration').classList.add('screen-flash');
  setTimeout(function() {
    document.getElementById('main-celebration').classList.remove('screen-flash');
  }, 700);

  // Blow out each flame with a small stagger
  flames.forEach(function(f, i) {
    setTimeout(function() {
      f.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      f.style.opacity    = '0';
      f.style.transform  = 'scaleY(0.1) translateY(10px)';
    }, i * 160);
  });

  // Show smoke after flames go out
  setTimeout(function() {
    smokes.forEach(function(s, i) {
      setTimeout(function() {
        s.classList.remove('hidden');
        // Hide smoke after animation
        setTimeout(function() { s.classList.add('hidden'); }, 1600);
      }, i * 100);
    });

    // Confetti burst
    launchConfetti(window.innerWidth / 2, window.innerHeight / 4, 140);

    // Show wish message
    const wish = document.getElementById('wish-message');
    wish.classList.remove('hidden');

    // Reveal cut button
    setTimeout(function() {
      document.getElementById('cake-cut-section').classList.remove('hidden');
    }, 1200);

    btn.textContent = 'Candles blown! 🌬️';
  }, flames.length * 160 + 300);
});

/* ==============================================
   CAKE CUTTING
   ============================================== */
let cakeCut = false;

document.getElementById('cut-btn').addEventListener('click', function() {
  if (cakeCut) return;
  cakeCut = true;

  const btn   = this;
  const knife = document.getElementById('cake-knife');
  btn.disabled = true;

  // Show knife and animate it in
  knife.classList.remove('hidden');
  knife.style.cssText += '; transition: right 1.2s cubic-bezier(0.4,0,0.2,1), top 0.8s ease;';

  // Animate knife from right into cake center
  setTimeout(function() {
    knife.style.right = '42%';
    knife.style.top   = '45%';
  }, 50);

  // Slice down
  setTimeout(function() {
    knife.style.top = '70%';
    knife.style.transition = 'top 0.6s ease, right 1.2s ease';
  }, 1200);

  // Wobble the cake slightly
  const cake = document.getElementById('cake');
  setTimeout(function() {
    cake.style.transition = 'transform 0.25s ease';
    cake.style.transform  = 'translateY(-8px) rotate(-1deg)';
  }, 1400);
  setTimeout(function() {
    cake.style.transform = 'translateY(0) rotate(0)';
  }, 1650);

  // Retract knife and show slice effect
  setTimeout(function() {
    knife.style.right = '-120px';
    knife.style.top   = '40%';

    // Add a visual "cut" line on the cake
    const topLayer = document.getElementById('cake-top-layer');
    const cutLine  = document.createElement('div');
    cutLine.style.cssText = [
      'position:absolute',
      'top:0', 'bottom:0',
      'left:calc(50% - 1px)',
      'width:2px',
      'background:rgba(200,150,100,0.5)',
      'animation:fadeIn 0.5s ease forwards'
    ].join(';');
    topLayer.appendChild(cutLine);

    // Confetti
    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);

    // Show message
    const msg = document.getElementById('cake-time-message');
    msg.classList.remove('hidden');
    btn.textContent = 'Slice served! 🍰';
  }, 2400);
});

/* ==============================================
   SURPRISE INTERACTIONS
   ============================================== */

/* A. Open gift */
document.getElementById('gift-btn').addEventListener('click', function() {
  const lid    = document.getElementById('gift-lid');
  const reveal = document.getElementById('gift-reveal');
  lid.classList.add('open');
  reveal.classList.remove('hidden');
  launchConfetti(window.innerWidth * 0.25, window.innerHeight * 0.5, 60);
  this.textContent = '🎁 Opened!';
  this.disabled = true;
});

/* B. Special note */
document.getElementById('note-btn').addEventListener('click', function() {
  const flap   = document.getElementById('envelope-flap');
  const reveal = document.getElementById('note-reveal');
  flap.classList.add('open');
  reveal.classList.remove('hidden');
  this.textContent = '💌 Opened!';
  this.disabled = true;
});

/* C. Birthday sparkle */
document.getElementById('sparkle-btn').addEventListener('click', function() {
  const reveal = document.getElementById('sparkle-reveal');
  triggerSparkles();
  reveal.classList.remove('hidden');

  // Glow pulse on cake glow
  const glow = document.getElementById('cake-glow');
  if (glow) {
    glow.style.transition  = 'transform 0.3s ease, opacity 0.3s ease';
    glow.style.transform   = 'translate(-50%,-50%) scale(2)';
    glow.style.opacity     = '1';
    setTimeout(function() {
      glow.style.transform = 'translate(-50%,-50%) scale(1)';
      glow.style.opacity   = '0.7';
    }, 600);
  }

  this.textContent = '✨ Sparkling!';
});

/* D. Final surprise */
document.getElementById('final-surprise-btn').addEventListener('click', function() {
  const reveal = document.getElementById('final-surprise-reveal');
  reveal.classList.remove('hidden');
  launchConfetti(window.innerWidth * 0.75, window.innerHeight * 0.5, 80);
  triggerSparkles();
  this.textContent = '💛 Revealed!';
  this.disabled = true;
});

/* ==============================================
   RESTART BUTTON
   ============================================== */
document.getElementById('restart-btn').addEventListener('click', function() {
  // Reset all state flags
  candlesBlown = false;
  cakeCut      = false;

  // Scroll to top, then reload for clean state
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(function() {
    location.reload();
  }, 600);
});

/* ==============================================
   MUTE / UNMUTE (optional background music)
   ============================================== */
const bgMusic  = document.getElementById('bg-music');
const muteBtn  = document.getElementById('mute-btn');
let   isMuted  = true; // starts muted

muteBtn.addEventListener('click', function() {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;

  if (!isMuted && bgMusic.paused) {
    bgMusic.play().catch(function() {
      // Autoplay blocked — silently ignore
    });
  }

  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});

/* ==============================================
   PARALLAX EFFECT on decorative elements
   ============================================== */
(function initParallax() {
  document.addEventListener('mousemove', function(e) {
    const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

    // Subtle parallax on balloons container
    const balloons = document.getElementById('balloons-container');
    if (balloons) {
      balloons.style.transform = `translate(${xRatio * 8}px, ${yRatio * 5}px)`;
    }

    // Subtle parallax on cake glow
    const glow = document.getElementById('cake-glow');
    if (glow) {
      glow.style.transform =
        `translate(calc(-50% + ${xRatio * 12}px), calc(-50% + ${yRatio * 8}px))`;
    }
  });
})();

/* ==============================================
   INIT — Run everything on DOMContentLoaded
   ============================================== */
document.addEventListener('DOMContentLoaded', function() {
  generateSprinkles();
  runIntroSequence();
});
