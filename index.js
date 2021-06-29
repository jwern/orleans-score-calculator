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

    console.log(sessionScores.totalScore);
  }

  function getTotalScore() {
    let total = Object.values(sessionScores.totalScore).reduce(
      (total, num) => total + num
    );
    return total;
  }

  return { getTotalScore, updateTotalScore };
})();

const recalculateDevPoints = function () {
  const calculatorForm = document.getElementById("scores");

  let citizens = calculatorForm.querySelector("#citizens");
  let trading = calculatorForm.querySelector("#trading");

  adjustScores.updateTotalScore(citizens);
  adjustScores.updateTotalScore(trading);
};

const adjustTotal = function () {
  if (this.name === "development") {
    sessionScores.updateDevelopmentTrack(this.value);
    recalculateDevPoints();
  } else {
    adjustScores.updateTotalScore(this);
  }

  let results = document.getElementById("results");
  results.textContent = adjustScores.getTotalScore();
};

const createSession = function () {
  const calculatorForm = document.getElementById("scores");
  calculatorForm.reset();

  const scores = calculatorForm.querySelectorAll("input");

  scores.forEach((score) => score.addEventListener("change", adjustTotal));
};

window.addEventListener("load", createSession);
