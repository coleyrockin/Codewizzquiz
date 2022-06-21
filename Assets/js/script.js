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
