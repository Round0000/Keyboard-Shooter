const scores = db.collection("keyboard-shooter");

function callLeaderboard() {
  scores
    .orderBy("score", "desc")
    .limit(20)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((score) => {
        const html = `
    <li>
      <span class="leaderboard-score">${score.data().score}</span>
      <span class="leaderboard-name">${score.data().name}</span>
    </li>
    `;
        leaderboard.innerHTML += html;
      });
    });
  leaderboard.parentElement.style.display = "initial";
  nameSubmit.style.display = "none";
}

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
const leaderboard = document.querySelector(".leaderboard");
const nameSubmit = document.querySelector(".endgame form");
const restart = document.querySelector("#restart");
let letters;

let gameIsOn = false;
let readyToStart = true;
let score = 0;
let comboCount = 0;

document.addEventListener("keyup", (e) => {
  const pressedKey = e.key.toUpperCase();
  if (pressedKey === "ENTER" && !gameIsOn && readyToStart) {
    startText.classList.add("fade-out");
    fillAlphabet();
    updateUI(document.querySelector(".bad"));
    gameIsOn = true;
    readyToStart = false;
    timer(30);
  } else if (alphabet.includes(pressedKey) && gameIsOn) {
    checkKeyNature(pressedKey);
  }
});

const fillAlphabet = () => {
  container.innerHTML = "";
  container.classList.remove("fade-out");
  container.style.display = "grid";
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

      container.classList.add("fade-out");
      header.classList.add("fade-out");
      setTimeout(() => {
        container.style.display = "none";
        header.style.display = "none";

        endgame.classList.remove("fade-out");
        endgame.style.display = "flex";

        finalScore.innerText = score;

        gameIsOn = false;

        if (score > 0) {
          nameSubmit.style.display = "initial";
          nameSubmit.classList.remove("fade-out");
        } else {
          callLeaderboard();
        }
      }, 500);
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

// Submit name to Leaderboard
nameSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  addScore(e.target.username.value.trim(), score);
  e.target.reset();
  e.target.classList.add("fade-out");
});

async function addScore(name, score) {
  const newScore = {
    name,
    score,
  };
  await scores.add(newScore);
  callLeaderboard();
}

restart.addEventListener("click", (e) => {
  e.preventDefault();

  score = 0;
  scoreUI.innerText = score;
  timerUI.innerText = "--";
  comboCount = 0;
  scoreUI.parentElement.classList.remove("combo-x2", "combo-x4");
  endgame.classList.add("fade-out");
  setTimeout(() => {
    endgame.style.display = "none";
    header.classList.remove("fade-out");
    header.style.display = "flex";
    startText.classList.remove("fade-out");
    startText.style.display = "block";
    leaderboard.parentElement.style.display = "none";
    leaderboard.innerHTML = "";
    readyToStart = true;
  }, 200);
});

// Debug this garbage !
// setInterval(showScore, 1000);
// function showScore() {
//   console.log(`Hey, the score is ${score}`);
// }
