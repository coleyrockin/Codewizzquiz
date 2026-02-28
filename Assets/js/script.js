// ── DOM references ──────────────────────────────────────────────────
const scoresLink    = document.querySelector("#scores");
const timerEl       = document.querySelector("#timer");
const progressFill  = document.querySelector("#progress-fill");
const container     = document.querySelector("#container");
const titleEl       = document.querySelector("#title");
const contentEl     = document.querySelector("#content");
const startBtn      = document.querySelector("#start");
const answerEl      = document.querySelector("#answer");

// ── Question data ───────────────────────────────────────────────────
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options  = options;
        this.answer   = answer;
    }
}

const questionList = [
    new Question(
        "What data structure stores items at contiguous memory locations?",
        ["1. Array", "2. Hash map", "3. Linked list", "4. Stack"],
        "1. Array"
    ),
    new Question(
        "What does DOM stand for?",
        ["1. Data Object Model", "2. Document Object Model", "3. Dynamic Object Map", "4. Document Oriented Markup"],
        "2. Document Object Model"
    ),
    new Question(
        "What does CSS stand for?",
        ["1. Computer Style Script", "2. Creative Style Syntax", "3. Cascading Style Sheets", "4. Coded Style System"],
        "3. Cascading Style Sheets"
    ),
    new Question(
        "Which company originally developed Bootstrap?",
        ["1. Google", "2. Facebook", "3. Microsoft", "4. Twitter"],
        "4. Twitter"
    ),
    new Question(
        "What does API stand for?",
        ["1. Application Programming Interface", "2. Automated Process Integration", "3. Array Pointer Index", "4. Applied Protocol Input"],
        "1. Application Programming Interface"
    ),
    new Question(
        "Which keyword declares a block-scoped variable in modern JavaScript?",
        ["1. var", "2. let", "3. def", "4. dim"],
        "2. let"
    ),
    new Question(
        "What does the 'git commit' command do?",
        ["1. Uploads files to GitHub", "2. Creates a new branch", "3. Saves a snapshot of staged changes", "4. Merges two branches"],
        "3. Saves a snapshot of staged changes"
    ),
];

// ── Quiz state ──────────────────────────────────────────────────────
let optionButtons   = [];
let currentQues     = 0;
let score           = 0;
let timeLeft        = 60;
let isQuizOngoing   = false;
let leaderboard     = [];
let clockInterval   = null;
let answerTimeout   = null;

// ── Init ────────────────────────────────────────────────────────────
startBtn.addEventListener("click", startQuiz);
scoresLink.addEventListener("click", handleScoresClick);

// ── Start quiz ──────────────────────────────────────────────────────
function startQuiz() {
    isQuizOngoing = true;
    startBtn.classList.add("hidden");
    contentEl.classList.remove("score-display");
    contentEl.textContent = "";
    runTimer();
    createOptionButtons();
    showNextQuestion();
}

// ── Timer ───────────────────────────────────────────────────────────
function runTimer() {
    clockInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;

        timerEl.classList.toggle("warning", timeLeft <= 15 && timeLeft > 5);
        timerEl.classList.toggle("danger",  timeLeft <= 5);

        if (timeLeft <= 0) {
            clearInterval(clockInterval);
            if (titleEl.textContent !== "All Done!") {
                endQuiz();
            }
        }
    }, 1000);
}

// ── Create answer buttons ───────────────────────────────────────────
function createOptionButtons() {
    const count = questionList[0].options.length;
    for (let i = 0; i < count; i++) {
        const btn = document.createElement("button");
        btn.setAttribute("id", `button${i + 1}`);
        container.appendChild(btn);
        optionButtons.push(btn);
        btn.addEventListener("click", handleAnswer);
    }
}

// ── Show the current question ───────────────────────────────────────
function showNextQuestion() {
    if (currentQues >= questionList.length) {
        endQuiz();
        return;
    }
    const q = questionList[currentQues];
    titleEl.textContent = q.question;
    for (let i = 0; i < q.options.length; i++) {
        optionButtons[i].textContent = q.options[i];
    }
    updateProgressBar();
    currentQues++;
}

// ── Handle an answer click ──────────────────────────────────────────
function handleAnswer(event) {
    const chosen  = event.currentTarget.textContent;
    const correct = questionList[currentQues - 1].answer;

    if (chosen === correct) {
        score += 10;
        showFeedback("Correct!", "correct");
    } else {
        timeLeft = Math.max(1, timeLeft - 10);
        timerEl.textContent = `Time: ${timeLeft}s`;
        showFeedback("Incorrect!", "incorrect");
    }
    showNextQuestion();
}

// ── Feedback banner ─────────────────────────────────────────────────
function showFeedback(message, type) {
    if (answerTimeout) clearTimeout(answerTimeout);
    answerEl.textContent = message;
    answerEl.className   = type;
    answerTimeout = setTimeout(() => {
        answerEl.textContent = "";
        answerEl.className   = "";
    }, 2500);
}

// ── Progress bar ────────────────────────────────────────────────────
function updateProgressBar() {
    const pct = (currentQues / questionList.length) * 100;
    progressFill.style.width = `${pct}%`;
}

// ── End of quiz ─────────────────────────────────────────────────────
function endQuiz() {
    clearInterval(clockInterval);
    timeLeft = 0;
    timerEl.textContent = "Time: 0s";
    timerEl.classList.remove("warning", "danger");

    clearOptionButtons();
    titleEl.textContent   = "All Done!";
    contentEl.textContent = `Your final score is ${score} / ${questionList.length * 10}`;
    contentEl.classList.add("score-display");
    progressFill.style.width = "100%";

    buildInitialsForm();
}

function clearOptionButtons() {
    optionButtons.forEach(btn => btn.remove());
    optionButtons = [];
}

// ── Initials form ───────────────────────────────────────────────────
function buildInitialsForm() {
    const form  = document.createElement("form");
    form.setAttribute("id", "form");

    const label = document.createElement("label");
    label.setAttribute("for", "initials");
    label.textContent = "Enter your initials:";
    form.appendChild(label);

    const input = document.createElement("input");
    input.setAttribute("id", "initials");
    input.setAttribute("maxlength", "3");
    input.setAttribute("placeholder", "e.g. ABC");
    input.setAttribute("autocomplete", "off");
    form.appendChild(input);

    const submit = document.createElement("button");
    submit.setAttribute("id", "submit");
    submit.setAttribute("type", "button");
    submit.textContent = "Submit Score";
    form.appendChild(submit);

    container.appendChild(form);

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); submitScore(); }
    });
    submit.addEventListener("click", submitScore);
}

// ── Submit score ────────────────────────────────────────────────────
function submitScore() {
    const input = document.getElementById("initials");
    const value = input.value.trim();

    if (value.length === 0 || value.length > 3) {
        showFeedback("Initials must be 1–3 characters", "neutral");
        return;
    }

    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(value);
}

// ── Local storage ───────────────────────────────────────────────────
function saveScore(initials) {
    const stored = localStorage.getItem("leaderboard");
    if (stored) leaderboard = JSON.parse(stored);
    leaderboard.push({ score, initials });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();
}

// ── Scores screen ───────────────────────────────────────────────────
function handleScoresClick() {
    if (isQuizOngoing && titleEl.textContent !== "All Done!") {
        showFeedback("Cannot view scores until the quiz is over", "neutral");
        return;
    }
    if (titleEl.textContent === "All Done!") {
        showFeedback("Please enter your initials first", "neutral");
        return;
    }
    showScores();
}

function showScores() {
    titleEl.textContent = "High Scores";
    startBtn.classList.add("hidden");
    renderLeaderboard();
    buildEndButtons();
}

function renderLeaderboard() {
    const stored = localStorage.getItem("leaderboard");
    leaderboard  = stored ? JSON.parse(stored) : [];

    // Sort numerically, highest first (top 10)
    leaderboard.sort((a, b) => b.score - a.score);
    const top = leaderboard.slice(0, 10);

    contentEl.classList.add("score-display");
    if (top.length === 0) {
        contentEl.textContent = "No scores yet.";
    } else {
        contentEl.textContent = top
            .map((entry, i) => `${i + 1}. ${entry.initials.toUpperCase()}  —  ${entry.score}`)
            .join("\n");
    }
}

// ── End buttons ─────────────────────────────────────────────────────
function buildEndButtons() {
    if (document.getElementById("restart")) return;

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Play Again";
    restartBtn.setAttribute("id", "restart");
    container.appendChild(restartBtn);

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear High Scores";
    clearBtn.setAttribute("id", "clearScores");
    container.appendChild(clearBtn);

    restartBtn.addEventListener("click", resetQuiz);
    clearBtn.addEventListener("click", clearScores);
}

// ── Reset / restart ─────────────────────────────────────────────────
function resetQuiz() {
    // Remove end buttons if present
    document.getElementById("restart")?.remove();
    document.getElementById("clearScores")?.remove();

    // Reset state
    currentQues   = 0;
    score         = 0;
    timeLeft      = 60;
    isQuizOngoing = false;
    leaderboard   = [];
    optionButtons = [];

    // Reset UI
    titleEl.textContent = "Code Wizz Quiz";
    titleEl.removeAttribute("style");
    contentEl.textContent = "You have limited time to answer these coding questions. Answer incorrectly and time is deducted from the clock. Good luck!";
    contentEl.classList.remove("score-display");
    contentEl.removeAttribute("style");
    timerEl.textContent = "Time: 60s";
    timerEl.classList.remove("warning", "danger");
    progressFill.style.width = "0%";
    answerEl.textContent = "";
    answerEl.className   = "";
    startBtn.classList.remove("hidden");
}

// ── Clear scores ────────────────────────────────────────────────────
function clearScores() {
    localStorage.clear();
    leaderboard = [];
    renderLeaderboard();
}
