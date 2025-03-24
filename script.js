let intervalId = null;
let entries = [];
let currentInterval = 1000;
let running = false;
let lastChord = null;
let nextChord = null;

const intervalInput = document.getElementById('interval');
const entriesInput = document.getElementById('entries');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const clearTimeBtn = document.getElementById('clearTimeBtn');
const clearChordsBtn = document.getElementById('clearChordsBtn');
const display = document.getElementById('display');

function displayRandomEntry() {
  if (entries.length === 0) return;

  let currentChord = nextChord;
  let newIndex;

  // Pick the *next* chord now
  do {
    newIndex = Math.floor(Math.random() * entries.length);
  } while (entries[newIndex] === currentChord && entries.length > 1);

  nextChord = entries[newIndex];

  if (currentChord == null) {
    // First call, show placeholder
    currentChord = entries[Math.floor(Math.random() * entries.length)];
  }

  lastChord = currentChord;
  document.getElementById('chordText').textContent = currentChord;
  document.getElementById('nextChordText').textContent = nextChord;

  display.classList.remove('fade-in');
  setTimeout(() => {
    display.classList.add('fade-in');
    animateProgressBar();
  }, 200);
}


function animateProgressBar() {
  const bar = document.getElementById('progressBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = `width ${currentInterval}ms linear`;
    bar.style.width = '100%';
  }, 50);
}

let rejected = [];

entries = entriesInput.value
  .split(',')
  .map(e => e.trim())
 .filter(e => {
  if (!e) return false;

  const hasBadChars = /[<>{}[\];'"`\\]/.test(e);
  if (hasBadChars) {
    rejected.push(e);
    return false;  // ❗ Don't include this entry
  }

  return true; // ✅ Include this entry
});

if (rejected.length > 0) {
  alert(`The following entries were rejected for being suspicious:\n\n${rejected.join(", ")}`);
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

  intervalInput.value = "1"; // 🟢 Set default back
  entriesInput.value = "";
  display.classList.remove('fade-in');
  document.getElementById('chordText').textContent = "♪";
  document.getElementById('nextChordText').textContent = "";
  animateProgressBar(true); // Reset bar

  entries = [];
  nextChord = null;
}

clearTimeBtn.addEventListener('click', () => intervalInput.value = "");
clearChordsBtn.addEventListener('click', () => entriesInput.value = "");

startPauseBtn.addEventListener('click', startCycle);
resetBtn.addEventListener('click', resetCycle);

document.querySelectorAll('.presetChord').forEach(button => {
  button.addEventListener('click', () => {
    const chord = button.getAttribute('data-chord');
    let current = entriesInput.value.trim();
    entriesInput.value = current ? current + ", " + chord : chord;
  });
});
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    display.requestFullscreen().then(() => {
      display.classList.remove('normal-mode');
      document.getElementById('progressBarContainer').classList.remove('normal-mode');
      display.classList.add('fullscreen-mode');
    });
  } else {
    document.exitFullscreen(); // No need for then() now
  }
});
 document.addEventListener('fullscreenchange', () => {
  const isFullscreen = document.fullscreenElement != null;
  const progressContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const preview = document.getElementById('nextChordPreview');

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

    // Clean up
    display.removeAttribute('style');
    progressContainer.removeAttribute('style');
  }
});

