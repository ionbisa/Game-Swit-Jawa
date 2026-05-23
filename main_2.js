// menangkap pilihan computer
// membangkitkan bilangan random
function getPilihanComputer() {
  const comp = Math.random();
  if (comp < 0.34) return "gajah";
  if (comp >= 0.34 && comp < 0.67) return "orang";
  return "semut";
}

// menentukan rules
function getHasil(comp, player) {
  if (player == comp) return "SERI!";
  if (player == "gajah") return comp == "orang" ? "MENANG!" : "KALAH!";
  if (player == "orang") return comp == "gajah" ? "KALAH!" : "MENANG!";
  if (player == "semut") return comp == "orang" ? "KALAH!" : "MENANG!";
}

function getPoin(hasil) {
  if (hasil == "MENANG!") return { player: 3, computer: 0 };
  if (hasil == "SERI!") return { player: 1, computer: 1 };
  return { player: 0, computer: 3 };
}

// menentukan pilihan Computer dengan memutar image
function putar() {
  const imgComputer = document.querySelector(".img-komputer");
  const gambar = ["gajah", "semut", "orang"];
  let i = 0;
  const waktuMulai = new Date().getTime();
  const intervalId = setInterval(function () {
    if (new Date().getTime() - waktuMulai > 1000) {
      clearInterval(intervalId);
      return;
    }
    imgComputer.setAttribute("src", "img/" + gambar[i++] + ".png");
    if (i == gambar.length) i = 0;
  }, 100);
}

let skorPlayer = 0;
let skorComputer = 0;
let ronde = 1;
let gameSelesai = false;
let sedangMemutar = false;
let gameDimulai = false;

const areaPlayer = document.querySelector(".area-player");
const scorePlayer = document.querySelector(".score-player");
const scoreComputer = document.querySelector(".score-computer");
const roundNumber = document.querySelector(".round-number");
const startPopup = document.querySelector(".start-popup");
const popup = document.querySelector(".game-popup");
const popupTitle = popup.querySelector(".popup-title");
const popupMessage = popup.querySelector(".popup-message");
const startGame = document.querySelector(".start-game");
const playAgain = document.querySelector(".play-again");

function updateScoreboard() {
  scorePlayer.innerHTML = skorPlayer;
  scoreComputer.innerHTML = skorComputer;

  if (gameSelesai) {
    roundNumber.innerHTML = "Selesai";
    return;
  }

  if (ronde <= 5) {
    roundNumber.innerHTML = ronde + "/5";
    return;
  }

  roundNumber.innerHTML = ronde;
}

function cekGameSelesai() {
  return ronde > 5 && skorPlayer != skorComputer;
}

function tampilkanPopup() {
  const pemenang = skorPlayer > skorComputer ? "Player Menang!" : "Computer Menang!";
  popupTitle.innerHTML = pemenang;
  popupMessage.innerHTML = "Skor akhir " + skorPlayer + " - " + skorComputer;
  popup.classList.remove("hidden");
}

function resetGame() {
  skorPlayer = 0;
  skorComputer = 0;
  ronde = 1;
  gameSelesai = false;
  sedangMemutar = false;
  gameDimulai = true;

  document.querySelector(".info").innerHTML = "";
  document.querySelector(".img-komputer").setAttribute("src", "img/gajah.png");
  areaPlayer.classList.remove("disabled");
  popup.classList.add("hidden");
  updateScoreboard();
}

function mulaiGame() {
  gameDimulai = true;
  startPopup.classList.add("hidden");
  areaPlayer.classList.remove("disabled");
}

//menentukan hasil
const pilihan = document.querySelectorAll("li img");
pilihan.forEach(function (pil) {
  pil.addEventListener("click", function () {
    if (!gameDimulai || gameSelesai || sedangMemutar) return;

    sedangMemutar = true;
    areaPlayer.classList.add("disabled");

    const pilihanComputer = getPilihanComputer();
    const pilihPlayer = pil.className;
    const hasil = getHasil(pilihanComputer, pilihPlayer);
    const poin = getPoin(hasil);

    putar();
    setTimeout(function () {
      const imgComputer = document.querySelector(".img-komputer");
      imgComputer.setAttribute("src", "img/" + pilihanComputer + ".png");

      const info = document.querySelector(".info");
      info.innerHTML = hasil;

      skorPlayer += poin.player;
      skorComputer += poin.computer;
      ronde++;

      if (cekGameSelesai()) {
        gameSelesai = true;
        updateScoreboard();
        tampilkanPopup();
        return;
      }

      sedangMemutar = false;
      areaPlayer.classList.remove("disabled");
      updateScoreboard();
    }, 1000);
  });
});

areaPlayer.classList.add("disabled");
startGame.addEventListener("click", mulaiGame);
playAgain.addEventListener("click", resetGame);
