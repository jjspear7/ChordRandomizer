body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #1e1f20;
  color: white;
  text-align: center;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: auto;
}

.input-group {
  margin: 10px 0;
}

input[type="text"],
input[type="number"] {
  padding: 8px;
  width: 300px;
  max-width: 90%;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
}

button {
  margin: 5px;
  padding: 8px 16px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #444;
  color: white;
}

button:hover {
  background-color: #666;
}

.button-row {
  margin-top: 10px;
}

#display {
  margin: 20px auto 10px;
  padding: 20px;
  border: 2px solid #444;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#chordText {
  font-size: 3em;
  font-weight: bold;
}

#nextChordText {
  font-size: 1.8em;
  color: #a3a3a3;
  margin-top: 0.5em;
}

#progressBarContainer {
  margin: 15px auto;
  width: 70%;
}

#progressBar {
  width: 100%;
  height: 10px;
  background-color: #1e1f20;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid white;
}

#progressBar::before {
  content: '';
  display: block;
  height: 100%;
  width: 0;
  background-color: white;
  border-radius: 10px;
  transition: width 0.1s linear;
}

.fullscreen-mode #display {
  height: 50vh;
}

.fullscreen-mode #chordText {
  font-size: 5em;
}

.fullscreen-mode #nextChordText {
  font-size: 2.5em;
}

.fullscreen-mode #progressBarContainer {
  margin-top: 30px;
}
