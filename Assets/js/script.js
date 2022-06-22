// Variables to access html elements
let scores = document.querySelector("#scores");
let timer = document.querySelector("#timer");
let container = document.querySelector("#container");
let title = document.querySelector("#title");
let content = document.querySelector("#content");
let start = document.querySelector("#start");
let answer = document.querySelector("#answer");

// Structure of questions
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

let questionList = [];

// Formatted questions an array
const options1 = ["1. array", "2. container", "3. strings", "4. Algorism"];
const question1 = new Question("What is a collection of items stored at contiguous memory locations?", options1, "1. array");
questionList.push(question1);

const options2 = ["1. Nobody knows", "2. Al Gore", "3. Bill Gates", "4. A group of people"];
const question2 = new Question("Who invented the internet?", options2, "4. A group of people");
questionList.push(question2);

const options3 = ["1. Type of language", "2. Dominos stock", "3. Varibles", "4. Application programming interface"];
const question3 = new Question("What is a DOM?", options3, "4. application programming interface");
questionList.push(question3);

const options4 = ["1. Closed Standard Captions", "2. Cascading Style Sheets", "3. Computer Selective Science", "4. Communism Stalin Statue"];
const question4 = new Question("What does CSS stand for?", options4, "2. Cascading Style Sheets");
questionList.push(question4);

const options5 = ["1. Amazon", "2. Google", "3. Facebook", "4. Twitter"];
const question5 = new Question("What company helped create Bootstrap?", options5, "4. Twitter");
questionList.push(question5);

//varibles for questions
let optionList = [];
let currentQues= 0;
let score = 0;
let timeLeft = 61;
let isQuizOngoing = false;
let leaderboard = [];
let intials = "";
let isClearingAnswer = false;
let clearingAnswerCode = 0;
let isCorrect = false;

//Init function that makes thje view scores and start button clickable
function init() {
    start.addEventListener("click", questionLoop);
    scores.addEventListener("click", showScores);
}

//makes elements before the quiz started invisible and creates option buttons
function questionLoop (){
    runTimer();
    isQuizOngoing =true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display:none");
    let numOfOptions = questionList[0].options.length;
    for(let i = 0; i < numOfOptions; i++) {
        let option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i+1}`);
    }
    nextQuestion();
}

//Counts down the timer and ends the quiz if time is zero
function runTimer () {
    let clock = setInterval(function(){
        timeLeft--;
        timer.textContent = `Time: ${timeLeft} seconds`;
        if (timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== "All Done.") {
                endOfQuiz();
            }
        }
    },1000)
}

//checks if you are the last question, or goes to next question
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}

//Checks if you are on the first question if not checks answer from pre question
//if answer isnt incorrect time left is reduced and will flash yellow