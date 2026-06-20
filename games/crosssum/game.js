(function () {
  var numbers = [];
  var answer = 0;
  var timerInterval = null;
  var elapsed = 0;
  var roundActive = false;

  function digitalRoot(n) {
    if (n === 0) return 0;
    var r = n % 9;
    return r === 0 ? 9 : r;
  }

  function computeAnswer(nums) {
    var sum = nums.reduce(function (acc, n) { return acc + n; }, 0);
    return digitalRoot(sum);
  }

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function startTimer() {
    elapsed = 0;
    document.getElementById('timer').textContent = '0:00';
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      elapsed++;
      document.getElementById('timer').textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function newRound() {
    numbers = [];
    for (var i = 0; i < 6; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }
    answer = computeAnswer(numbers);
    roundActive = true;

    var display = document.getElementById('numbers-display');
    display.innerHTML = '';
    numbers.forEach(function (n) {
      var tile = document.createElement('div');
      tile.className = 'cs-tile';
      tile.textContent = n;
      display.appendChild(tile);
    });

    var input = document.getElementById('answer-input');
    input.value = '';
    input.disabled = false;
    document.getElementById('check-btn').disabled = false;

    hideMessage();
    startTimer();
    input.focus();
  }

  function showMessage(text, type) {
    var el = document.getElementById('message');
    el.textContent = text;
    el.className = 'message visible ' + type;
  }

  function hideMessage() {
    var el = document.getElementById('message');
    el.className = 'message';
  }

  function saveScore(time) {
    var scores = JSON.parse(localStorage.getItem('mp-crosssum-scores') || '[]');
    var now = new Date();
    var dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    scores.push({ t: time, d: dateStr });
    scores.sort(function (a, b) {
      return (typeof a === 'number' ? a : a.t) - (typeof b === 'number' ? b : b.t);
    });
    scores = scores.slice(0, 5);
    localStorage.setItem('mp-crosssum-scores', JSON.stringify(scores));
  }

  function renderScores() {
    var scores = JSON.parse(localStorage.getItem('mp-crosssum-scores') || '[]');
    var list = document.getElementById('scores-list');
    list.innerHTML = '';
    if (scores.length === 0) {
      list.innerHTML = '<li><span class="cs-scores-empty">No scores yet — play a round!</span></li>';
      return;
    }
    scores.forEach(function (s, i) {
      var t = typeof s === 'number' ? s : s.t;
      var d = s && s.d ? s.d : '';
      var li = document.createElement('li');
      li.className = 'cs-score-row';
      li.innerHTML =
        '<span class="cs-score-rank' + (i === 0 ? ' gold' : '') + '">' + (i + 1) + '</span>' +
        '<span class="cs-score-time">' + formatTime(t) + '</span>' +
        (d ? '<span class="cs-score-date">' + d + '</span>' : '');
      list.appendChild(li);
    });
  }

  function checkAnswer() {
    if (!roundActive) return;
    var val = parseInt(document.getElementById('answer-input').value, 10);
    if (isNaN(val) || val < 1 || val > 9) {
      showMessage('Enter a number between 1 and 9.', 'error');
      return;
    }
    if (val === answer) {
      stopTimer();
      roundActive = false;
      saveScore(elapsed);
      renderScores();
      newRound();
    } else {
      showMessage('Not quite — keep trying!', 'error');
      document.getElementById('answer-input').value = '';
      document.getElementById('answer-input').focus();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderScores();
    newRound();

    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('new-btn').addEventListener('click', function () {
      stopTimer();
      newRound();
    });
    document.getElementById('answer-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') checkAnswer();
    });
  });
})();
