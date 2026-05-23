const TOTAL_RONDE = 5;
const DURASI_PUTAR = 1000;
const pilihanGame = ["gajah", "orang", "semut"];

function getPilihanComputer() {
  const index = Math.floor(Math.random() * pilihanGame.length);
  return pilihanGame[index];
}

function getHasil(comp, player) {
  if (player === comp) return "SERI!";
  if (player === "gajah") return comp === "orang" ? "MENANG!" : "KALAH!";
  if (player === "orang") return comp === "gajah" ? "KALAH!" : "MENANG!";
  if (player === "semut") return comp === "orang" ? "KALAH!" : "MENANG!";
  return "PILIHAN SALAH!";
}

function getPoin(hasil) {
  if (hasil === "MENANG!") return { player: 3, computer: 0 };
  if (hasil === "SERI!") return { player: 1, computer: 1 };
  return { player: 0, computer: 3 };
}

function putar() {
  let i = 0;
  const waktuMulai = Date.now();

  imgComputer.classList.add("is-spinning");

  const intervalId = setInterval(function () {
    if (Date.now() - waktuMulai > DURASI_PUTAR) {
      clearInterval(intervalId);
      imgComputer.classList.remove("is-spinning");
      return;
    }
    imgComputer.setAttribute("src", "img/" + pilihanGame[i] + ".png");
    i = (i + 1) % pilihanGame.length;
  }, 100);
}

let skorPlayer = 0;
let skorComputer = 0;
let ronde = 1;
let gameSelesai = false;
let sedangMemutar = false;
let gameDimulai = false;
let namaPlayer = "Player";

const areaPlayer = document.querySelector(".area-player");
const info = document.querySelector(".info");
const imgComputer = document.querySelector(".img-komputer");
const scorePlayer = document.querySelector(".score-player");
const scoreComputer = document.querySelector(".score-computer");
const roundNumber = document.querySelector(".round-number");
const namePopup = document.querySelector(".name-popup");
const nameForm = document.querySelector(".name-form");
const nameInput = document.querySelector(".name-input");
const startPopup = document.querySelector(".start-popup");
const popup = document.querySelector(".game-popup");
const popupTitle = popup.querySelector(".popup-title");
const popupMessage = popup.querySelector(".popup-message");
const startGame = document.querySelector(".start-game");
const playAgain = document.querySelector(".play-again");
const tombolPilihan = document.querySelectorAll(".choice-button");
const playerNameLabels = document.querySelectorAll(".player-name");

function formatNamaPlayer(nama) {
  const namaBersih = nama.trim().replace(/\s+/g, " ");
  if (namaBersih === "") return "Player";
  return namaBersih.slice(0, 16);
}

function updateNamaPlayer() {
  playerNameLabels.forEach(function (label) {
    label.textContent = namaPlayer;
  });
}

function updateScoreboard() {
  scorePlayer.textContent = skorPlayer;
  scoreComputer.textContent = skorComputer;

  if (gameSelesai) {
    roundNumber.textContent = "Selesai";
    return;
  }

  roundNumber.textContent = ronde + "/" + TOTAL_RONDE;
}

function cekGameSelesai() {
  return ronde > TOTAL_RONDE;
}

function tampilkanPopup() {
  let pemenang = "😌 Skor Seri!";
  let pesanEmosi = "Tetap sabar, ronde berikutnya bisa dibalas.";

  if (skorPlayer > skorComputer) {
    pemenang = "😄 " + namaPlayer + " Menang!";
    pesanEmosi = "Keren, kamu menang..hehe";
  } else if (skorComputer > skorPlayer) {
    pemenang = "😭 Computer Menang!";
    pesanEmosi = "Sedih boleh, tapi jangan menyerah.";
  }

  popupTitle.textContent = pemenang;
  popupMessage.textContent =
    pesanEmosi + " Skor akhir " + skorPlayer + " - " + skorComputer;
  popup.classList.remove("hidden");
}

function animasiSkor() {
  scorePlayer.classList.remove("score-pop");
  scoreComputer.classList.remove("score-pop");
  void scorePlayer.offsetWidth;
  scorePlayer.classList.add("score-pop");
  scoreComputer.classList.add("score-pop");
}

function setHasilVisual(hasil) {
  info.classList.remove(
    "result-win",
    "result-lose",
    "result-draw",
    "result-pop",
  );
  void info.offsetWidth;

  if (hasil === "MENANG!") info.classList.add("result-win");
  if (hasil === "KALAH!") info.classList.add("result-lose");
  if (hasil === "SERI!") info.classList.add("result-draw");

  info.classList.add("result-pop");
}

function resetGame() {
  skorPlayer = 0;
  skorComputer = 0;
  ronde = 1;
  gameSelesai = false;
  sedangMemutar = false;
  gameDimulai = true;

  info.textContent = "Pilih jagoanmu";
  info.className = "info";
  imgComputer.setAttribute("src", "img/gajah.png");
  imgComputer.classList.remove("is-revealed", "is-spinning");
  tombolPilihan.forEach(function (tombol) {
    tombol.classList.remove("selected");
  });
  areaPlayer.classList.remove("disabled");
  popup.classList.add("hidden");
  updateScoreboard();
}

function mulaiGame() {
  gameDimulai = true;
  startPopup.classList.add("hidden");
  areaPlayer.classList.remove("disabled");
  info.textContent = "Pilih jagoanmu";
}

function simpanNama(event) {
  event.preventDefault();
  namaPlayer = formatNamaPlayer(nameInput.value);
  updateNamaPlayer();
  namePopup.classList.add("hidden");
  startPopup.classList.remove("hidden");
}

function mainkanRonde(tombol) {
  if (!gameDimulai || gameSelesai || sedangMemutar) return;

  sedangMemutar = true;
  areaPlayer.classList.add("disabled");
  tombolPilihan.forEach(function (item) {
    item.classList.remove("selected");
  });
  tombol.classList.add("selected");
  imgComputer.classList.remove("is-revealed");
  info.textContent = "Mengacak...";
  info.className = "info is-loading";

  const pilihanComputer = getPilihanComputer();
  const pilihPlayer = tombol.dataset.choice;
  const hasil = getHasil(pilihanComputer, pilihPlayer);
  const poin = getPoin(hasil);

  putar();
  setTimeout(function () {
    imgComputer.setAttribute("src", "img/" + pilihanComputer + ".png");
    imgComputer.classList.add("is-revealed");

    info.textContent = hasil;
    setHasilVisual(hasil);

    skorPlayer += poin.player;
    skorComputer += poin.computer;
    ronde++;
    animasiSkor();
    updateScoreboard();

    if (cekGameSelesai()) {
      gameSelesai = true;
      updateScoreboard();
      tampilkanPopup();
      return;
    }

    sedangMemutar = false;
    areaPlayer.classList.remove("disabled");
  }, DURASI_PUTAR);
}

tombolPilihan.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    mainkanRonde(tombol);
  });
});

areaPlayer.classList.add("disabled");
nameInput.focus();
updateNamaPlayer();
nameForm.addEventListener("submit", simpanNama);
startGame.addEventListener("click", mulaiGame);
playAgain.addEventListener("click", resetGame);
