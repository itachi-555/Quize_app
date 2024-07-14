document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('next');
    const quizCounter = document.getElementById('Quiz_counter');
    const Quiz = document.getElementById('Quiz');
    const answersElement = document.getElementById('Answers');
    const types = document.getElementById('types');
    const type = document.getElementById('type');
    const amount = 10;
    let Quizes = []; // Initialize Quizes array to store quiz objects
    let counter = 0;
    let answered = false;
    let correctAnswerButton;
    function fetchCategories() {
        fetch('https://opentdb.com/api_category.php')
            .then(response => response.json())
            .then(data => {
                // data.categories is an array of category objects
                data.trivia_categories.forEach(category => {
                    // Create an <option> element for each category
                    let option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    types.appendChild(option);
                });

                // After populating options, add event listener for change
                types.addEventListener('change', function () {
                    fetchQuize();
                });

                // Call fetchQuize() initially after options are populated
                fetchQuize();
            })
            .catch(error => console.error('Error fetching categories:', error));
    }
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function fetchQuize() {
        // Check if types.options[types.selectedIndex] is defined
        if (types.selectedIndex !== -1) {
            type.innerText = types.options[types.selectedIndex].textContent;
            fetch(`https://opentdb.com/api.php?amount=${amount}&category=${types.value}&difficulty=easy&type=multiple`)
                .then(response => response.json())
                .then(data => {
                    Quizes = []; // Clear Quizes array before fetching new data
                    data.results.forEach((question, index) => {
                        let answers = [...question.incorrect_answers, question.correct_answer]; // Combine incorrect and correct answers
                        answers = shuffle(answers);
                        let Quiz = {
                            Question: question.question,
                            Answers: answers,
                            correctAnswer: question.correct_answer
                        };

                        Quizes.push(Quiz); // Push each quiz object into the Quizes array
                    });
                    counter = 0; // Reset counter when fetching new quiz data
                    displayQuiz(); // Display the first quiz question and answers
                })
                .catch(error => console.error('Error:', error));
        }
    }

    nextButton.addEventListener('click', function () {
        next();
        answered = false;
        nextButton.disabled = true; // Disable next button after click
    });

    function displayQuiz() {
        quizCounter.innerText = `${counter + 1} of ${Quizes.length}`
        Quiz.innerHTML = Quizes[counter].Question;
        // Clear previous answer buttons
        answersElement.innerHTML = '';

        Quizes[counter].Answers.forEach((answer, index) => {
            let button = document.createElement('button');
            button.className = 'Answer';
            button.id = `Answer${index}`;
            button.innerHTML = answer;
            button.addEventListener('click', function () {
                checkAnswer(button);
            });
            answersElement.appendChild(button);
            if (answer == Quizes[counter].correctAnswer) {
                correctAnswerButton = button;
            }
        });

        // Enable next button only if an answer has been clicked
        nextButton.disabled = !answered;
        for (let index = 0; index < 4; index++) {
            document.getElementById(`Answer${index}`).disabled = false;
        }
    }

    function next() {
        counter++;
        if (counter < Quizes.length) {
            displayQuiz();
        }
    }
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            nextButton.click();
            console.log('button is disabled');
        }
    });
    function checkAnswer(button) {
        let selectedAnswer = button.textContent;
        correctAnswerButton.style.backgroundColor = 'green';
        correctAnswerButton.style.color = 'white';
        if (correctAnswerButton != button) {
            button.style.backgroundColor = 'red';
            button.style.color = 'white';
        }
        answered = true;
        if (counter + 1 < Quizes.length) {
            nextButton.disabled = false;
        }
        for (let index = 0; index < 4; index++) {
            document.getElementById(`Answer${index}`).disabled = true;
        }
    }

    fetchCategories();
});
