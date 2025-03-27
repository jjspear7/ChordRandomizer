document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('chord-display');
  const current = document.getElementById('current-chord');
  const next = document.getElementById('next-chord');
  const fill = document.getElementById('progress-fill');
  const intervalSelect = document.getElementById('interval');

  let chords = [];
  let index = 0;
  let loop = null;

  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const clearChordsBtn = document.getElementById('clearChordsBtn');
  const chordInput = document.getElementById('chords');
  const toggleChordListBtn = document.getElementById('toggleChordListBtn');
  const presetChordsContainer = document.getElementById('presetChordsContainer');

  const clearTimeBtn = document.getElementById('clearTimeBtn');
  const timeInput = document.getElementById('interval');
  clearTimeBtn.addEventListener('click', () => {
    timeInput.value = '';
  });

  clearChordsBtn.addEventListener('click', () => {
    chordInput.value = '';
  });

  function updateChordList() {
    chords = chordInput.value.split(',').map(c => c.trim()).filter(c => c);
    if (chords.length > 0) {
      index = 0;
      displayChord();
    }
  }

  function displayChord() {
    if (chords.length === 0) {
      current.textContent = '♪';
      next.textContent = '';
      return;
    }
    current.textContent = chords[index];
    next.textContent = chords[(index + 1) % chords.length];
  }

  function animateProgressBar(duration) {
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth; // trigger reflow
    fill.style.transition = `width ${duration}ms linear`;
    fill.style.width = '100%';
  }

  function startChordLoop() {
    updateChordList();
    const interval = parseFloat(intervalSelect.value) * 1000;
    if (!interval || chords.length === 0) return;
    displayChord();
    animateProgressBar(interval);

    loop = setInterval(() => {
      index = (index + 1) % chords.length;
      displayChord();
      animateProgressBar(interval);
    }, interval);
  }

  function stopChordLoop() {
    clearInterval(loop);
    loop = null;
    fill.style.transition = 'none';
    fill.style.width = '0%';
  }

  startBtn.addEventListener('click', () => {
    stopChordLoop();
    startChordLoop();
  });

  resetBtn.addEventListener('click', () => {
    stopChordLoop();
    index = 0;
    displayChord();
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  toggleChordListBtn.addEventListener('click', () => {
    const isHidden = presetChordsContainer.style.display === 'none';
    presetChordsContainer.style.display = isHidden ? 'flex' : 'none';
    toggleChordListBtn.textContent = isHidden ? 'Hide Chord Buttons' : 'Show Chord Buttons';
  });

  document.querySelectorAll('#presetChordsContainer button').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.textContent.trim();
      const currentVal = chordInput.value.trim();
      if (!currentVal.includes(val)) {
        chordInput.value = currentVal ? `${currentVal}, ${val}` : val;
        updateChordList();
      }
    });
  });

  // Initial display setup
  displayChord();
  presetChordsContainer.style.display = 'none';
  timeInput.value = '1'; // Set default time value
});
