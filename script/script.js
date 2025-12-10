document.addEventListener('DOMContentLoaded', function() {
  
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const nextButton = document.querySelector('#next');
  const prevButton = document.querySelector('#prev');
  const sendButton = document.querySelector('#send');
  
  const firebaseConfig = {
	apiKey: "AIzaSyBf3z-MGOxfVadj9FWvQ_mFzH44vL8auhw",
	authDomain: "pr4-3-9c1e2.firebaseapp.com",
	databaseURL: "https://pr4-3-9c1e2-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "pr4-3-9c1e2",
	storageBucket: "pr4-3-9c1e2.firebasestorage.app",
	messagingSenderId: "6853118034",
	appId: "1:6853118034:web:f27597c75bf296e92e778b"

  };
  
  const getData = () => {
	formAnswers.textContent = 'LOAD';
	
	nextButton.classList.add('d-none');
	prevButton.classList.add('d-none');
	setTimeout(() => {
		app.database().ref().child('questions').once('value')
			.then(snap => playTest(snap.val()))
	}, 500)
  }

  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block');
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
  });

  const playTest = () => {
	  let numberQuestion = 0;
	
	const finalAnswers = [];
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
		const answerItem = document.createElement('div');
		
		answerItem.classList.add('answer-item', 'd-flex', 'justify-content-centre');
		
		answerItem.innerHTML = `
        <div class="answers-item d-flex flex-column">
          <input type="radio" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
	  <label for="${answer.title}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${answer.url}" alt="burger">
	  <span>${answer.title}</span>
          </label>
        </div>
      `;
	  formAnswers.appendChild(answerItem);
	  })
    };
    const renderQuestion = (indexQuestion) => {
		formAnswers.innerHTML = '';
		
		switch(numberQuestion) {
			case 0:
				questionTitle.textContent = `${questions[indexQuestion].question}`;
				renderAnswers(indexQuestion);
				prevButton.classList.add('d-none');
				break;
			case questions.length:
				nextButton.classList.add('d-none');
				prevButton.classList.add('d-none');
				sendButton.classList.remove('d-none');
				formAnswers.innerHTML = `
				<div class="form-group">
				<label for="numberPhone">Enter your number</label>
				<input type="phone" class="form-control" id="numberPhone">
				</div>
				`;
				break;
			case questions.length + 1:
				formAnswers.textContent = 'Спасибо за пройденый тест!';
				setTimeout(() => {
					modalBlock.classList.remove('d-block');
				}, 2000);
				break;
			default:
				questionTitle.textContent = `${questions[indexQuestion].question}`;
				renderAnswers(indexQuestion);
				nextButton.classList.remove('d-none');
				prevButton.classList.remove('d-none');
				sendButton.classList.add('d-none');
		}
	}
	
	renderQuestion(numberQuestion);
	
	const checkAnswer = () => {
		const obj = {};
		
		const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
		
		
		inputs.forEach((input, index) => {
			if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
				obj[`${index}_{questions[numberQuestion].question}`] = input.value;
			}
			
			if (numberQuestion === questions.length) {
				obj["Номер телефона"] = input.value;
			}
		})
		
		finalAnswers.push(obj);
	}
	
	prevButton.onclick = () => {
		checkAnswer();
		numberQuestion--;
		renderQuestion(numberQuestion);
	}
	
	nextButton.onclick = () => {
		numberQuestion++;
		renderQuestion(numberQuestion);
	}
	
	sendButton.onclick = () => {
		checkAnswer();
		numberQuestion++;
		renderQuestion(numberQuestion);
		firebase
			.database()
			.ref()
			.child('contacts')
			.push(finalAnswers)
	}
  };
});