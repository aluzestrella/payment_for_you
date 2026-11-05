// GANTI PIN dengan tanggal kalian dalam format DDMMYYYY.
const CORRECT_PIN = "16082026"; // contoh: "23082024"

const pages = [...document.querySelectorAll(".page")];
const pinForm = document.getElementById("pin-form");
const pinInput = document.getElementById("pin");
const pinError = document.getElementById("pin-error");
const music = document.getElementById("bg-music");
const progress = document.getElementById("progress-bar");
let currentPage = 1;
let musicStarted = false;
let photos = [];

function showPage(number) {
  pages.forEach((page, index) => page.classList.toggle("active", index === number - 1));
  currentPage = number;
  progress.style.width = `${number * 20}%`;
  window.scrollTo({top: 0, behavior: "smooth"});
  if (number >= 2) startMusic();
}

function startMusic() {
  if (musicStarted) return;
  music.volume = 0.38;
  const attempt = music.play();
  if (attempt && typeof attempt.then === "function") {
    attempt.then(() => { musicStarted = true; })
      .catch(() => { /* Browser may require another tap before audio playback. */ });
  } else musicStarted = true;
}

document.addEventListener("click", () => {
  if (currentPage >= 2 && !musicStarted) startMusic();
});

pinForm.addEventListener("submit", event => {
  event.preventDefault();
  const value = pinInput.value.trim();
  if (!/^\d{8}$/.test(value)) {
    pinError.textContent = "PIN harus terdiri dari 8 angka (DDMMYYYY).";
    return;
  }
  if (CORRECT_PIN === "DDMMYYYY") {
    pinError.textContent = "Atur PIN kalian terlebih dahulu di file script.js.";
    return;
  }
  if (value === CORRECT_PIN) {
    pinError.textContent = "";
    showPage(2);
  } else {
    pinError.textContent = "Hmm… sepertinya tanggalnya belum tepat. Coba lagi, ya.";
    pinInput.select();
  }
});

document.querySelectorAll("[data-next]").forEach(button =>
  button.addEventListener("click", () => showPage(Number(button.dataset.next)))
);
document.getElementById("replay").addEventListener("click", () => showPage(1));

// Galeri: simpan foto sebagai photo-01.jpg sampai photo-50.jpg di assets/photos/.
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const photoCount = document.getElementById("photo-count");
let activePhoto = 0;
const photoCaptions = [
  'A little moment I wish I could live in again.',
  'Some memories feel like home.',
  'My favourite view is a moment with you.',
  'An ordinary day, made special by us.',
  'If time could pause, I might choose this moment.',
  'A small memory with a very big place in my heart.',
  'Proof that happiness can be this simple.',
  'I hope we get a thousand more days like this.',
  'Somewhere between laughter and forever.',
  'This one still makes me smile.',
  'A beautiful day, made better by your presence.',
  'Keeping this moment close, always.',
  'One frame, countless feelings.',
  'Even the little things become precious with you.',
  'A memory wrapped in warmth.',
  'Here is to the moments we never planned.',
  'One of those days I wish lasted longer.',
  'Thank you for being part of this memory.',
  'The world felt a little softer that day.',
  'A snapshot of my favourite kind of happiness.',
  'More than a photo, this is a feeling.',
  'I would gladly revisit this day.',
  'A little chapter in our story.',
  'May we never run out of moments to remember.',
  'Some smiles stay with me long after the day ends.',
  'This memory has its own little sparkle.',
  'Just us, making another lovely memory.',
  'A moment I hope you remember fondly, too.',
  'Every picture holds a story only we know.',
  'One more reason to be grateful for you.',
  'The kind of day that deserves a little frame.',
  'Small seconds, beautiful memories.',
  'I wish I could bottle up this feeling.',
  'Another page in our little story.',
  'Some moments say more than words ever could.',
  'Glad I got to share this one with you.',
  'A soft reminder of a day well spent.',
  'May there always be more moments like this.',
  'Your smile makes this memory even brighter.',
  'An ordinary moment with an extraordinary person.',
  'I hope this memory warms your heart.',
  'A little joy, saved here forever.',
  'One day, one photo, a thousand feelings.',
  'Thank you for all the moments, big and small.',
  'This is one of the memories I treasure.',
  'Time moves on, but this moment stays with me.',
  "Here's to all the beautiful days still ahead.",
  "Wherever life takes us, I'll keep this close.",
  'One more memory under the same moon.',
  'And this is just one little piece of us.'
];

function captionFor(index) {
  return photoCaptions[(index - 1) % photoCaptions.length];
}
function openPhoto(index) {
  const src = `assets/photos/photo-${String(index).padStart(2, "0")}.jpeg`;
  activePhoto = index;
  lightboxImage.src = src;
  lightboxCaption.textContent = captionFor(index);
  photoCount.textContent = `${String(index).padStart(2, "0")} / 40`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closePhoto() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
}
function movePhoto(direction) {
  let candidate = activePhoto + direction;
  const seek = () => {
    if (candidate < 1 || candidate > 40) return;
    const probe = new Image();
    probe.onload = () => openPhoto(candidate);
    probe.onerror = () => { candidate += direction; seek(); };
    probe.src = `assets/photos/photo-${String(candidate).padStart(2, "0")}.jpeg`;
  };
  seek();
}
for (let i = 1; i <= 40; i++) {
  const src = `assets/photos/photo-${String(i).padStart(2, "0")}.jpeg`;
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "photo";
  tile.setAttribute("aria-label", `Open memory ${i}`);
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Our memory ${i}`;
  img.loading = "lazy";
  img.onerror = () => {
    img.remove();
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder";
    placeholder.textContent = "☾";
    tile.appendChild(placeholder);
  };
  tile.appendChild(img);
  tile.addEventListener("click", () => {
    if (img.complete && img.naturalWidth > 0) openPhoto(i);
  });
  gallery.appendChild(tile);
}
document.getElementById("lightbox-close").addEventListener("click", closePhoto);
document.getElementById("photo-prev").addEventListener("click", () => movePhoto(-1));
document.getElementById("photo-next").addEventListener("click", () => movePhoto(1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closePhoto(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closePhoto();
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});

// Typewriter: teks halaman 5 diketik bertahap setiap kali halaman 5 dibuka.
let typingRun = 0;
function typeFinalMessage() {
  const run = ++typingRun;
  const lines = [...document.querySelectorAll("#typed-message .type-line")];
  lines.forEach(line => { line.textContent = ""; line.classList.remove("typing"); });
  let lineIndex = 0;
  function typeNextLine() {
    if (run !== typingRun || lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    const fullText = line.dataset.text || "";
    let charIndex = 0;
    line.classList.add("typing");
    function typeCharacter() {
      if (run !== typingRun) return;
      line.textContent = fullText.slice(0, charIndex);
      if (charIndex < fullText.length) {
        charIndex++;
        setTimeout(typeCharacter, 32);
      } else {
        line.classList.remove("typing");
        lineIndex++;
        setTimeout(typeNextLine, 420);
      }
    }
    typeCharacter();
  }
  typeNextLine();
}
const originalShowPage = showPage;
showPage = function(number) {
  originalShowPage(number);
  if (number === 5) typeFinalMessage();
  else typingRun++;
};
