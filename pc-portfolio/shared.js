// ── MOBILE NAV ──
(function() {
    const toggle = document.getElementById('mobileToggle');
    const links  = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });
})();

// ── SCROLL TO TOP ──
(function() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── ACTIVE NAV LINK ──
(function() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
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
            bottom: 2rem;
            left: 2rem;
            z-index: 999;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0.75rem 1.1rem;
            background: rgba(5,5,15,0.85);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50px;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
            user-select: none;
            min-width: 0;
        }
        #music-player:hover {
            border-color: rgba(255,255,255,0.22);
            transform: translateY(-2px);
        }
        #music-player.expanded {
            border-radius: 18px;
            padding: 1rem 1.2rem;
            min-width: 220px;
        }
        .mp-top-row {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            cursor: pointer;
        }
        .mp-btn {
            width: 34px; height: 34px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            font-size: 0.75rem;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
        }
        .mp-btn:hover { background: rgba(255,255,255,0.22); }
        .mp-info { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
        .mp-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem; font-weight: 600;
            color: #fff; white-space: nowrap; letter-spacing: 0.02em;
        }
        .mp-sub {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.58rem; color: rgba(255,255,255,0.32);
            letter-spacing: 0.05em; text-transform: uppercase;
        }
        .mp-eq {
            display: flex; align-items: flex-end;
            gap: 2px; height: 16px; flex-shrink: 0;
        }
        .mp-eq span {
            width: 3px; background: rgba(255,255,255,0.6);
            border-radius: 2px;
            animation: eqBar 0.8s ease-in-out infinite alternate;
        }
        .mp-eq span:nth-child(1) { height: 6px;  animation-delay: 0s;    animation-duration: 0.6s; }
        .mp-eq span:nth-child(2) { height: 14px; animation-delay: 0.15s; animation-duration: 0.8s; }
        .mp-eq span:nth-child(3) { height: 10px; animation-delay: 0.3s;  animation-duration: 0.7s; }
        .mp-eq span:nth-child(4) { height: 16px; animation-delay: 0.1s;  animation-duration: 0.9s; }
        @keyframes eqBar {
            from { transform: scaleY(0.3); opacity: 0.4; }
            to   { transform: scaleY(1);   opacity: 1;   }
        }
        .mp-eq.paused span { animation-play-state: paused; transform: scaleY(0.3); opacity: 0.25; }

        /* Expanded section */
        .mp-expanded-area {
            display: none;
            flex-direction: column;
            gap: 0.6rem;
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px solid rgba(255,255,255,0.07);
        }
        #music-player.expanded .mp-expanded-area { display: flex; }

        /* Progress */
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

        /* Track switcher */
        .mp-tracks {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }
        .mp-track-btn {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.62rem;
            color: rgba(255,255,255,0.35);
            cursor: pointer;
            padding: 0.3rem 0.5rem;
            border-radius: 6px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            letter-spacing: 0.03em;
        }
        .mp-track-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
        .mp-track-btn.active { color: #fff; background: rgba(255,255,255,0.08); }
        .mp-track-btn.active::before { content: '▶'; font-size: 0.5rem; }
        .mp-track-btn:not(.active)::before { content: '·'; font-size: 0.8rem; }

        /* Volume */
        .mp-vol { display: flex; align-items: center; gap: 0.5rem; }
        .mp-vol-icon { font-size: 0.58rem; color: rgba(255,255,255,0.28); font-family: 'JetBrains Mono', monospace; }
        .mp-vol input[type=range] {
            -webkit-appearance: none; width: 72px; height: 2px;
            background: rgba(255,255,255,0.15); border-radius: 2px;
            outline: none; cursor: pointer;
        }
        .mp-vol input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 10px; height: 10px;
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

    // Build track buttons
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
        // Update active button
        document.querySelectorAll('.mp-track-btn').forEach((b, idx) => {
            b.classList.toggle('active', idx === i);
        });
        if (wasPlaying) {
            audio.addEventListener('canplay', () => setPlaying(true), { once: true });
        }
    }

    // Restore session
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