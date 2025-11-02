const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator, .btn-equals, .btn-clear, .btn-delete');

let currentInput = '';
let shouldResetDisplay = false;


numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get only the number from button (in case there's an icon)
        const number = button.textContent.trim().replace(/[^\d]/g, '');
        if (shouldResetDisplay) {
            display.value = '';
            shouldResetDisplay = false;
        }
        display.value += number;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        let buttonAction = buttonText;
        
        // Handle button text with icons
        if (buttonText.includes('=')) {
            buttonAction = '=';
        } else if (buttonText.includes('Clear')) {
            buttonAction = 'Clear';
        } else if (buttonText.includes('Delete')) {
            buttonAction = 'Delete';
        } else {
            // For operators, extract just the operator symbol
            buttonAction = buttonText.replace(/[^+\-*/]/g, '');
        }
        
        switch(buttonAction) {
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
                    if (expression.trim() === '') {
                        return;
                    }
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
                    display.value += buttonAction;
                    shouldResetDisplay = false;
                } else if (display.value && /[\+\-\*\/]$/.test(display.value)) {
                    display.value = display.value.slice(0, -1) + buttonAction;
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
        const equalsButton = Array.from(operatorButtons).find(btn => btn.textContent.includes('='));
        if (equalsButton) {
            equalsButton.click();
        }
    }
});
