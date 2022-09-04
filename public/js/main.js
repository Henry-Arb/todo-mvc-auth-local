const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.complete')
const todoComplete = document.querySelectorAll('span.completed')
const startButton = document.querySelectorAll('.start')

Array.from(startButton).forEach((el) => {
	el.addEventListener('click', startTimer)
})

Array.from(deleteBtn).forEach((el) => {
	el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el) => {
	el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el) => {
	el.addEventListener('click', markIncomplete)
})

// startButton.addEventListener('click', startTimer)

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
	
	
	try {
		const response = await fetch('todos/markComplete', {
			method: 'put',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				'todoIdFromJSFile': todoId,
				'timeDurationFromJSFile': calculatedtimeDuration
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

async function markIncomplete() {
	const todoId = this.parentNode.dataset.id
	try {
		const response = await fetch('todos/markIncomplete', {
			method: 'put',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				'todoIdFromJSFile': todoId,
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

// Pomodoro timer and break session
document.addEventListener('DOMContentLoaded', () => {
	switchMode('pomodoro')
})
const timer = {
	pomodoro: 25,
	shortBreak: 5,
	sessions: 0,
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
					switchMode('shortBreak')

					break
				default:
					switchMode('pomodoro')
			}

			startTimer()
		}
	}, 1000)
}

function updateClock() {
	const { remainingTime } = timer
	const minutes = `${remainingTime.minutes}`.padStart(2, '0')
	const seconds = `${remainingTime.seconds}`.padStart(2, '0')

	const display = document.querySelector('#time')
	display.textContent = minutes + ':' + seconds
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
