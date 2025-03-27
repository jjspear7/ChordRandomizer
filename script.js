document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display-section');
  const current = document.getElementById('current-chord');
  const next = document.getElementById('next-chord');
  const fill = document.getElementById('progress-fill');
  const intervalInput = document.getElementById('interval');

  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const clearChordsBtn = document.getElementById('clearChordsBtn');
  const clearTimeBtn = document.getElementById('clearTimeBtn');
  const chordInput = document.getElementById('chords');
  const toggleChordListBtn = document.getElementById('toggleChordListBtn');
  const presetChordsContainer = document.getElementById('presetChordsContainer');

  let chords = [];
  let index = 0;
  let loop = null;

  function updateChordList() {
    chords = chordInput.value.split(',').map(c => c.trim()).filter(c => c);
    index = 0;
    displayChord();
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
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth;
    fill.style.transition = `width ${duration}ms linear`;
    fill.style.width = '100%';
  }

  function startChordLoop() {
    updateChordList();
    const interval = parseFloat(intervalInput.value) * 1000;
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
      display.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  clearChordsBtn.addEventListener('click', () => {
    chordInput.value = '';
    updateChordList();
  });

  clearTimeBtn.addEventListener('click', () => {
    intervalInput.value = '';
  });

  toggleChordListBtn.addEventListener('click', () => {
    const isHidden = presetChordsContainer.style.display === 'none';
    presetChordsContainer.style.display = isHidden ? 'flex' : 'none';
  });

  presetChordsContainer.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const chord = button.textContent;
      const currentValue = chordInput.value;
      chordInput.value = currentValue ? `${currentValue}, ${chord}` : chord;
      updateChordList();
    });
  });

  updateChordList();
});
