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
};

let questionList = [];

// Formatted questions an array
const options1 = ["1. Array", "2. Container", "3. Strings", "4. Algorism"];
const question1 = new Question("What is a collection of items stored at contiguous memory locations?", options1, "1. Array");
questionList.push(question1);

const options2 = ["1. Nobody knows", "2. Al Gore", "3. Bill Gates", "4. A group of people"];
const question2 = new Question("Who invented the internet?", options2, "4. A group of people");
questionList.push(question2);

const options3 = ["1. Type of language", "2. Dominos stock", "3. Varibles", "4. Application programming interface"];
const question3 = new Question("What is a DOM?", options3, "4. Application programming interface");
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
};

//makes elements before the quiz started invisible and creates option buttons
function questionLoop (){
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    let numOfOptions = questionList[0].options.length;
    for(let i = 0; i < numOfOptions; i++) {
        let option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i+1}`);
    }
    nextQuestion();
};

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
};

//checks if you are the last question, or goes to next question
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
};

//Checks if you are on the first question if not checks answer from pre question
//if answer isnt incorrect time left is reduced and will flash yellow
function writeAnswer(event) {
    if (event !== undefined) {
        if (event.currentTarget.textContent === questionList[currentQues -1].answer) {
            isCorrect = true;
            answer.textContent = "Correct";
            answer.setAttribute("style", "color: limegreen");
            score += 10;
        } else {
            isCorrect = false;
            answer.textContent = "Incorrect";
            answer.setAttribute("style","color: red");
            if(timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            timer.setAttribute("style", "color: yellow")
            setTimeout(function () {
                timer.setAttribute("style","color: red");
            },1000);
        }
        clearAnswer();
    }
};

//Clears answer panel
function clearAnswer() {
    if(isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function() {
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
};

//Changes the title to the next question
function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for(let i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

//Changes title to All Done., clears options and displays the score

function endOfQuiz(){
    title.textContent = "All Done.";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Your final score is ${score}`;
    inputFields();
}
function clearOptions() {
    for (let i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

//Highscore form -- sumbmit button, listen for click
function inputFields() {
    let initialsForm = document.createElement("form");
    container.appendChild(initialsForm);
    initialsForm.setAttribute("id","form");
    let label = document.createComment("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    let input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");
    let submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size 150%");

    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);
}

//Prevents entry field from reloading page
function stopReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}
//Prevents sumbmit from reloading page, checks intials format, program is over
//saves score
function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    let id = document.getElementById("initials");
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

//Score check locally; populates, adds to the array updates localstorage
function saveScore(id) {
    if (localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.push(`${score} ${id.value}`);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();
}

//leaderboard incorrect message is displayed
function invalidInput() {
    answer.textContent = "Initials must be entered and three characters or less";
    answer.setAttribute("style", "color: white");
    clearAnswer();
    let submit = document.getElementById("submit");
    submit.addEventListener("click", addScore);
}

function showScores() {
    if(!isQuizOngoing) {
        title.textContent = "High Scores";
        //hide button
        start.setAttribute("style", "display: none");
        writeScores();
        createEndButtons();
    } else if (title.textContent === "All Done.") {
        answer.textContent = "Please enter your initials first";
        answer.setAttribute("style", "color: white");
        clearAnswer();
    } else {
        answer.textContent = "Cannot view scores until the quiz is over";
        answer.setAttribute("style", "color: white");
        clearAnswer();
    }
}
//Storage of scores
function writeScores() {
    content.textContent = "";
    content.setAttribute("style", "white-space: pre-wrap; font-size 150%");
    if(localStorage.getItem ("leaderboard")!==null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.sort();
    leaderboard.reverse();
    let limit = 11;
    if(limit > leaderboard.length) {
        limit = leaderboard.length;
    }
    for(let i = 0; i < limit; i++) {
        content.textContent += leaderboard[i] + '\n';
    }
}

//Buttons for the end of quiz
function createEndButtons() {
    if(!document.getElementById("restart")) {
        let restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Restart";
        restartVar.setAttribute("id", "restart");

        let clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear High Scores";
        clearScoresVar.setAttribute("id", "clearScores");

        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}

function restart() {
    title.setAttribute("style", "align-self: center");
    content.setAttribute("style", "align-self: center; font-size:110%");
    document.getElementById("restart").remove();
    document.getElementById("clearScores").remove();
    title.textContent = "Coding Wizz Quiz";
    content.textContent = ""
    start.setAttribute("style", "display: visible");
    currentQues = 0;
    score = 0;
    timeLeft = 61;
    init();
}

function clearScores() {
    localStorage.clear();
    content.textContent = "";
    leaderboard = [];
}

init();