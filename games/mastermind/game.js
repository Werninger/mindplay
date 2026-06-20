(function () {
  var COLORS = ['#e05252', '#e08c30', '#d4cc30', '#4caf70', '#4a8fe0', '#a855cc'];
  var CODE_LENGTH = 4;
  var MAX_ATTEMPTS = 10;

  var secret = [];
  var currentGuess = [];
  var selectedColor = null;
  var attempts = 0;
  var gameOver = false;

  function randomCode() {
    var code = [];
    for (var i = 0; i < CODE_LENGTH; i++) {
      code.push(Math.floor(Math.random() * COLORS.length));
    }
    return code;
  }

  function getFeedback(guess, code) {
    var black = 0;
    var white = 0;
    var codeCopy = code.slice();
    var guessCopy = guess.slice();

    for (var i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        codeCopy[i] = -1;
        guessCopy[i] = -2;
      }
    }
    for (var j = 0; j < CODE_LENGTH; j++) {
      if (guessCopy[j] === -2) continue;
      var idx = codeCopy.indexOf(guessCopy[j]);
      if (idx !== -1) {
        white++;
        codeCopy[idx] = -1;
      }
    }
    return { black: black, white: white };
  }

  function renderPalette() {
    var palette = document.getElementById('color-palette');
    palette.innerHTML = '';
    COLORS.forEach(function (color, i) {
      var dot = document.createElement('div');
      dot.className = 'color-dot';
      dot.style.background = color;
      dot.dataset.colorIndex = i;
      dot.addEventListener('click', function () {
        selectColor(i);
      });
      palette.appendChild(dot);
    });
  }

  function selectColor(i) {
    selectedColor = i;
    var dots = document.querySelectorAll('.color-dot');
    dots.forEach(function (d) { d.classList.remove('selected'); });
    if (dots[i]) dots[i].classList.add('selected');

    var firstEmpty = currentGuess.indexOf(-1);
    if (firstEmpty !== -1) {
      currentGuess[firstEmpty] = i;
      renderCurrentGuess();
    }
  }

  function renderCurrentGuess() {
    var container = document.getElementById('current-guess');
    var slots = container.querySelectorAll('.current-slot');
    slots.forEach(function (slot, i) {
      if (currentGuess[i] !== -1) {
        slot.style.background = COLORS[currentGuess[i]];
        slot.classList.add('filled');
        slot.classList.remove('active');
      } else {
        slot.style.background = '';
        slot.classList.remove('filled');
        var firstEmpty = currentGuess.indexOf(-1);
        if (i === firstEmpty) slot.classList.add('active');
        else slot.classList.remove('active');
      }
    });
    document.getElementById('submit-btn').disabled = currentGuess.indexOf(-1) !== -1 || gameOver;
  }

  function buildCurrentGuessSlots() {
    var container = document.getElementById('current-guess');
    container.innerHTML = '';
    currentGuess = [-1, -1, -1, -1];
    for (var i = 0; i < CODE_LENGTH; i++) {
      (function (idx) {
        var slot = document.createElement('div');
        slot.className = 'current-slot active';
        slot.addEventListener('click', function () {
          if (gameOver) return;
          currentGuess[idx] = -1;
          renderCurrentGuess();
        });
        container.appendChild(slot);
      })(i);
    }
    renderCurrentGuess();
  }

  function addHistoryRow(guess, feedback, attemptNum) {
    var history = document.getElementById('history');
    var row = document.createElement('div');
    row.className = 'guess-row';

    var label = document.createElement('div');
    label.className = 'attempt-label';
    label.textContent = attemptNum;
    row.appendChild(label);

    var slots = document.createElement('div');
    slots.className = 'guess-slots';
    guess.forEach(function (ci) {
      var s = document.createElement('div');
      s.className = 'guess-slot filled';
      s.style.background = COLORS[ci];
      s.style.border = 'none';
      slots.appendChild(s);
    });
    row.appendChild(slots);

    var feedbackDots = document.createElement('div');
    feedbackDots.className = 'feedback-dots';
    var total = feedback.black + feedback.white;
    for (var i = 0; i < 4; i++) {
      var d = document.createElement('div');
      d.className = 'feedback-dot';
      if (i < feedback.black) d.classList.add('black');
      else if (i < total) d.classList.add('white');
      feedbackDots.appendChild(d);
    }
    row.appendChild(feedbackDots);

    history.insertBefore(row, history.firstChild);
  }

  function showMessage(text, type) {
    var el = document.getElementById('message');
    el.textContent = text;
    el.className = 'message visible ' + type;
  }

  function revealSecret() {
    var history = document.getElementById('history');
    var reveal = document.createElement('div');
    reveal.className = 'secret-reveal';
    var label = document.createElement('span');
    label.textContent = 'Secret code:';
    reveal.appendChild(label);
    var slots = document.createElement('div');
    slots.className = 'guess-slots';
    secret.forEach(function (ci) {
      var s = document.createElement('div');
      s.className = 'guess-slot filled';
      s.style.background = COLORS[ci];
      s.style.border = 'none';
      slots.appendChild(s);
    });
    reveal.appendChild(slots);
    history.insertBefore(reveal, history.firstChild);
  }

  function submitGuess() {
    if (gameOver || currentGuess.indexOf(-1) !== -1) return;
    attempts++;
    var feedback = getFeedback(currentGuess, secret);
    addHistoryRow(currentGuess.slice(), feedback, attempts);

    if (feedback.black === CODE_LENGTH) {
      gameOver = true;
      showMessage('You cracked the code in ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') + '!', 'success');
      document.getElementById('submit-btn').disabled = true;
      document.getElementById('color-palette').style.pointerEvents = 'none';
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      gameOver = true;
      revealSecret();
      showMessage('Out of attempts! Better luck next time.', 'error');
      document.getElementById('submit-btn').disabled = true;
      document.getElementById('color-palette').style.pointerEvents = 'none';
      return;
    }

    buildCurrentGuessSlots();
    selectedColor = null;
    var dots = document.querySelectorAll('.color-dot');
    dots.forEach(function (d) { d.classList.remove('selected'); });
  }

  function newGame() {
    secret = randomCode();
    attempts = 0;
    gameOver = false;
    selectedColor = null;

    document.getElementById('history').innerHTML = '';
    document.getElementById('message').className = 'message';
    document.getElementById('color-palette').style.pointerEvents = '';

    var dots = document.querySelectorAll('.color-dot');
    dots.forEach(function (d) { d.classList.remove('selected'); });

    buildCurrentGuessSlots();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderPalette();
    newGame();

    document.getElementById('submit-btn').addEventListener('click', submitGuess);
    document.getElementById('clear-btn').addEventListener('click', function () {
      if (gameOver) return;
      buildCurrentGuessSlots();
      selectedColor = null;
      var dots = document.querySelectorAll('.color-dot');
      dots.forEach(function (d) { d.classList.remove('selected'); });
    });
    document.getElementById('new-game-btn').addEventListener('click', newGame);
  });
})();
