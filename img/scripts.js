const quizConfig = (function() {

	const decode = (hexArray) => {
		return hexArray.map(hex => 'a' + String.fromCharCode(hex));
	};
	
	const config = {};
	for (const [key, value] of Object.entries(data)) {
		config[key] = {
			type: value.t === 'c' ? 'checkbox' : 'radio',
			correctAnswers: decode(value.c)
		};
	}
	
	return config;
})();

function checkAnswers() {
	let allQuestionsAnswered = true;
	
	document.querySelectorAll('.question').forEach(question => {
		question.classList.remove('question-error');
	});
	document.querySelectorAll('.error').forEach(error => {
		error.style.display = 'none';
	});
	
	for (const questionId of Object.keys(quizConfig)) {
		const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
		let hasAnswer = false;
		
		if (quizConfig[questionId].type === 'checkbox') {
			hasAnswer = Array.from(inputs).some(input => input.checked);
		} else if (quizConfig[questionId].type === 'radio') {
			hasAnswer = Array.from(inputs).some(input => input.checked);
		}
		
		if (!hasAnswer) {
			allQuestionsAnswered = false;
			document.getElementById(`error-${questionId}`).style.display = 'block';
			document.getElementById(`question-${questionId}`).classList.add('question-error');
		}
	}
	
	if (!allQuestionsAnswered) {
		document.getElementById('result').innerHTML = '❌ Пожалуйста, ответьте на все вопросы';
		document.getElementById('result').style.backgroundColor = '#fff3cd';
		document.getElementById('result').style.color = '#856404';
		return;
	}
	
	let correctCount = 0;
	const totalQuestions = Object.keys(quizConfig).length;
	
	document.querySelectorAll('.question p').forEach(p => {
		p.classList.remove('correct', 'incorrect');
	});
	
	for (const [questionId, questionConfig] of Object.entries(quizConfig)) {
		const isCorrect = checkQuestion(questionId, questionConfig);
		
		if (isCorrect) {
			correctCount++;
		}
	}
	
	showResult(correctCount, totalQuestions);
}

function checkQuestion(questionId, questionConfig) {
	const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
	let isCorrect = false;
	
	if (questionConfig.type === 'checkbox') {
		const selectedAnswers = Array.from(document.querySelectorAll(`input[name="${questionId}"]:checked`))
			.map(input => input.value);
		
		const correctAnswers = questionConfig.correctAnswers;
		isCorrect = selectedAnswers.length === correctAnswers.length &&
				   selectedAnswers.every(answer => correctAnswers.includes(answer));
		
		inputs.forEach(input => {
			const parent = input.parentElement;
			if (correctAnswers.includes(input.value)) {
				parent.classList.add('correct');
			} else if (input.checked) {
				parent.classList.add('incorrect');
			}
		});
		
	} else if (questionConfig.type === 'radio') {
		const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
		isCorrect = selectedAnswer && questionConfig.correctAnswers.includes(selectedAnswer.value);
		
		inputs.forEach(input => {
			const parent = input.parentElement;
			if (questionConfig.correctAnswers.includes(input.value)) {
				parent.classList.add('correct');
			} else if (input.checked) {
				parent.classList.add('incorrect');
			}
		});
	}
	
	return isCorrect;
}

function showResult(correctCount, totalQuestions) {
	const resultDiv = document.getElementById('result');
	const percentage = (correctCount / totalQuestions) * 100;
	
	resultDiv.innerHTML = `✅ Правильных ответов: ${correctCount} из ${totalQuestions}`;
	
	if (percentage === 100) {
		resultDiv.style.backgroundColor = '#d4edda';
		resultDiv.style.color = '#155724';
	} else if (percentage >= 50) {
		resultDiv.style.backgroundColor = '#fff3cd';
		resultDiv.style.color = '#856404';
	} else {
		resultDiv.style.backgroundColor = '#f8d7da';
		resultDiv.style.color = '#721c24';
	}
}