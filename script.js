const buttonsGrid = document.getElementById("buttons-grid");
const expressionInput = document.getElementById("expression");
const clearBtn = document.getElementById("clear-btn");
const historyList = document.getElementById("history-list");
const modeButtons = document.querySelectorAll(".mode-btn");
const themeToggle = document.getElementById("theme-toggle");
const app = document.querySelector(".app");

const MODES = {
  basic: [
    "(", ")", "C", "DEL",
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ],
  scientific: [
    "(", ")", "C", "DEL",
    "sin", "cos", "tan", "log",
    "ln", "√", "^", "%",
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ],
  trigonometric: [
    "(", ")", "C", "DEL",
    "sin", "cos", "tan", "π",
    "asin", "acos", "atan", "e",
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ]
};


let currentMode = "basic";
let history = [];

function renderButtons() {
  buttonsGrid.innerHTML = "";
  MODES[currentMode].forEach((btn) => {
    const button = document.createElement("button");
    button.textContent = btn;
    button.classList.add("btn");
    button.addEventListener("click", () => handleButtonClick(btn));
    buttonsGrid.appendChild(button);
  });
}

function calculateExpression(expr) {
  try {
    let e = expr
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/asin/g, "Math.asin")
      .replace(/acos/g, "Math.acos")
      .replace(/atan/g, "Math.atan")
      .replace(/log/g, "Math.log10")
      .replace(/ln/g, "Math.log")
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/√/g, "Math.sqrt")
      .replace(/\^/g, "**");

    let res = eval(e);
    if (typeof res === "number" && !isNaN(res)) {
      return +res.toFixed(6);
    }
    return "Error";
  } catch {
    return "Error";
  }
}

function handleButtonClick(value) {
  if (value === "=") {
    const expr = expressionInput.value.trim();
    if (!expr) return;
    const res = calculateExpression(expr);
    if (res !== "Error") {
      addHistory(expr, res);
      expressionInput.value = res;
    } else {
      expressionInput.value = "Error";
    }
  } else {
    expressionInput.value += value;
  }
}

function addHistory(expr, result) {
  history.unshift({ expr, result });
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No calculations yet";
    li.className = "no-history";
    historyList.appendChild(li);
    return;
  }
  history.forEach(({ expr, result }, idx) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const span = document.createElement("span");
    span.className = "expr";
    span.textContent = `${expr} = ${result}`;
    li.appendChild(span);

    const btnGroup = document.createElement("div");
    btnGroup.className = "history-buttons";

    const copyBtn = document.createElement("button");
    copyBtn.title = "Copy expression";
    copyBtn.textContent = "📋";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(expr);
      alert(`Copied: ${expr}`);
    };
    btnGroup.appendChild(copyBtn);

    const reuseBtn = document.createElement("button");
    reuseBtn.title = "Reuse expression";
    reuseBtn.textContent = "🔄";
    reuseBtn.onclick = () => {
      expressionInput.value = expr;
      expressionInput.focus();
    };
    btnGroup.appendChild(reuseBtn);

    li.appendChild(btnGroup);
    historyList.appendChild(li);
  });
}

clearBtn.addEventListener("click", () => {
  expressionInput.value = "";
});

modeButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.getAttribute("data-mode");
    expressionInput.value = "";
    renderButtons();
  })
);

themeToggle.addEventListener("click", () => {
  if (app.classList.contains("light")) {
    app.classList.remove("light");
    app.classList.add("dark");
    themeToggle.textContent = "🌙";
  } else {
    app.classList.remove("dark");
    app.classList.add("light");
    themeToggle.textContent = "☀️";
  }
});

renderButtons();
renderHistory();
