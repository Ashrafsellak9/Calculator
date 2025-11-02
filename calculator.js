const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.buttons button');
const operatorButtons = document.querySelectorAll('.operators button');

let currentInput = '';
let shouldResetDisplay = false;


numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (shouldResetDisplay) {
            display.value = '';
            shouldResetDisplay = false;
        }
        display.value += button.textContent;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        
        switch(buttonText) {
            case 'Clear':
                display.value = '';
                currentInput = '';
                break;
                
            case 'Delete':
                display.value = display.value.slice(0, -1);
                break;
                
            case '=':
                try {
                    let expression = display.value.replace(/×/g, '*');
                    const result = Function('"use strict"; return (' + expression + ')')();
                    display.value = result.toString();
                    shouldResetDisplay = true;
                } catch (error) {
                    display.value = 'Error';
                    shouldResetDisplay = true;
                }
                break;
                
            default: 
                if (display.value && !/[\+\-\*\/]$/.test(display.value)) {
                    display.value += buttonText;
                    shouldResetDisplay = false;
                } else if (display.value && /[\+\-\*\/]$/.test(display.value)) {
                 
                    display.value = display.value.slice(0, -1) + buttonText;
                }
                break;
        }
    });
});


display.addEventListener('keydown', (e) => {
    if (!/[0-9+\-*/.=]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        e.preventDefault();
    }
});

display.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const equalsButton = Array.from(operatorButtons).find(btn => btn.textContent === '=');
        if (equalsButton) {
            equalsButton.click();
        }
    }
});
