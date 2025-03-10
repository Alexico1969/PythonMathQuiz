let score = 0;
let correctAnswer = 0;
let timeLeft = 300; // 5 minutes in seconds
let timer;

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let questionType = ["modulo", "floor_div", "sqrt", "pow", "fabs"][Math.floor(Math.random() * 5)];
    
    if (questionType === "modulo") {
        correctAnswer = num1 % num2;
        document.getElementById("question").innerText = `What is ${num1} % ${num2}?`;
    } else if (questionType === "floor_div") {
        correctAnswer = Math.floor(num1 / num2);
        document.getElementById("question").innerText = `What is ${num1} // ${num2}?`;
    } else if (questionType === "sqrt") {
        correctAnswer = Math.sqrt(num1).toFixed(2);
        document.getElementById("question").innerText = `What is sqrt(${num1})?`;
    } else if (questionType === "pow") {
        correctAnswer = Math.pow(num1, num2);
        document.getElementById("question").innerText = `What is pow(${num1}, ${num2})?`;
    } else if (questionType === "fabs") {
        correctAnswer = Math.abs(num1 - num2);
        document.getElementById("question").innerText = `What is fabs(${num1} - ${num2})?`;
    }
}

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value;
    let message = document.getElementById("message");
    
    if (!isNaN(userAnswer) && userAnswer !== "") {
        userAnswer = parseFloat(userAnswer);
        if (userAnswer === parseFloat(correctAnswer)) {
            score += 10;
            message.innerText = "✅ Correct! +10 points";
        } else {
            message.innerText = `❌ Incorrect! The correct answer was ${correctAnswer}`;
        }
        document.getElementById("score").innerText = score;
        document.getElementById("answer").value = "";
        generateQuestion();
    } else {
        message.innerText = "⚠️ Please enter a valid number.";
    }
}

function startTimer() {
    timer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("message").innerText = "⏰ Time's up!";
            document.getElementById("answer").disabled = true;
            document.querySelector("button").disabled = true;
        } else {
            document.getElementById("time").innerText = timeLeft;
        }
        timeLeft -= 1;
    }, 1000);
}

function evaluateCode() {
    let code = document.getElementById("code").value;
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear previous output

    // Replace math.pow, math.sqrt, and math.fabs with custom functions
    code = code.replace(/math\.pow/g, 'pow');
    code = code.replace(/math\.sqrt/g, 'sqrt');
    code = code.replace(/math\.fabs/g, 'fabs');

    try {
        // Define a custom print function to capture output
        let script = document.createElement("script");
        script.type = "text/python";
        script.text = `
from browser import document, console

# Define custom math functions
def sqrt(x):
    return x ** 0.5

def pow(x, y):
    return x ** y

def fabs(x):
    return abs(x)

# Redirect print to update the div
def custom_print(*args):
    document['output'].html += ' '.join(map(str, args)) + '<br>'

# Replace built-in print
print = custom_print

${code}
        `;

        // Append the script to the body
        document.body.appendChild(script);

        // Run Brython
        brython();

        // Remove script tag after execution
        document.body.removeChild(script);
    } catch (error) {
        outputDiv.innerText = `Error: ${error}`;
    }
}

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    document.getElementById('user-name').innerText = `Hello, ${data.name}`;
}

window.onload = function() {
    generateQuestion();
    startTimer();
};