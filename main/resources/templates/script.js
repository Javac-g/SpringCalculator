/**
 * Futuristic Calculator
 * A modern, feature-rich calculator with scientific functions and history tracking
 */
class FuturisticCalculator {
    constructor() {
        // DOM Elements
        this.expressionEl = document.getElementById('expression');
        this.resultEl = document.getElementById('result');
        this.calculator = document.querySelector('.calculator');
        this.container = document.querySelector('.calculator-container');
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
        this.historyToggle = document.getElementById('history-toggle');
        this.clearHistoryBtn = document.getElementById('clear-history');
        
        // State
        this.currentExpression = '';
        this.lastResult = '0';
        this.isNewCalculation = true;
        this.history = [];
        this.angleMode = 'rad'; // 'rad' or 'deg'
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Load history from localStorage if available
        this.loadHistory();
        
        // Set default state
        this.updateDisplay();
        
        // Add keyboard support
        this.setupKeyboardSupport();
    }
    
    setupEventListeners() {
        // Mode toggle (Standard/Scientific)
        const modeToggle = document.getElementById('mode-switch');
        modeToggle.addEventListener('change', () => {
            document.body.classList.toggle('scientific-mode');
            // Smooth transition on mode change
            this.container.classList.add('mode-transitioning');
            setTimeout(() => {
                this.container.classList.remove('mode-transitioning');
            }, 500);
        });
        
        // Theme toggle (Dark/Light)
        const themeToggle = document.getElementById('theme-switch');
        themeToggle.addEventListener('change', () => {
            document.body.setAttribute('data-theme', 
                themeToggle.checked ? 'light' : 'dark');
        });
        
        // History toggle
        this.historyToggle.addEventListener('click', () => {
            this.toggleHistory();
        });
        
        // Clear history
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
        
        // Button clicks
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add ripple effect
                this.createRipple(e);
                
                // Add glow effect
                button.classList.add('btn-pressed');
                setTimeout(() => {
                    button.classList.remove('btn-pressed');
                }, 300);
                
                // Handle button action
                this.handleButtonClick(button);
            });
        });
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        
        // Remove existing ripples
        const ripples = button.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Calculate ripple size and position
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - radius;
        const y = e.clientY - rect.top - radius;
        
        // Set ripple styles
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handleButtonClick(button) {
        // Check what type of button was clicked
        if (button.hasAttribute('data-number')) {
            const number = button.getAttribute('data-number');
            this.appendNumber(number);
        } 
        else if (button.hasAttribute('data-operation')) {
            const operation = button.getAttribute('data-operation');
            this.appendOperation(operation);
        } 
        else if (button.hasAttribute('data-function')) {
            const func = button.getAttribute('data-function');
            this.executeFunction(func);
        } 
        else if (button.hasAttribute('data-action')) {
            const action = button.getAttribute('data-action');
            this.executeAction(action);
        }
    }
    
    appendNumber(number) {
        // If starting a new calculation, clear the expression
        if (this.isNewCalculation) {
            this.currentExpression = '';
            this.isNewCalculation = false;
        }
        
        // Handle decimal point
        if (number === '.') {
            // Get the last number in the expression
            const parts = this.currentExpression.split(/[\+\-\*\/\(\)]/);
            const lastPart = parts[parts.length - 1];
            
            // If the last part already has a decimal, don't add another
            if (lastPart.includes('.')) {
                return;
            }
            
            // If the last part is empty, add a leading zero
            if (lastPart === '') {
                this.currentExpression += '0';
            }
        }
        
        this.currentExpression += number;
        this.updateDisplay();
        this.calculatePreview();
    }
    
    appendOperation(operation) {
        // If starting a new calculation after equals, use previous result
        if (this.isNewCalculation) {
            this.currentExpression = this.lastResult;
            this.isNewCalculation = false;
        }
        
        // Check if the last character is an operator
        const lastChar = this.currentExpression.slice(-1);
        const isOperator = /[\+\-\*\/]/.test(lastChar);
        
        // Replace the last operator if needed
        if (isOperator && operation !== '(' && operation !== ')') {
            this.currentExpression = this.currentExpression.slice(0, -1) + operation;
        } else {
            this.currentExpression += operation;
        }
        
        this.updateDisplay();
    }
    
    executeFunction(func) {
        // Handle different scientific functions
        switch(func) {
            case 'sin':
                this.wrapExpression(`sin(`);
                break;
            case 'cos':
                this.wrapExpression(`cos(`);
                break;
            case 'tan':
                this.wrapExpression(`tan(`);
                break;
            case 'log':
                this.wrapExpression(`log(`);
                break;
            case 'ln':
                this.wrapExpression(`ln(`);
                break;
            case 'sqrt':
                this.wrapExpression(`sqrt(`);
                break;
            case 'pow':
                this.appendOperation('^');
                break;
            case 'factorial':
                this.appendOperation('!');
                break;
            case 'pi':
                this.appendSpecialValue(Math.PI);
                break;
            case 'e':
                this.appendSpecialValue(Math.E);
                break;
            case 'rad':
                this.angleMode = 'rad';
                break;
            case 'deg':
                this.angleMode = 'deg';
                break;
            case 'rand':
                this.appendSpecialValue(Math.random());
                break;
        }
        
        this.updateDisplay();
        this.calculatePreview();
    }
    
    wrapExpression(funcName) {
        if (this.isNewCalculation) {
            this.currentExpression = funcName;
        } else {
            this.currentExpression += funcName;
        }
        this.isNewCalculation = false;
    }
    
    appendSpecialValue(value) {
        if (this.isNewCalculation) {
            this.currentExpression = value.toString();
        } else {
            this.currentExpression += value.toString();
        }
        this.isNewCalculation = false;
    }
    
    executeAction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'calculate':
                this.calculate();
                break;
        }
    }
    
    clear() {
        this.currentExpression = '';
        this.resultEl.textContent = '0';
        this.updateDisplay();
    }
    
    delete() {
        if (this.isNewCalculation) {
            this.clear();
            return;
        }
        
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
        this.calculatePreview();
    }
    
    calculate() {
        try {
            // Add animation
            this.resultEl.classList.add('calculating');
            
            // Create a copy of the expression for display
            const expressionToShow = this.processExpressionForDisplay(this.currentExpression);
            
            // Process the expression for calculation
            const expressionToCalculate = this.processExpressionForCalculation(this.currentExpression);
            
            // Calculate the result
            const result = this.evaluateExpression(expressionToCalculate);
            
            // Format the result
            const formattedResult = this.formatResult(result);
            
            // Update the display
            this.resultEl.textContent = formattedResult;
            this.lastResult = formattedResult;
            
            // Add to history
            this.addToHistory(expressionToShow, formattedResult);
            
            // Reset for new calculation
            this.isNewCalculation = true;
            
            // Remove animation after calculation
            setTimeout(() => {
                this.resultEl.classList.remove('calculating');
            }, 500);
            
        } catch (error) {
            this.resultEl.textContent = 'Error';
            console.error('Calculation error:', error);
        }
    }
    
    calculatePreview() {
        // Skip preview calculation if expression is empty
        if (!this.currentExpression) {
            this.resultEl.textContent = '0';
            return;
        }
        
        try {
            // Process the expression for calculation
            const expressionToCalculate = this.processExpressionForCalculation(this.currentExpression);
            
            // Calculate the result
            const result = this.evaluateExpression(expressionToCalculate);
            
            // Format the result
            const formattedResult = this.formatResult(result);
            
            // Update the result display
            this.resultEl.textContent = formattedResult;
            
        } catch (error) {
            // Don't show error for preview, just keep the last valid result
        }
    }
    
    processExpressionForDisplay(expr) {
        // Replace operators with their display symbols
        return expr
            .replace(/\*/g, '×')
            .replace(/\//g, '÷');
    }
    
    processExpressionForCalculation(expr) {
        // Replace scientific functions and operators with JavaScript-compatible versions
        let processed = expr
            .replace(/sin\(/g, `Math.sin(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`)
            .replace(/cos\(/g, `Math.cos(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`)
            .replace(/tan\(/g, `Math.tan(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`)
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        // Handle factorial
        while (processed.includes('!')) {
            const factIdx = processed.indexOf('!');
            
            // Find the number before the factorial
            let numStart = factIdx - 1;
            let brackets = 0;
            
            while (numStart >= 0) {
                const char = processed[numStart];
                
                if (char === ')') brackets++;
                if (char === '(') brackets--;
                
                if ((brackets === 0 && /[\+\-\*\/\(]/.test(char)) || numStart === 0) {
                    if (numStart === 0 && !/[\+\-\*\/\(]/.test(char)) {
                        // If we reached the start and it's not an operator, include it
                    } else {
                        numStart++; // Move past the operator
                    }
                    break;
                }
                
                numStart--;
            }
            
            const numToFactorial = processed.substring(numStart, factIdx);
            const replacement = `this.factorial(${numToFactorial})`;
            
            processed = processed.substring(0, numStart) + replacement + processed.substring(factIdx + 1);
        }
        
        return processed;
    }
    
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        if (n < 0) return NaN;
        if (!Number.isInteger(n)) return this.gamma(n + 1);
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    // Gamma function for non-integer factorials
    gamma(z) {
        // Simplified gamma function approximation
        const g = 7;
        const p = [
            0.99999999999980993,
            676.5203681218851,
            -1259.1392167224028,
            771.32342877765313,
            -176.61502916214059,
            12.507343278686905,
            -0.13857109526572012,
            9.9843695780195716e-6,
            1.5056327351493116e-7
        ];
        
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
        
        z -= 1;
        let x = p[0];
        for (let i = 1; i < g + 2; i++) {
            x += p[i] / (z + i);
        }
        
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
    }
    
    evaluateExpression(expr) {
        // Use Function constructor for evaluation (safer than eval)
        try {
            // Create a function that includes all our utility methods
            const calcFunc = new Function('return ' + expr);
            
            // Call the function in the context of this calculator
            return calcFunc.call(this);
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }
    
    formatResult(result) {
        // Handle special cases
        if (typeof result !== 'number' || isNaN(result)) {
            return 'Error';
        }
        
        if (!isFinite(result)) {
            return result > 0 ? 'Infinity' : '-Infinity';
        }
        
        // Format the number
        if (Math.abs(result) < 1e-10) {
            return '0';
        }
        
        if (Math.abs(result) >= 1e10 || Math.abs(result) <= 1e-5) {
            // Scientific notation for very large or small numbers
            return result.toExponential(6);
        }
        
        // Regular formatting with up to 8 decimal places
        return result.toString().includes('.') 
            ? parseFloat(result.toFixed(8)).toString() 
            : result.toString();
    }
    
    updateDisplay() {
        // Update the expression display
        this.expressionEl.textContent = this.currentExpression || '0';
        
        // Scroll expression to end if it overflows
        setTimeout(() => {
            const expressionWidth = this.expressionEl.scrollWidth;
            const containerWidth = this.expressionEl.clientWidth;
            
            if (expressionWidth > containerWidth) {
                this.expressionEl.style.transform = `translateX(${containerWidth - expressionWidth}px)`;
            } else {
                this.expressionEl.style.transform = 'translateX(0)';
            }
        }, 0);
    }
    
    addToHistory(expression, result) {
        // Create history item
        const historyItem = {
            expression,
            result,
            timestamp: Date.now()
        };
        
        // Add to history array
        this.history.push(historyItem);
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
        }
        
        // Update history display
        this.updateHistoryDisplay();
        
        // Save to localStorage
        this.saveHistory();
    }
    
    updateHistoryDisplay() {
        // Clear current history display
        this.historyList.innerHTML = '';
        
        // Create and add history items in reverse order (newest first)
        [...this.history].reverse().forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            const expressionEl = document.createElement('div');
            expressionEl.classList.add('history-expression');
            expressionEl.textContent = item.expression;
            
            const resultEl = document.createElement('div');
            resultEl.classList.add('history-result');
            resultEl.textContent = item.result;
            
            historyItem.appendChild(expressionEl);
            historyItem.appendChild(resultEl);
            
            // Add click event to reuse this calculation
            historyItem.addEventListener('click', () => {
                this.currentExpression = item.expression;
                this.lastResult = item.result;
                this.resultEl.textContent = item.result;
                this.updateDisplay();
                this.isNewCalculation = true;
                this.toggleHistory();
            });
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    toggleHistory() {
        document.body.classList.toggle('history-active');
    }
    
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        localStorage.removeItem('calculator_history');
    }
    
    saveHistory() {
        localStorage.setItem('calculator_history', JSON.stringify(this.history));
    }
    
    loadHistory() {
        const savedHistory = localStorage.getItem('calculator_history');
        if (savedHistory) {
            try {
                this.history = JSON.parse(savedHistory);
                this.updateHistoryDisplay();
            } catch (error) {
                console.error('Error loading history:', error);
                this.history = [];
            }
        }
    }
    
    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for calculator keys
            if (/[\d\+\-\*\/\.\(\)=]/.test(e.key) || 
                e.key === 'Enter' || 
                e.key === 'Backspace' || 
                e.key === 'Escape') {
                e.preventDefault();
            }
            
            // Map keyboard keys to calculator buttons
            let buttonSelector;
            
            switch(e.key) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    buttonSelector = `.calc-btn[data-number="${e.key}"]`;
                    break;
                case '.':
                    buttonSelector = `.calc-btn[data-number="."]`;
                    break;
                case '+':
                    buttonSelector = `.calc-btn[data-operation="+"]`;
                    break;
                case '-':
                    buttonSelector = `.calc-btn[data-operation="-"]`;
                    break;
                case '*':
                case 'x':
                case '×':
                    buttonSelector = `.calc-btn[data-operation="*"]`;
                    break;
                case '/':
                case '÷':
                    buttonSelector = `.calc-btn[data-operation="/"]`;
                    break;
                case '(':
                    buttonSelector = `.calc-btn[data-operation="("]`;
                    break;
                case ')':
                    buttonSelector = `.calc-btn[data-operation=")"]`;
                    break;
                case '%':
                    buttonSelector = `.calc-btn[data-operation="%"]`;
                    break;
                case 'Enter':
                case '=':
                    buttonSelector = `.calc-btn[data-action="calculate"]`;
                    break;
                case 'Backspace':
                    buttonSelector = `.calc-btn[data-action="delete"]`;
                    break;
                case 'Escape':
                case 'c':
                case 'C':
                    buttonSelector = `.calc-btn[data-action="clear"]`;
                    break;
            }
            
            // Find and trigger button click
            if (buttonSelector) {
                const button = document.querySelector(buttonSelector);
                if (button) {
                    // Simulate click with ripple effect
                    button.classList.add('btn-pressed');
                    setTimeout(() => {
                        button.classList.remove('btn-pressed');
                    }, 300);
                    
                    this.handleButtonClick(button);
                }
            }
        });
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FuturisticCalculator();
});