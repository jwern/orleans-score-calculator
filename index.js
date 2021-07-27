const sessionScores = (function () {
  let developmentTrack = 1;

  let totalScore = {
    coins: 0,
    grain: 0,
    cheese: 0,
    wine: 0,
    wool: 0,
    brocade: 0,
    citizens: 0,
    trading: 0,
  };

  function getDevelopmentTrack() {
    return developmentTrack;
  }

  function updateDevelopmentTrack(total) {
    developmentTrack = total;
  }

  return { getDevelopmentTrack, totalScore, updateDevelopmentTrack };
})();

const adjustScores = (function () {
  let scoreMultiplier = function () {
    return {
      coins: 1,
      grain: 1,
      cheese: 2,
      wine: 3,
      wool: 4,
      brocade: 5,
      citizens: sessionScores.getDevelopmentTrack(),
      trading: sessionScores.getDevelopmentTrack(),
    };
  };

  function updateTotalScore(item) {
    let multipliedValue = item.value * scoreMultiplier()[item.name];
    sessionScores.totalScore[item.name] = Number(multipliedValue);
  }

  function getTotalScore() {
    let total = Object.values(sessionScores.totalScore).reduce(
      (total, num) => total + num
    );
    return total;
  }

  return { getTotalScore, updateTotalScore };
})();

// The development track is used as a multiplier for citizens & trading scores
// So if development is updated, we need to recalculate those totals
const recalculateDevelopmentPoints = function () {
  const calculatorForm = document.getElementById("scores");

  let citizens = calculatorForm.querySelector("#citizens");
  let trading = calculatorForm.querySelector("#trading");

  adjustScores.updateTotalScore(citizens);
  adjustScores.updateTotalScore(trading);
};

const adjustTotal = function (score) {
  if (score.name === "development") {
    sessionScores.updateDevelopmentTrack(score.value);
    recalculateDevelopmentPoints();
  } else {
    adjustScores.updateTotalScore(score);
  }

  let results = document.getElementById("results");
  results.textContent = adjustScores.getTotalScore();
};

const changeScoreWithButton = function (direction, score) {
  if (direction === "increment") {
    score.value++;
  } else if (score.value > 0) {
    score.value--;
  }

  adjustTotal(score);
};

const addArrowButtons = function (inputs) {
  inputs.forEach((input) => {
    let upArrow = document.createElement("button");
    upArrow.id = `${input.id}UpArrow`;
    upArrow.innerHTML = "&#9650;";
    input.insertAdjacentElement("afterend", upArrow);
    upArrow.addEventListener("click", (event) => {
      event.preventDefault();
      changeScoreWithButton("increment", input);
    });

    let downArrow = document.createElement("button");
    downArrow.id = `${input.id}DownArrow`;
    downArrow.innerHTML = "&#9660;";
    upArrow.insertAdjacentElement("afterend", downArrow);
    downArrow.addEventListener("click", (event) => {
      event.preventDefault();
      changeScoreWithButton("decrement", input);
    });
  });
};

const createSession = function () {
  const calculatorForm = document.getElementById("scores");
  calculatorForm.reset();

  const scores = calculatorForm.querySelectorAll("input");
  addArrowButtons(scores);

  scores.forEach((score) =>
    score.addEventListener("change", (event) => adjustTotal(event.target))
  );
};

window.addEventListener("load", createSession);
