let intervalId = null;
let entries = [];
let currentInterval = 1000;
let running = false;
let lastChord = null;
let nextChord = null;

document.addEventListener('DOMContentLoaded', () => {
  const intervalInput = document.getElementById('interval');
  const entriesInput = document.getElementById('entries');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const clearTimeBtn = document.getElementById('clearTimeBtn');
  const clearChordsBtn = document.getElementById('clearChordsBtn');
  const display = document.getElementById('display');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const progressContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const preview = document.getElementById('nextChordPreview');
  const chordText = document.getElementById('chordText');
  const nextChordText = document.getElementById('nextChordText');

  const toggleChordsBtn = document.getElementById('toggleChordsBtn');
  const chordsContainer = document.getElementById('presetChordsContainer');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    document.getElementById('fullscreenBtn').style.display = 'none';
  }
  // 🔹 Hide chords by default
  if (chordsContainer) chordsContainer.style.display = 'none';

  // 🔹 Toggle chord button visibility
  if (toggleChordsBtn && chordsContainer) {
    toggleChordsBtn.addEventListener('click', () => {
      const isHidden = chordsContainer.style.display === 'none';
      chordsContainer.style.display = isHidden ? 'flex' : 'none';
      toggleChordsBtn.textContent = isHidden ? 'Hide Chord Buttons' : 'Show Chord Buttons';
    });
  }

  function displayRandomEntry() {
    if (entries.length === 0) return;

    let currentChord = nextChord;
    let newIndex;

    do {
      newIndex = Math.floor(Math.random() * entries.length);
    } while (entries[newIndex] === currentChord && entries.length > 1);

    nextChord = entries[newIndex];

    if (currentChord == null) {
      currentChord = entries[Math.floor(Math.random() * entries.length)];
    }

    lastChord = currentChord;
    chordText.textContent = currentChord;
    nextChordText.textContent = nextChord;

    display.classList.remove('fade-in');
    setTimeout(() => {
      display.classList.add('fade-in');
      animateProgressBar();
    }, 200);
  }

  function animateProgressBar() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.transition = `width ${currentInterval}ms linear`;
      progressBar.style.width = '100%';
    }, 50);
  }

  function startCycle() {
    const rejected = [];

    entries = entriesInput.value
      .split(',')
      .map(e => e.trim())
      .filter(e => {
        if (!e) return false;
        const hasBadChars = /[<>{}[\];'"`\\]/.test(e);
        if (hasBadChars) {
          rejected.push(e);
          return false;
        }
        return true;
      });

    if (rejected.length > 0) {
      alert(`The following entries were rejected for being suspicious:\n\n${rejected.join(", ")}`);
      return;
    }

    const seconds = parseFloat(intervalInput.value);
    if (isNaN(seconds) || seconds <= 0) {
      alert("Please enter a valid time interval.");
      return;
    }

    currentInterval = seconds * 1000;

    if (!running) {
      displayRandomEntry();
      intervalId = setInterval(displayRandomEntry, currentInterval);
      running = true;
      startPauseBtn.textContent = "Pause";
    } else {
      clearInterval(intervalId);
      running = false;
      startPauseBtn.textContent = "Start";
    }
  }

  function resetCycle() {
    clearInterval(intervalId);
    running = false;
    startPauseBtn.textContent = "Start";

    intervalInput.value = "1";
    entriesInput.value = "";
    display.classList.remove('fade-in');
    chordText.textContent = "♪";
    nextChordText.textContent = "";
    animateProgressBar(true);

    entries = [];
    nextChord = null;
  }

  // Button Listeners
  clearTimeBtn.addEventListener('click', () => intervalInput.value = "");
  clearChordsBtn.addEventListener('click', () => entriesInput.value = "");
  startPauseBtn.addEventListener('click', startCycle);
  resetBtn.addEventListener('click', resetCycle);

  document.querySelectorAll('.presetChord').forEach(button => {
    button.addEventListener('click', () => {
      const chord = button.getAttribute('data-chord');
      let current = entriesInput.value.trim();
      entriesInput.value = current ? `${current}, ${chord}` : chord;
    });
  });

  // Fullscreen handling
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      display.requestFullscreen().then(() => {
        display.classList.remove('normal-mode');
        progressContainer.classList.remove('normal-mode');
        display.classList.add('fullscreen-mode');
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement != null;

    if (isFullscreen) {
      display.classList.remove('normal-mode');
      display.classList.add('fullscreen-mode');
      progressContainer.classList.remove('normal-mode');
      progressContainer.classList.add('fullscreen-mode');
      progressBar.classList.add('fullscreen-mode');
      preview.classList.add('fullscreen-mode');
    } else {
      display.classList.remove('fullscreen-mode');
      display.classList.add('normal-mode');
      progressContainer.classList.remove('fullscreen-mode');
      progressContainer.classList.add('normal-mode');
      progressBar.classList.remove('fullscreen-mode');
      preview.classList.remove('fullscreen-mode');

      display.removeAttribute('style');
      progressContainer.removeAttribute('style');
    }
  });
});
