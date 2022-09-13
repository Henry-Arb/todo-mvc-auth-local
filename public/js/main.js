const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.complete')
const todoComplete = document.querySelectorAll('span.completed')
const startButton = document.querySelectorAll('.start')
const focusTask = document.querySelectorAll('tr')

Array.from(startButton).forEach((el) => {
	el.addEventListener('click', startTimer)
})

Array.from(deleteBtn).forEach((el) => {
	el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el) => {
	el.addEventListener('click', markComplete)
})

Array.from(focusTask).forEach((el) => {
	el.addEventListener('click', focusColor)
})

// Array.from(todoComplete).forEach((el) => {
// 	el.addEventListener('click', markIncomplete)
// })


async function deleteTodo() {
	const todoId = this.parentNode.parentNode.dataset.id
	console.log('click')
	try {
		const response = await fetch('todos/deleteTodo', {
			method: 'delete',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				todoIdFromJSFile: todoId,
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

async function markComplete() {
	const todoId = this.parentNode.parentNode.dataset.id
	
	// get session count 

	//get duration 
	const timeDuration = document.querySelector('#time')
	const calculatedtimeDuration = 25 - Math.floor(parseInt(timeDuration.innerText))
	// if task completed after a few pomodoro session, this line will add last session's duration to the total minutes spent
	timer.totalMinute += calculatedtimeDuration
	
	try {
		const response = await fetch('todos/markComplete', {
			method: 'put',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				'todoIdFromJSFile': todoId,
				'timeDurationFromJSFile': timer.totalMinute
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

// async function markIncomplete() {
// 	const todoId = this.parentNode.dataset.id
// 	try {
// 		const response = await fetch('todos/markIncomplete', {
// 			method: 'put',
// 			headers: { 'Content-type': 'application/json' },
// 			body: JSON.stringify({
// 				'todoIdFromJSFile': todoId,
// 			}),
// 		})
// 		const data = await response.json()
// 		console.log(data)
// 		location.reload()
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

function focusColor(){
	console.log('change color')
}

// Pomodoro timer and break session
document.addEventListener('DOMContentLoaded', () => {
	switchMode('pomodoro')
})
const timer = {
	pomodoro: 25,
	shortBreak: 5,
	sessions: 0,
	totalMinute: 0
}
function getRemainingTime(endTime) {
	const currentTime = Date.parse(new Date())
	const difference = endTime - currentTime

	const total = Number.parseInt(difference / 1000, 10)
	const minutes = Number.parseInt((total / 60) % 60, 10)
	const seconds = Number.parseInt(total % 60, 10)

	return {
		total,
		minutes,
		seconds,
	}
}
function startTimer() {
	let { total } = timer.remainingTime
	const endTime = Date.parse(new Date()) + total * 1000

	if (timer.mode === 'pomodoro') timer.sessions++

	interval = setInterval(function () {
		timer.remainingTime = getRemainingTime(endTime)
		updateClock()

		total = timer.remainingTime.total
		if (total <= 0) {
			clearInterval(interval)

			switch (timer.mode) {
				case 'pomodoro':
	// Add worked duration to totalMinute
					timer.totalMinute += timer.pomodoro
					timer.sessions += 1
					switchMode('shortBreak')
	// Start break after pomodoro session
					startTimer()
					break
				default:
					switchMode('pomodoro')
	
			}
	// Move startTimer() to conditional	statement above because we want timer to stop after break	
		}
	}, 1000)
}

function updateClock() {
	const { remainingTime } = timer
	const minutes = `${remainingTime.minutes}`.padStart(2, '0')
	const seconds = `${remainingTime.seconds}`.padStart(2, '0')

	const modeDisplay = document.getElementById('timerMode')
	modeDisplay.textContent = timer.mode === 'pomodoro' ? 'Pomodoro' : 'Short Break'
	const timeDisplay = document.querySelector('#time')
	timeDisplay.textContent = minutes + ':' + seconds
}

function switchMode(mode) {
	timer.mode = mode
	timer.remainingTime = {
		total: timer[mode] * 60,
		minutes: timer[mode],
		seconds: 0,
	}

	updateClock()
}
