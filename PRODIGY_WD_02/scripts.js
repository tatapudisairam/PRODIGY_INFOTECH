const hourCircle = document.getElementById('hh');
const minuteCircle = document.getElementById('mm');
const secondCircle = document.getElementById('ss');

const hourValue = document.getElementById('hours');
const minuteValue = document.getElementById('minutes');
const secondValue = document.getElementById('seconds');

const startPauseBtn = document.querySelector('.start-pause-btn');
const resetBtn = document.querySelector('.reset-btn');
const lapBtn = document.querySelector('.lap-btn');
const lapsContainer = document.querySelector('.laps');
const noLapsText = document.querySelector('.no-laps');

const hrDot = document.querySelector('.hr_dot');
const minDot = document.querySelector('.min_dot');
const secDot = document.querySelector('.sec_dot');

let intervalId = null;
let startTime = null;
let elapsedTime = 0;
let isPaused = false;
let lapTimes = [];

function padZero(value) {
    return value.toString().padStart(2, '0');
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedMilliseconds = currentTime - startTime + elapsedTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    hourValue.textContent = padZero(hours);
    minuteValue.textContent = padZero(minutes);
    secondValue.textContent = padZero(seconds);

    hourCircle.style.strokeDashoffset = 214 - (214 * hours) / 24;
    minuteCircle.style.strokeDashoffset = 214 - (214 * minutes) / 60;
    secondCircle.style.strokeDashoffset = 214 - (214 * seconds) / 60;

    hrDot.style.transform = `rotate(${hours * 15}deg)`;
    minDot.style.transform = `rotate(${minutes * 6}deg)`;
    secDot.style.transform = `rotate(${seconds * 6}deg)`;
}

startPauseBtn.addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        elapsedTime += new Date().getTime() - startTime;
        isPaused = true;
        startPauseBtn.textContent = 'Start';
    } else {
        startTime = new Date().getTime();
        if (isPaused) {
            elapsedTime = elapsedTime;
            isPaused = false;
        }
        intervalId = setInterval(updateTimer, 1000);
        startPauseBtn.textContent = 'Pause';
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
    startTime = null;
    elapsedTime = 0;
    hourValue.textContent = '00';
    minuteValue.textContent = '00';
    secondValue.textContent = '00';
    hourCircle.style.strokeDashoffset = 214;
    minuteCircle.style.strokeDashoffset = 214;
    secondCircle.style.strokeDashoffset = 214;
    hrDot.style.transform = 'rotate(0deg)';
    minDot.style.transform = 'rotate(0deg)';
    secDot.style.transform = 'rotate(0deg)';
    lapTimes = [];
    lapsContainer.innerHTML = '';
    noLapsText.style.display = 'block';
    startPauseBtn.textContent = 'Start';
});

lapBtn.addEventListener('click', () => {
    const lapTime = `${hourValue.textContent}:${minuteValue.textContent}:${secondValue.textContent}`;
    lapTimes.push(lapTime);
    const lapItem = document.createElement('div');
    lapItem.classList.add('lap-item');
    const lapNumber = document.createElement('span');
    lapNumber.classList.add('lap-number');
    lapNumber.textContent = `Lap ${lapTimes.length}`;
    const lapTimeSpan = document.createElement('span');
    lapTimeSpan.classList.add('lap-time');
    lapTimeSpan.textContent = lapTime;
    lapItem.appendChild(lapNumber);
    lapItem.appendChild(lapTimeSpan);
    lapsContainer.appendChild(lapItem);

    noLapsText.style.display = 'none';
});