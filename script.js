const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

let firstOperand = null;
let operator = null;
let waitingSecondOperand = false;

function updateDisplay(value) {
  display.value = value;
}

function inputNumber(number) {
  if (waitingSecondOperand) {
    updateDisplay(number);
    waitingSecondOperand = false;
    return;
  }

  updateDisplay(display.value === '0' ? number : display.value + number);
}

function inputDecimal() {
  if (waitingSecondOperand) {
    updateDisplay('0.');
    waitingSecondOperand = false;
    return;
  }

  if (!display.value.includes('.')) {
    updateDisplay(display.value + '.');
  }
}

function calculate(first, second, op) {
  switch (op) {
    case '+': return first + second;
    case '-': return first - second;
    case '*': return first * second;
    case '/': return second === 0 ? 'Erro' : first / second;
    default: return second;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(display.value);

  if (operator && waitingSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    updateDisplay(String(result));

    if (result === 'Erro') {
      firstOperand = null;
      operator = null;
      waitingSecondOperand = false;
      return;
    }

    firstOperand = result;
  }

  waitingSecondOperand = true;
  operator = nextOperator;
}

function backspace() {
  if (waitingSecondOperand) return;

  if (display.value.length <= 1) {
    updateDisplay('0');
  } else {
    updateDisplay(display.value.slice(0, -1));
  }
}

function resetCalculator() {
  firstOperand = null;
  operator = null;
  waitingSecondOperand = false;
  updateDisplay('0');
}

function equal() {
  if (!operator || waitingSecondOperand) return;
  handleOperator(operator);
  operator = null;
}

buttons.addEventListener('click', (event) => {
  const { action, value } = event.target.dataset;
  if (!action) return;

  switch (action) {
    case 'number':
      inputNumber(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'equal':
      equal();
      break;
    case 'clear':
      resetCalculator();
      break;
    case 'backspace':
      backspace();
      break;
    default:
      break;
  }
});
