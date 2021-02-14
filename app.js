const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const timerUI = document.querySelector(".timer span:last-child");
const scoreUI = document.querySelector(".score span:last-child");
const container = document.querySelector(".container");
const header = document.querySelector(".game-header");
const startText = document.querySelector(".start-text");
const endgame = document.querySelector(".endgame");
const finalScore = document.querySelector(".final-score");
let letters;

let gameIsOn = false;
let score = 0;
let comboCount = 0;

document.addEventListener("keyup", (e) => {
  const pressedKey = e.key.toUpperCase();
  if (pressedKey === "ENTER" && !gameIsOn) {
    startText.classList.add("fade-out");
    fillAlphabet();
    gameIsOn = true;
    timer(1);
    updateUI(document.querySelector(".bad"));
  } else if (alphabet.includes(pressedKey) && gameIsOn) {
    checkKeyNature(pressedKey);
  }
});

const fillAlphabet = () => {
  alphabet.forEach((letter) => {
    const li = document.createElement("LI");
    li.innerText = letter;
    container.append(li);
  });
  letters = Array.from(document.querySelectorAll(".container li"));
  letters[random(26)].classList.add("bad");
  const aim = document.querySelector(".bad");
};

const checkKeyNature = (key) => {
  const aim = document.querySelector(".bad");
  if (key === aim.innerText.toUpperCase()) {
    combo();
    aim.classList.add("anim-right-key");
  } else if (score > 0) {
    scoreUI.parentElement.classList.add("anim-wrong-key");
    comboCount = 0;
    scoreUI.parentElement.classList.remove("combo-x2", "combo-x4");
    score = score - 1;
    setTimeout(() => {
      scoreUI.parentElement.classList.remove("anim-wrong-key");
    }, 200);
  }
  scoreUI.innerText = score;
  setTimeout(() => {
    aim.classList.remove("anim-right-key");
    updateUI(aim);
  }, 100);
};

const updateUI = (aim) => {
  Array.from(document.querySelectorAll(".bad")).forEach((bad) => {
    bad.classList.remove("bad");
  });
  letters[random(26)].classList.add("bad");
  letters.forEach((letter) => {
    letter.style.order = random(26);
  });
};

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function timer(max) {
  const inter = setInterval(countdown, 1000);
  let time = max;
  timerUI.innerText = time;
  function countdown() {
    if (time === 1) {
      clearInterval(inter);
      gameIsOn = false;
      container.classList.add("fade-out");
      header.classList.add("fade-out");
      container.style.display = "none";
      header.style.display = "none";
      endgame.style.display = "flex";
      finalScore.innerText = score;
    } else {
      time--;
      timerUI.innerText = time;
    }
  }
}

const combo = () => {
  comboCount++;
  if (comboCount > 10 && comboCount <= 20) {
    score += 2;
    scoreUI.parentElement.classList.add("combo-x2");
  } else if (comboCount > 20) {
    score += 4;
    scoreUI.parentElement.classList.remove("combo-x2");
    scoreUI.parentElement.classList.add("combo-x4");
  } else {
    score++;
  }
};
