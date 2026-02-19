// ── ACTIVE BOTTOM NAV ──
(function() {
    const page = location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-item').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page) a.classList.add('active');
    });
})();

// ── VIDEO LOADER ──
(function() {
    const loader = document.getElementById('vid-loader');
    const video  = document.getElementById('bgVideo');
    if (!loader || !video) return;
    function hide() {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 700);
    }
    video.addEventListener('canplaythrough', hide, { once: true });
    setTimeout(hide, 3000);
})();

// ── FLOATING MUSIC PLAYER — 3 Tracks ──
(function() {
    const TRACKS = [
        { file: 'stay.mp3',     title: 'S.T.A.Y',          sub: 'Hans Zimmer · Interstellar' },
        { file: 'vision.mp3',   title: 'Vision (Slowed)',   sub: 'Slowed & Reverb'            },
        { file: 'insomnia.mp3', title: 'Insomnia',          sub: 'The Sunnset'                },
    ];

    let trackIndex = parseInt(sessionStorage.getItem('mp_track') || '0');

    const style = document.createElement('style');
    style.textContent = `
        #music-player {
            position: fixed;
            bottom: calc(var(--bottom-nav-h) + 0.8rem);
            right: 1rem;
            z-index: 99;
            display: flex;
            flex-direction: column;
            padding: 0.6rem 0.9rem;
            background: rgba(5,5,15,0.88);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 40px;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
            user-select: none;
        }
        #music-player.expanded {
            border-radius: 18px;
            padding: 0.9rem 1rem;
            min-width: 200px;
        }
        .mp-top-row {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            cursor: pointer;
        }
        .mp-btn {
            width: 32px; height: 32px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            font-size: 0.7rem;
            color: #fff;
            cursor: pointer;
        }
        .mp-info { display: flex; flex-direction: column; gap: 0.05rem; }
        .mp-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.68rem; font-weight: 600;
            color: #fff; white-space: nowrap;
        }
        .mp-sub {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.55rem; color: rgba(255,255,255,0.3);
            text-transform: uppercase; letter-spacing: 0.04em;
        }
        .mp-eq {
            display: flex; align-items: flex-end;
            gap: 2px; height: 14px; flex-shrink: 0;
        }
        .mp-eq span {
            width: 2.5px; background: rgba(255,255,255,0.55);
            border-radius: 2px;
            animation: eqBar 0.8s ease-in-out infinite alternate;
        }
        .mp-eq span:nth-child(1) { height: 5px;  animation-duration: 0.6s; }
        .mp-eq span:nth-child(2) { height: 12px; animation-delay: 0.15s; animation-duration: 0.8s; }
        .mp-eq span:nth-child(3) { height: 8px;  animation-delay: 0.3s;  animation-duration: 0.7s; }
        .mp-eq span:nth-child(4) { height: 14px; animation-delay: 0.1s;  animation-duration: 0.9s; }
        @keyframes eqBar {
            from { transform: scaleY(0.3); opacity: 0.3; }
            to   { transform: scaleY(1);   opacity: 1;   }
        }
        .mp-eq.paused span { animation-play-state: paused; transform: scaleY(0.3); opacity: 0.2; }
        .mp-expanded-area {
            display: none; flex-direction: column; gap: 0.6rem;
            margin-top: 0.7rem; padding-top: 0.7rem;
            border-top: 1px solid rgba(255,255,255,0.07);
        }
        #music-player.expanded .mp-expanded-area { display: flex; }
        .mp-progress {
            width: 100%; height: 2px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px; cursor: pointer;
        }
        .mp-progress-fill {
            height: 100%; background: rgba(255,255,255,0.55);
            border-radius: 2px; width: 0%;
            transition: width 0.5s linear;
        }
        .mp-tracks { display: flex; flex-direction: column; gap: 0.2rem; }
        .mp-track-btn {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem; color: rgba(255,255,255,0.32);
            cursor: pointer; padding: 0.3rem 0.4rem;
            border-radius: 6px; transition: all 0.2s;
            display: flex; align-items: center; gap: 0.4rem;
        }
        .mp-track-btn.active { color: #fff; background: rgba(255,255,255,0.08); }
        .mp-track-btn.active::before { content: '▶'; font-size: 0.45rem; }
        .mp-track-btn:not(.active)::before { content: '·'; font-size: 0.7rem; }
        .mp-vol { display: flex; align-items: center; gap: 0.4rem; }
        .mp-vol-icon { font-size: 0.55rem; color: rgba(255,255,255,0.28); font-family: 'JetBrains Mono', monospace; }
        .mp-vol input[type=range] {
            -webkit-appearance: none; width: 65px; height: 2px;
            background: rgba(255,255,255,0.15); border-radius: 2px; outline: none; cursor: pointer;
        }
        .mp-vol input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 12px; height: 12px;
            background: #fff; border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    const player = document.createElement('div');
    player.id = 'music-player';
    player.innerHTML = `
        <div class="mp-top-row">
            <div class="mp-btn" id="mp-play-btn">▶</div>
            <div class="mp-info">
                <div class="mp-title" id="mp-title">${TRACKS[trackIndex].title}</div>
                <div class="mp-sub"   id="mp-sub"  >${TRACKS[trackIndex].sub}</div>
            </div>
            <div class="mp-eq paused" id="mp-eq">
                <span></span><span></span><span></span><span></span>
            </div>
        </div>
        <div class="mp-expanded-area">
            <div class="mp-progress" id="mp-progress">
                <div class="mp-progress-fill" id="mp-fill"></div>
            </div>
            <div class="mp-tracks" id="mp-tracks"></div>
            <div class="mp-vol">
                <span class="mp-vol-icon">VOL</span>
                <input type="range" id="mp-vol" min="0" max="1" step="0.05" value="0.6">
            </div>
        </div>
    `;
    document.body.appendChild(player);

    const trackList = document.getElementById('mp-tracks');
    TRACKS.forEach((t, i) => {
        const btn = document.createElement('div');
        btn.className = 'mp-track-btn' + (i === trackIndex ? ' active' : '');
        btn.textContent = t.title;
        btn.addEventListener('click', e => { e.stopPropagation(); switchTrack(i); });
        trackList.appendChild(btn);
    });

    const audio     = new Audio(TRACKS[trackIndex].file);
    audio.loop      = true;
    audio.volume    = parseFloat(sessionStorage.getItem('mp_vol') || '0.6');
    const playBtn   = document.getElementById('mp-play-btn');
    const eq        = document.getElementById('mp-eq');
    const fill      = document.getElementById('mp-fill');
    const progress  = document.getElementById('mp-progress');
    const volSlider = document.getElementById('mp-vol');
    const titleEl   = document.getElementById('mp-title');
    const subEl     = document.getElementById('mp-sub');
    volSlider.value = audio.volume;
    let playing = false;

    function setPlaying(state) {
        playing = state;
        playBtn.textContent = playing ? '⏸' : '▶';
        eq.classList.toggle('paused', !playing);
        if (playing) audio.play().catch(() => {}); else audio.pause();
        sessionStorage.setItem('mp_playing', playing ? '1' : '0');
    }

    function switchTrack(i) {
        const wasPlaying = playing;
        if (playing) { audio.pause(); playing = false; }
        trackIndex = i;
        sessionStorage.setItem('mp_track', i);
        sessionStorage.removeItem('mp_time');
        audio.src = TRACKS[i].file;
        titleEl.textContent = TRACKS[i].title;
        subEl.textContent   = TRACKS[i].sub;
        document.querySelectorAll('.mp-track-btn').forEach((b, idx) => {
            b.classList.toggle('active', idx === i);
        });
        if (wasPlaying) audio.addEventListener('canplay', () => setPlaying(true), { once: true });
    }

    audio.addEventListener('canplay', () => {
        const savedTime  = parseFloat(sessionStorage.getItem('mp_time') || '0');
        const wasPlaying = sessionStorage.getItem('mp_playing') === '1';
        if (savedTime) audio.currentTime = savedTime;
        if (wasPlaying) setPlaying(true);
    }, { once: true });

    setInterval(() => { sessionStorage.setItem('mp_time', audio.currentTime); }, 1000);
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('mp_time',    audio.currentTime);
        sessionStorage.setItem('mp_playing', playing ? '1' : '0');
        sessionStorage.setItem('mp_vol',     audio.volume);
        sessionStorage.setItem('mp_track',   trackIndex);
    });

    playBtn.addEventListener('click', e => { e.stopPropagation(); setPlaying(!playing); });
    player.addEventListener('click', () => player.classList.toggle('expanded'));
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    });
    progress.addEventListener('click', e => {
        e.stopPropagation();
        const rect = progress.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
    volSlider.addEventListener('input', e => {
        e.stopPropagation();
        audio.volume = parseFloat(e.target.value);
        sessionStorage.setItem('mp_vol', e.target.value);
    });
    volSlider.addEventListener('click', e => e.stopPropagation());
})();