const coverScreen = document.getElementById('coverScreen');
const invitationScreen = document.getElementById('invitationScreen');
const openButton = document.getElementById('openInvitation');
const audio = document.getElementById('weddingAudio');
const petalLayer = document.getElementById('petalLayer');

// The first eight seconds are kept as the instrumental intro.
// Then playback jumps to the vocal section used in the previous edit.
const INTRO_SECONDS = 8;
const VOCAL_START_SECONDS = 60;
let introFinished = false;
let petalTimer = null;

audio.loop = false;
audio.addEventListener('timeupdate', () => {
  if (!introFinished && audio.currentTime >= INTRO_SECONDS) {
    introFinished = true;
    audio.currentTime = VOCAL_START_SECONDS;
  }
});
audio.addEventListener('ended', async () => {
  audio.currentTime = VOCAL_START_SECONDS;
  try { await audio.play(); } catch (_) { /* playback can be blocked by the browser */ }
});

function createPetal() {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--drift', `${Math.round(Math.random() * 150 - 75)}px`);
  petal.style.animationDuration = `${8 + Math.random() * 7}s`;
  petal.style.transform = `rotate(${Math.round(Math.random() * 180)}deg)`;
  petalLayer.appendChild(petal);
  window.setTimeout(() => petal.remove(), 16000);
}

openButton.addEventListener('click', async () => {
  coverScreen.hidden = true;
  invitationScreen.hidden = false;
  document.body.classList.add('invitation-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  petalTimer = window.setInterval(createPetal, 720);
  for (let i = 0; i < 7; i++) window.setTimeout(createPetal, i * 180);
  try {
    audio.currentTime = 0;
    await audio.play();
  } catch (_) {
    // Mobile browsers may block audio if the user has disabled media playback.
  }
});

// Add the exact Google Maps URL here later when the venue pin is confirmed.
const MAP_URL = '';
const mapLink = document.getElementById('mapLink');
if (MAP_URL.trim()) {
  mapLink.href = MAP_URL;
  mapLink.hidden = false;
}
