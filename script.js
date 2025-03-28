/** === Final JS wired to your current HTML + iPhone detection + input filtering === */

let chords = [];
let currentIndex = 0;
let intervalId = null;

function updateChordDisplay() {
  const currentChordEl = document.getElementById('current-chord');
  const nextChordEl = document.getElementById('next-chord');
  currentChordEl.textContent = chords[currentIndex] || '♪';
  nextChordEl.textContent = chords[(currentIndex + 1) % chords.length] || '';
}

function animateProgressBar(duration) {
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
  void progressFill.offsetWidth;
  progressFill.style.transition = `width ${duration}s linear`;
  progressFill.style.width = '100%';
}

function displayNextChord() {
  updateChordDisplay();
  const time = parseFloat(document.getElementById('interval').value);
  animateProgressBar(time);
  currentIndex = (currentIndex + 1) % chords.length;
}

function startChordLoop() {
  const time = parseFloat(document.getElementById('interval').value);
  if (chords.length === 0 || isNaN(time)) return;
  displayNextChord();
  intervalId = setInterval(displayNextChord, time * 1000);
  document.getElementById('startBtn').textContent = 'Pause';
}

function stopChordLoop() {
  clearInterval(intervalId);
  intervalId = null;
  document.getElementById('startBtn').textContent = 'Start';
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
}

document.addEventListener('DOMContentLoaded', () => {
  const intervalInput = document.getElementById('interval');
  const chordsInput = document.getElementById('chords');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const clearTimeBtn = document.getElementById('clearTimeBtn');
  const clearChordsBtn = document.getElementById('clearChordsBtn');
  const toggleChordListBtn = document.getElementById('toggleChordListBtn');
  const presetChordsContainer = document.getElementById('presetChordsContainer');

  // iPhone check and hide fullscreen button
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isIOS && fullscreenBtn) {
    fullscreenBtn.style.display = 'none';
  }

  startBtn.addEventListener('click', () => {
    const rawInput = chordsInput.value.split(',').map(c => c.trim());
    const rejected = rawInput.filter(e => /[<>{}\[\];'"`\\]/.test(e));
    const clean = rawInput.filter(e => !/[<>{}\[\];'"`\\]/.test(e));

    if (rejected.length > 0) {
      alert("The following entries were rejected for containing disallowed characters:\n\n" + rejected.join(", "));
    }

    chords = clean;
    if (intervalId) {
      stopChordLoop();
    } else {
      currentIndex = 0;
      startChordLoop();
    }
  });

  resetBtn.addEventListener('click', () => {
    stopChordLoop();
    chords = [];
    currentIndex = 0;
    chordsInput.value = '';
    intervalInput.value = '1';
    document.getElementById('current-chord').textContent = '♪';
    document.getElementById('next-chord').textContent = '';
    document.getElementById('progress-fill').style.width = '0%';
  });

  fullscreenBtn.addEventListener('click', () => {
    const displaySection = document.getElementById('display-section');
    if (!document.fullscreenElement) {
      displaySection.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  clearTimeBtn.addEventListener('click', () => {
    intervalInput.value = '';
  });

  clearChordsBtn.addEventListener('click', () => {
    chordsInput.value = '';
  });

  toggleChordListBtn.addEventListener('click', () => {
    if (presetChordsContainer.style.display === 'none') {
      presetChordsContainer.style.display = 'flex';
    } else {
      presetChordsContainer.style.display = 'none';
    }
  });

  // Preset chord buttons (hardcoded in HTML)
  const presetButtons = presetChordsContainer.querySelectorAll('button');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chord = btn.textContent.trim();
      let current = chordsInput.value.trim();
      const existing = current ? current.split(',').map(c => c.trim()) : [];
      if (!existing.includes(chord)) {
        existing.push(chord);
        chordsInput.value = existing.join(', ');
      }
    });
  });
});
