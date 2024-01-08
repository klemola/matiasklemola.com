let textContent = {
  startScheduledTimeSignal: 'Begin scheduled time signal',
  stopScheduledTimeSignal: 'Stop scheduled time signal',
}

let el_playTimeSignal = document.querySelector('#play-time-signal')
let el_toggleScheduledTimeSignal = document.querySelector('#toggle-scheduled-time-signal')
let el_clock = document.querySelector('#clock')

let locale = new Intl.DateTimeFormat().resolvedOptions().locale
let dateTimeFormat = new Intl.DateTimeFormat(locale, {
  dateStyle: 'short',
  timeStyle: 'medium',
})

let state_ready = false
let state_isTimeSignalScheduled = false
let state_autoplay_enabled = false
let pips = new Audio('/pages/time-signal/pips.flac')
let DEFAULT_PIPS_VOLUME = 0.75

window.addEventListener('DOMContentLoaded', () => {
  pips.addEventListener('canplaythrough', main)
  pips.load()
})

function main() {
  if (state_ready) {
    return
  }

  state_ready = true

  el_playTimeSignal.addEventListener('click', () => pips.play())

  el_toggleScheduledTimeSignal.addEventListener('click', onToggleScheduledTimeSignal)
  el_toggleScheduledTimeSignal.innerHTML = textContent.startScheduledTimeSignal

  pips.addEventListener('playing', onPipsStart)
  pips.addEventListener('ended', onPipsEnded)

  window.requestAnimationFrame(onTick)
}

function onPipsStart() {
  el_playTimeSignal.setAttribute('disabled', true)
}

function onPipsEnded() {
  el_playTimeSignal.removeAttribute('disabled')
  pips.currentTime = 0
  pips.volume = DEFAULT_PIPS_VOLUME
}

function onToggleScheduledTimeSignal() {
  state_isTimeSignalScheduled = !state_isTimeSignalScheduled

  el_toggleScheduledTimeSignal.innerHTML = state_isTimeSignalScheduled
    ? textContent.stopScheduledTimeSignal
    : textContent.startScheduledTimeSignal

  if (state_isTimeSignalScheduled && !state_autoplay_enabled) {
    pips.volume = 0.0

    // attempt to play the tone to recognize blocked autoplay
    pips
      .play()
      .then(() => {
        pips.pause()
        onPipsEnded()
        state_autoplay_enabled = true
        console.log('Audio autoplay enabled')
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          console.log('Audio autoplay not allowed')
        }
      })
  }
}

function onTick() {
  let now = new Date()
  let minuteMilliseconds = 60 * 1000
  let elapsedMinuteMilliseconds = now.getSeconds() * 1000 + now.getMilliseconds()
  let isPipsStopped = pips.currentTime == 0
  let isPipsTime = minuteMilliseconds - elapsedMinuteMilliseconds <= 5000

  el_clock.setAttribute('datetime', now.toUTCString())
  el_clock.innerHTML = dateTimeFormat.format(now)

  if (state_isTimeSignalScheduled && isPipsStopped && isPipsTime) {
    pips.play()
  }

  window.requestAnimationFrame(onTick)
}
