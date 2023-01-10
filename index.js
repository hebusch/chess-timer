let currentPlayer = 2;
let interval;
let startTime = 5 * 60;



function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function updateTimer(timer, time) {
  const formattedTime = formatTime(time);

  timer.innerHTML = formattedTime;
}

function player1() {
  currentPlayer = 1;
  interval = setInterval(() => {
    time1 -= 1;
    updateTimer(timer1, time1);
  }, 1000); 
}

function player2() {
  currentPlayer = 2;
  interval = setInterval(() => {
    time2 -= 1;
    updateTimer(timer2, time2);
  }, 1000); 
}

function start() {
  player1();
}

const timer1 = document.querySelector('#timer1');
const timer2 = document.querySelector('#timer2');
let time1 = startTime;
let time2 = startTime;  

timer1.innerHTML = formatTime(time1);
timer2.innerHTML = formatTime(time2);

const startButton = document.querySelector('#start');

function changePlayer() {
  clearInterval(interval);
  if (currentPlayer === 1) {
    currentPlayer = 2;
    player2();
  } else {
    currentPlayer = 1;
    player1();
  }
}

// on space bar press, change player and timer
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    changePlayer();
  }
});