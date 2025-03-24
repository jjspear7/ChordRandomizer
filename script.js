let intervalId = null;
let entries = [];
let currentInterval = 1000;
let running = false;
let lastChord = null;

const intervalInput = document.getElementById('interval');
const entriesInput = document.getElementById('entries');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const clearTimeBtn = document.getElementById('clearTimeBtn');
const clearChordsBtn = document.getElementById('clearChordsBtn');
const display = document.getElementById('display');

function displayRandomEntry() {
  if (entries.length === 0) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * entries.length);
  } while (entries[newIndex] === lastChord && entries.length > 1);

  lastChord = entries[newIndex];
  display.classList.remove('fade-in');
  setTimeout(() => {
    display.innerHTML = `<span style="color:white;">${lastChord}</span>`;
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

function startCycle() {
  entries = entriesInput.value.split(',').map(e => e.trim()).filter(e => e);
  if (entries.length === 0) {
    alert("Please enter at least one chord.");
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
  intervalInput.value = "";
  entriesInput.value = "";
  display.textContent = "♪";
  display.classList.remove('fade-in');
  entries = [];
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
      display.classList.add('fullscreen-mode');
    });
  } else {
    document.exitFullscreen().then(() => {
      display.classList.remove('fullscreen-mode');
      display.classList.add('normal-mode');
    });
  }
});
