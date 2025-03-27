
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
const progressBar = document.getElementById('progressBar');

function animateProgressBar(duration) {
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';

  setTimeout(() => {
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = '100%';
  }, 50);
}

function displayRandomEntry() {
  if (entries.length === 0) return;

  const currentChord = nextChord ?? entries[Math.floor(Math.random() * entries.length)];

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * entries.length);
  } while (entries[newIndex] === currentChord && entries.length > 1);

  nextChord = entries[newIndex];
  lastChord = currentChord;

  document.getElementById('chordText').textContent = currentChord;
  document.getElementById('nextChordText').textContent = nextChord;

  display.classList.remove('fade-in');
  setTimeout(() => display.classList.add('fade-in'), 100);

  animateProgressBar(currentInterval);
}

function startCycle() {
  const rawEntries = entriesInput.value
    .split(',')
    .map(e => e.trim())
    .filter(e => e && !/[<>{}[\];'"`\\]/.test(e));

  if (rawEntries.length === 0) {
    alert("Please enter valid chords.");
    return;
  }

  entries = rawEntries;

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
  entries = [];
  nextChord = null;
  intervalInput.value = "1";
  entriesInput.value = "";
  document.getElementById('chordText').textContent = "♪";
  document.getElementById('nextChordText').textContent = "";
  progressBar.style.width = '0%';
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

document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    display.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

document.getElementById('toggleChordListBtn').addEventListener('click', () => {
  const chordContainer = document.getElementById('presetChordsContainer');
  const btn = document.getElementById('toggleChordListBtn');
  const isHidden = chordContainer.style.display === 'none';
  chordContainer.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? 'Hide Chord Buttons' : 'Show Chord Buttons';
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('presetChordsContainer').style.display = 'none';
});
