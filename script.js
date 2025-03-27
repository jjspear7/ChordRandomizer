let chords = [];
let currentIndex = 0;
let interval = null;
let intervalTime = 1000;
let progressAnimation = null;

const intervalInput = document.getElementById("intervalInput");
const chordsInput = document.getElementById("chordsInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const clearTimeBtn = document.getElementById("clearTimeBtn");
const clearChordsBtn = document.getElementById("clearChordsBtn");
const chordText = document.getElementById("chordText");
const nextChordText = document.getElementById("nextChordText");
const progressBar = document.getElementById("progressBar");
const toggleChordListBtn = document.getElementById("toggleChordListBtn");
const presetChordsContainer = document.getElementById("presetChordsContainer");

function updateProgressBar(duration) {
  progressBar.querySelector("::before");
  progressBar.style.setProperty("--bar-duration", `${duration}ms`);
  const bar = progressBar.querySelector("::before");
  if (bar) bar.style.width = "0%";
  progressBar.querySelector("::before").style.width = "100%";
}

function animateProgressBar(duration) {
  const fill = progressBar.querySelector("::before");
  fill.style.transition = "none";
  fill.style.width = "0%";
  requestAnimationFrame(() => {
    fill.style.transition = `width ${duration}ms linear`;
    fill.style.width = "100%";
  });
}

function displayNextChord() {
  if (chords.length === 0) return;

  const currentChord = chords[currentIndex];
  const nextChord = chords[(currentIndex + 1) % chords.length];

  chordText.textContent = currentChord;
  nextChordText.textContent = nextChord;

  animateProgressBar(intervalTime);
  currentIndex = (currentIndex + 1) % chords.length;
}

function startChordLoop() {
  if (interval) clearInterval(interval);
  displayNextChord();
  interval = setInterval(displayNextChord, intervalTime);
}

function resetChordLoop() {
  clearInterval(interval);
  interval = null;
  currentIndex = 0;
  chordText.textContent = "🎵";
  nextChordText.textContent = "";
  const fill = progressBar.querySelector("::before");
  if (fill) fill.style.width = "0%";
}

function updateChordList() {
  chords = chordsInput.value
    .split(",")
    .map(c => c.trim())
    .filter(c => c.length > 0);
}

startBtn.addEventListener("click", () => {
  updateChordList();
  const seconds = parseFloat(intervalInput.value);
  if (isNaN(seconds) || seconds <= 0) return;
  intervalTime = seconds * 1000;
  startChordLoop();
});

resetBtn.addEventListener("click", resetChordLoop);
clearTimeBtn.addEventListener("click", () => (intervalInput.value = ""));
clearChordsBtn.addEventListener("click", () => (chordsInput.value = ""));

fullscreenBtn.addEventListener("click", () => {
  const app = document.documentElement;
  if (!document.fullscreenElement) {
    app.requestFullscreen();
    document.body.classList.add("fullscreen-mode");
  } else {
    document.exitFullscreen();
    document.body.classList.remove("fullscreen-mode");
  }
});

toggleChordListBtn.addEventListener("click", () => {
  if (presetChordsContainer.style.display === "none") {
    presetChordsContainer.style.display = "block";
  } else {
    presetChordsContainer.style.display = "none";
  }
});

document.querySelectorAll(".presetChord").forEach(btn =>
  btn.addEventListener("click", () => {
    const chord = btn.dataset.chord;
    chordsInput.value += chordsInput.value ? `, ${chord}` : chord;
  })
);

presetChordsContainer.style.display = "none";
