let intervalId;
let currentChordIndex = 0;

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const chordText = document.getElementById("chordText");
const nextChordText = document.getElementById("nextChordText");
const progressBar = document.getElementById("progressBar");

function getChordList() {
  const input = document.getElementById("chordsInput").value;
  return input.split(",").map((chord) => chord.trim()).filter((c) => c);
}

function startDisplay() {
  const interval = parseFloat(document.getElementById("intervalInput").value);
  const chords = getChordList();

  if (!interval || chords.length < 1) return;

  clearInterval(intervalId);
  updateChord(chords);

  let startTime = Date.now();
  intervalId = setInterval(() => {
    updateChord(chords);
    startTime = Date.now();
  }, interval * 1000);

  requestAnimationFrame(function animateProgress() {
    if (!intervalId) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / interval, 1);
    progressBar.style.setProperty("--progress", progress);
    progressBar.style.setProperty("width", `${progress * 100}%`);
    requestAnimationFrame(animateProgress);
  });
}

function updateChord(chords) {
  chordText.textContent = chords[currentChordIndex];
  nextChordText.textContent =
    chords[(currentChordIndex + 1) % chords.length] || "";

  currentChordIndex = (currentChordIndex + 1) % chords.length;
  progressBar.style.setProperty("width", "0%");
}

function resetDisplay() {
  clearInterval(intervalId);
  intervalId = null;
  currentChordIndex = 0;
  chordText.textContent = "🎵";
  nextChordText.textContent = "";
  progressBar.style.setProperty("width", "0%");
}

function clearIntervalInput() {
  document.getElementById("intervalInput").value = "";
}

function clearChordsInput() {
  document.getElementById("chordsInput").value = "";
}

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  const display = document.getElementById("display");
  if (!document.fullscreenElement) {
    display.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
  const display = document.getElementById("display");
  const progressContainer = document.getElementById("progressBarContainer");

  if (document.fullscreenElement) {
    display.classList.add("fullscreen-mode");
    progressContainer.classList.add("fullscreen-mode");
  } else {
    display.classList.remove("fullscreen-mode");
    progressContainer.classList.remove("fullscreen-mode");
  }
});

document
  .getElementById("startBtn")
  .addEventListener("click", startDisplay);
document
  .getElementById("resetBtn")
  .addEventListener("click", resetDisplay);

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleChordListBtn");
  const container = document.getElementById("presetChordsContainer");

  toggleBtn.addEventListener("click", () => {
    const isHidden = container.style.display === "none";
    container.style.display = isHidden ? "block" : "none";
  });

  container.style.display = "none";
});
