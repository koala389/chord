const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const flatToSharp = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
const sharpToFlat = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };

let targetKey = baseKey;
let currentShift = 0;
let useFlats = false;

function getSemitoneShift(fromKey, toKey) {
  const fromIndex = chords.indexOf(flatToSharp[fromKey] || fromKey);
  const toIndex = chords.indexOf(flatToSharp[toKey] || toKey);
  return (toIndex - fromIndex + 12) % 12;
}

function renderKeyButtons() {
  const container = document.getElementById("key-buttons");
  container.innerHTML = '';
  chords.forEach(key => {
    const btn = document.createElement("button");
    const display = useFlats && sharpToFlat[key] ? sharpToFlat[key] : key;
    btn.textContent = key === baseKey ? `${display} (original)` : display;
    btn.onclick = () => {
      targetKey = key;
      currentShift = 0;
      renderKeyButtons();
      renderShiftButtons();
      transposeAndDisplay(0);
    };
    if (key === targetKey) btn.classList.add("selected");
    container.appendChild(btn);
  });
}

function renderShiftButtons() {
  const container = document.getElementById("shift-buttons");
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const btn = document.createElement("button");
    const key = chords[(chords.indexOf(targetKey) + i) % 12];
    const display = useFlats && sharpToFlat[key] ? sharpToFlat[key] : key;
    btn.textContent = `${i} (${display})`;
    btn.onclick = () => {
      currentShift = i;
      transposeAndDisplay(i);
    };
    if (i === currentShift) btn.classList.add("selected");
    container.appendChild(btn);
  }
}

function transposeChordLine(line, amount) {
  return line.replace(/([A-G](?:#|b)?)([a-z0-9()\/#\+\-]*)/g, (match, root, suffix) => {
    const normalized = flatToSharp[root] || root;
    const index = chords.indexOf(normalized);
    if (index === -1) return match;
    let newRoot = chords[(index + amount) % 12];
    if (useFlats && sharpToFlat[newRoot]) newRoot = sharpToFlat[newRoot];
    return '<span class="chord">' + newRoot + suffix + '</span>';
  });
}

function transposeAndDisplay(shift) {
  const lines = originalSong.trim().split('\n');
  const transposed = lines.map((line, i) => (i % 2 === 1 ? transposeChordLine(line, shift) : line));
  document.getElementById("song").innerHTML = transposed.join('\n');
}
