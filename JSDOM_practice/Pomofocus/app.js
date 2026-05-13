var wrapper = document.querySelector('.wrapper')
var timerCard = document.querySelector('.timer-card')
var timer = document.querySelector('.timer')
var body = document.querySelector('body')
var pomodoraBtn = document.querySelector('.pomodoro-btn')
var shortBreakBtn = document.querySelector('.short-break-btn')
var longBreakBtn = document.querySelector('.long-break-btn')
var startBtn = document.querySelector('.start-btn')
var pauseBtn = document.querySelector('.pause-btn')
var previousClickedBtn = pomodoraBtn;
var startingSeconds = 15
let timeLeft = startingSeconds * 1000
let interval
let modes = {
    pomodoro: 'pomodoro',
    shor: 'short',
    long: 'long'
}
let durations = {
    pomodoro: 15,
    short: 5,
    long: 10
}
let cycleSteps = [
    modes.pomodoro,
    modes.short,
    modes.pomodoro,
    modes.long
]
let activatedMode = modes.pomodoro
cycleRunning = false
cycleStepIndex = 0



function handleShortBreak() {
    body.style.backgroundColor = '#376F6F'
    timerCard.style.backgroundColor = '#4C9A9A'
    startBtn.style.color = '#4C9A9A'
    pauseBtn.style.color = '#4C9A9A'
    activatedMode = modes.short
    activateThisButton(shortBreakBtn, '05:000', durations.short)
}

function handleLongBreak() {
    body.style.backgroundColor = '#355279'
    timerCard.style.backgroundColor = '#4A6FA5'
    startBtn.style.color = '#4A6FA5'
    pauseBtn.style.color = '#4A6FA5'
    activatedMode = modes.long
    activateThisButton(longBreakBtn, '10:000', durations.long)
}

function handlePomodora() {
    body.style.backgroundColor = '#A84E48'
    timerCard.style.backgroundColor = '#C0605A'
    startBtn.style.color = '#C0605A'
    pauseBtn.style.color = '#C0605A'
    activatedMode = modes.pomodoro
    activateThisButton(pomodoraBtn, '15:000', durations.pomodoro)
}

function activateThisButton(currentClickedBtn, limit, startLimit) {
    previousClickedBtn.style.backgroundColor = 'transparent'
    previousClickedBtn.style.opacity = '0.7'
    currentClickedBtn.style.opacity = '1'
    currentClickedBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'
    previousClickedBtn = currentClickedBtn

    timer.textContent = limit
    startingSeconds = startLimit
    timeLeft = startingSeconds * 1000
}

function startCountdown() {
    if (interval) { return }
    startBtn.style.display = 'none'
    pauseBtn.style.display = 'initial'

    if (cycleRunning) {
        runCountdownInterval()
        return
    }

    if (activatedMode == modes.pomodoro) {
        beginCycle()
        return
    }

    runCountdownInterval()
}

function stopCountDown() {
    clearRunningInterval()
    startBtn.style.display = 'initial'
    pauseBtn.style.display = 'none'
}

function updateTimer() {
    const seconds = Math.floor(timeLeft / 1000)
    const milliseconds = timeLeft % 1000

    timer.innerHTML = `${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`
}

function beginCycle() {
    cycleRunning = true
    cycleStepIndex  = 0
    activateMode(cycleSteps[cycleStepIndex])
    startBtn.style.display = 'none'
    pauseBtn.style.display = 'initial'
    runCountdownInterval()
}

function activateMode(mode) {
    if (mode == modes.pomodoro) { handlePomodora() }
    if (mode == modes.short) { handleShortBreak() }
    if (mode == modes.long) { handleLongBreak() }
}

function runCountdownInterval() {
    clearRunningInterval()
    interval = setInterval(() => {
        timeLeft -= 10
        updateTimer()
        if (timeLeft <= 0) {
            timeLeft = 0
            updateTimer()
            clearRunningInterval()
            onTimerFinished()
            return
        }
    }, 10)
}

function clearRunningInterval() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
}

function onTimerFinished() {
    if (!cycleRunning) {
        timeLeft = startingSeconds * 1000
        updateTimer()
        startBtn.style.display = 'initial'
        pauseBtn.style.display = 'none'
        return
    }
    cycleStepIndex++
    if (cycleStepIndex < cycleSteps.length) {
        activateMode(cycleSteps[cycleStepIndex])
        startBtn.style.display = 'none'
        pauseBtn.style.display = 'initial'
        runCountdownInterval()
        return
    }
    onCycleComplete()
}

function onCycleComplete() {
    cycleRunning = false
    cycleStepIndex = 0
    alert('Cycle complete! Great job')
    resetToDefaults()
}

function resetToDefaults() {
    clearRunningInterval()
    cycleRunning = false
    cycleStepIndex = 0
    activateMode(modes.pomodoro)
    startingSeconds = durations.pomodoro
    timeLeft = startingSeconds * 1000
    updateTimer()
    startBtn.style.display = 'initial'
    pauseBtn.style.display = 'none'
}