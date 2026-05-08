/* ==========================================
   LOADING SCREEN
   ========================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loading-screen').classList.add('hidden');
  }, 1000);
});

/* ==========================================
   PARTICLES
   ========================================== */
function createParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (10 + Math.random() * 15) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    const size = (1 + Math.random() * 2) + 'px';
    p.style.width = size;
    p.style.height = size;
    container.appendChild(p);
  }
}

/* ==========================================
   CURSOR GLOW
   ========================================== */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animate() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================
   SCROLL REVEAL
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

/* ==========================================
   YOUTUBE PLAYER (real audio)
   ========================================== */
let ytPlayer = null;
let ytReady = false;

// YouTube IFrame API callback
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: 'sPQXOA6pzOg', // "Ngày Rời Chuyến Bay" - Minh Huy ft. Pinny
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  ytReady = true;
  // Set initial volume
  ytPlayer.setVolume(70);
  console.log('[Music] YouTube player ready. Song loaded.');

  // Update duration
  if (window.musicPlayer) {
    const dur = ytPlayer.getDuration();
    if (dur > 0) {
      window.musicPlayer.realDuration = dur;
      window.musicPlayer.updateDurationDisplay(dur);
    }
  }
}

function onPlayerStateChange(event) {
  if (!window.musicPlayer) return;

  // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
  if (event.data === YT.PlayerState.PLAYING) {
    window.musicPlayer.onRealPlay();
  } else if (event.data === YT.PlayerState.PAUSED) {
    window.musicPlayer.onRealPause();
  } else if (event.data === YT.PlayerState.ENDED) {
    window.musicPlayer.onRealEnded();
  }
}

/* ==========================================
   MUSIC PLAYER CLASS
   ========================================== */
class MusicPlayer {
  constructor() {
    this.isPlaying = false;
    this.realDuration = 238; // fallback

    // Inline elements
    this.playBtn = document.getElementById('play-btn');
    this.playIcon = document.getElementById('play-icon');
    this.progressFill = document.getElementById('progress-fill');
    this.progressWrapper = document.getElementById('progress-wrapper');
    this.discWrapper = document.getElementById('disc-wrapper');

    // Floating controls
    this.playBtnMain = document.getElementById('play-btn-main');
    this.playIconMain = document.getElementById('play-icon-main');
    this.currentTimeEl = document.getElementById('current-time');
    this.durationEl = document.getElementById('duration-time');
    this.volumeBtn = document.getElementById('volume-btn');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeIcon = document.getElementById('volume-icon');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');

    this.progressInterval = null;
    this.init();
  }

  init() {
    this.updateDurationDisplay(this.realDuration);
    this.bindEvents();
  }

  bindEvents() {
    // Play buttons
    if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
    if (this.playBtnMain) this.playBtnMain.addEventListener('click', () => this.togglePlay());
    // Click disc to play/pause too
    if (this.discWrapper) this.discWrapper.addEventListener('click', () => this.togglePlay());

    // Progress seek
    if (this.progressWrapper) {
      this.progressWrapper.addEventListener('click', (e) => this.seek(e));
    }

    // Volume
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
    }
    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => this.toggleMute());
    }

    // Skip
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.seekBackward());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.seekForward());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        this.togglePlay();
      }
      if (e.code === 'ArrowRight') this.seekForward();
      if (e.code === 'ArrowLeft') this.seekBackward();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    // Play via YouTube
    if (ytReady && ytPlayer) {
      ytPlayer.playVideo();
    }
    this.setPlayingState(true);
  }

  pause() {
    if (ytReady && ytPlayer) {
      ytPlayer.pauseVideo();
    }
    this.setPlayingState(false);
  }

  setPlayingState(playing) {
    this.isPlaying = playing;
    this.updateIcons(playing ? '⏸' : '▶');

    // Disc spin
    if (this.discWrapper) {
      if (playing) {
        this.discWrapper.classList.add('playing');
      } else {
        this.discWrapper.classList.remove('playing');
      }
    }

    // Progress update loop
    if (playing) {
      this.startProgressLoop();
    } else {
      this.stopProgressLoop();
    }
  }

  onRealPlay() {
    this.setPlayingState(true);
    // Update duration from YT
    if (ytPlayer) {
      const dur = ytPlayer.getDuration();
      if (dur > 0) {
        this.realDuration = dur;
        this.updateDurationDisplay(dur);
      }
    }
  }

  onRealPause() {
    this.setPlayingState(false);
  }

  onRealEnded() {
    this.setPlayingState(false);
    this.updateProgressBar(0);
    if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
  }

  startProgressLoop() {
    this.stopProgressLoop();
    this.progressInterval = setInterval(() => {
      if (ytReady && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        const current = ytPlayer.getCurrentTime();
        const duration = ytPlayer.getDuration() || this.realDuration;
        const pct = (current / duration) * 100;
        this.updateProgressBar(pct);
        if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(current);
      }
    }, 250);
  }

  stopProgressLoop() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  updateProgressBar(pct) {
    if (this.progressFill) this.progressFill.style.width = Math.min(pct, 100) + '%';
  }

  seek(e) {
    const rect = this.progressWrapper.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = (ytReady && ytPlayer) ? (ytPlayer.getDuration() || this.realDuration) : this.realDuration;
    const seekTo = percent * dur;

    if (ytReady && ytPlayer) {
      ytPlayer.seekTo(seekTo, true);
    }
    this.updateProgressBar(percent * 100);
    if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(seekTo);
  }

  seekForward() {
    if (ytReady && ytPlayer) {
      const cur = ytPlayer.getCurrentTime();
      ytPlayer.seekTo(Math.min(cur + 10, ytPlayer.getDuration()), true);
    }
  }

  seekBackward() {
    if (ytReady && ytPlayer) {
      const cur = ytPlayer.getCurrentTime();
      ytPlayer.seekTo(Math.max(cur - 10, 0), true);
    }
  }

  setVolume(val) {
    const v = parseInt(val);
    if (ytReady && ytPlayer) {
      ytPlayer.setVolume(v);
    }
    this.updateVolumeIcon(v / 100);
  }

  toggleMute() {
    if (!ytReady || !ytPlayer) return;

    if (ytPlayer.isMuted()) {
      ytPlayer.unMute();
      const v = ytPlayer.getVolume();
      if (this.volumeSlider) this.volumeSlider.value = v;
      this.updateVolumeIcon(v / 100);
    } else {
      ytPlayer.mute();
      if (this.volumeSlider) this.volumeSlider.value = 0;
      this.updateVolumeIcon(0);
    }
  }

  updateVolumeIcon(v) {
    if (!this.volumeIcon) return;
    this.volumeIcon.textContent = v === 0 ? '🔇' : v < 0.5 ? '🔉' : '🔊';
  }

  updateDurationDisplay(sec) {
    if (this.durationEl) this.durationEl.textContent = this.formatTime(sec);
  }

  updateIcons(icon) {
    if (this.playIcon) this.playIcon.textContent = icon;
    if (this.playIconMain) this.playIconMain.textContent = icon;
  }

  formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }
}

/* ==========================================
   TILT EFFECT
   ========================================== */
function initTiltEffect() {
  const card = document.querySelector('.profile-image-container');
  if (!card) return;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const rx = (e.clientY - r.top - r.height / 2) / 20;
    const ry = (r.left + r.width / 2 - e.clientX) / 20;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    setTimeout(() => card.style.transition = '', 400);
  });
}

/* ==========================================
   INIT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initCursorGlow();
  initScrollReveal();
  initTiltEffect();
  window.musicPlayer = new MusicPlayer();
});
