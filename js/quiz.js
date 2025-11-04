// Quiz questions
const quizData = [
  {
    tag: "Diet",
    question: "What is your diet preference?",
    options: ["Vegan", "Vegetarian", "Gluten Free", "Low Fat"],
    type: "checkbox"
  },
  {
    tag: "Diet",
    question: "Do you have any allergies?",
    options: ["Peanuts", "Dairy", "Soy", "None"],
    type: "checkbox"
  },
  {
    tag: "Activity",
    question: "How often do you exercise?",
    options: ["Daily", "Weekly", "Monthly", "Rarely"],
    type: "radio"
  }
];

// Elements
let currentQuestion = 0;
const questionEl = document.getElementById("question");
const tagEl = document.querySelector(".tag");
const answerContainer = document.getElementById("answers");
const progressBar = document.querySelector(".progress-bar");

const nextBtn = document.getElementById("next-button");
const prevBtn = document.getElementById("previous-button");
const skipBtn = document.getElementById("skip-button");

// save answers function
function saveAnswer(){
  const inputs = answerContainer.querySelectorAll("input");
  const selected = [];

  inputs.forEach(input => {
    if(input.checked){
      selected.push(input.value);
    }
  });
  answers[currentQuestion] = selected;
}


// Load a question
function loadQuestion() {
  const q = quizData[currentQuestion];
  if (!q) return;

  questionEl.textContent = q.question;
  tagEl.textContent = q.tag;

  answerContainer.innerHTML = "";

  q.options.forEach(option => {
    const label = document.createElement("label"); // creates label for each answer option
    label.classList.add("answer-option-box");

    const input = document.createElement("input"); // creates input element for each answer option
    input.type = q.type;
    input.name = "question-" + currentQuestion;
    input.value = option;

    label.appendChild(input);
    label.append(" " + option);
    answerContainer.appendChild(label);
  });

  // progress bar corresponds to amount of questions finished
  progressBar.style.width = ((currentQuestion + 1) / quizData.length) * 100 + "%";

  if (currentQuestion === quizData.length - 1) {
    nextBtn.textContent = "Finish";
  } else {
    nextBtn.textContent = "Next";
  }
}

nextBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentQuestion < quizData.length - 1) {
    // Go to next question
    currentQuestion++;
    loadQuestion();
  } 
  else {
    localStorage.setItem("quizAnswers", JSON.stringify(answers)); 
    window.location.href = "foodtracker.html"; // go to next page
  }
});

// goes back to previous question
prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

// skips current question and displays next question
skipBtn.addEventListener("click", () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
});

// Start quiz
loadQuestion();