let interval;
let chordIndex = 0;
let chords = [];

const chordText = document.getElementById('chordText');
const nextChordText = document.getElementById('nextChordText');
const nextChordPreview = document.getElementById('nextChordPreview');
const progressBar = document.getElementById('progressBar');

function updateChord() {
  if (chords.length === 0) return;

  chordText.textContent = chords[chordIndex];

  const nextIndex = (chordIndex + 1) % chords.length;
  nextChordText.textContent = chords[nextIndex];

  chordIndex = nextIndex;

  animateProgressBar();
}

function animateProgressBar() {
  const duration = parseInt(document.getElementById('intervalInput').value) * 1000;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';

  requestAnimationFrame(() => {
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = '100%';
  });
}

document.getElementById('startBtn').addEventListener('click', () => {
  const chordInput = document.getElementById('chordsInput').value;
  chords = chordInput.split(',').map(c => c.trim()).filter(c => c.length > 0);
  if (chords.length === 0) return;

  chordIndex = 0;
  updateChord();

  clearInterval(interval);
  const duration = parseInt(document.getElementById('intervalInput').value) * 1000;
  interval = setInterval(updateChord, duration);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(interval);
  chordText.textContent = '';
  nextChordText.textContent = '';
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
  const display = document.getElementById('display');
  if (!document.fullscreenElement) {
    display.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const display = document.getElementById('display');
  if (document.fullscreenElement) {
    display.classList.add('fullscreen-mode');
  } else {
    display.classList.remove('fullscreen-mode');
  }
});

document.getElementById('clearTimeBtn').addEventListener('click', () => {
  document.getElementById('intervalInput').value = '';
});

document.getElementById('clearChordsBtn').addEventListener('click', () => {
  document.getElementById('chordsInput').value = '';
});

document.getElementById('toggleChordListBtn').addEventListener('click', () => {
  const container = document.getElementById('presetChordsContainer');
  if (container.style.display === 'none') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
});

document.querySelectorAll('.presetChord').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById('chordsInput');
    const current = input.value.trim();
    if (current.length === 0) {
      input.value = btn.dataset.chord;
    } else {
      input.value = current + ', ' + btn.dataset.chord;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('presetChordsContainer').style.display = 'none';
});
