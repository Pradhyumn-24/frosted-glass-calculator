const clickSound = new Audio('media/click.mp3');
const screen = document.querySelector('.screen');
const buttons = document.querySelectorAll('.calc-button');
// This code connects the constants screen and buttons to the first element in .screen and all elements in .calc-button
// Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=102918">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=102918">Pixabay</a>


let input = '';
// This variable stores the current input string like "8+5*2"; it will update as we click buttons


function updateScreen() {
    screen.textContent = input || '0';
}
// text content is a property that sets the text inside the element. Eg: "screen.textContent = '123';" would make our html tag: <section class="screen">123</section>
// The (||) operator is used when first value may turn out null, undefined or '', then the second value (in our case 0) will be displayed as a fallback.

function getButtonValue(btn) {
    switch (btn) {
        case '×': return '*';
        case '÷': return '/';
        case '−': return '-';    // use the correct Unicode minus
        case '+': return '+';
        case '=': return '=';
        case '←': return 'backspace';
        case 'C': return 'clear';
        case '( )': return '( )';    // forgot to map this
        default: return btn;
    }
}
// This function will translate button text (like ×, ÷, etc.) into JavaScript-friendly symbols (like *, /), so it can calculate it better.
// a switch is a way to tell the computer to choose between different actions, depending on the value of something — like a variable. Think of it like a menu: if you choose "1", you get pizza; if you choose "2", you get a burger; if you choose something else, it tells you that item isn’t on the menu. The switch statement checks the value, and then goes through each case to see if it matches. If it finds a match, it runs the code for that case. After that, we usually write break so the computer stops looking at the other options. If nothing matches, the default part runs instead. It’s similar to using a bunch of if...else if...else statements, but it can be easier to read when you have many choices to check.

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const btnText = button.textContent.trim();
        const value = getButtonValue(btnText);

        switch (value) {
            case 'clear':
                input = '';
                break;

            case 'backspace':
                if (['Error','Indeterminate value!','Undefined!','Infinity'].includes(input)) {    // This will clear the whole word instead of one letter (like erro, err, etc.)
                    input = '';
                }
                input = input.slice(0, -1);
                break;

            case '=':
                try {
                    if (/^[0-9+\-*/%.() ]+$/.test(input)) {
                        if (/\/0(?!\d)/.test(input)) {
                            input = 'Undefined!';
                        }
                        else if (isNaN(eval(input))) {
                            input = 'Indeterminate value!';
                        }
                        else {
                            input = eval(input).toString();
                        }
                    }
                    else {
                            input = 'Error';
                        }
                }
                catch {
                    input = 'Error';
                }
                break;

            case '( )':
                const openCount = (input.match(/\(/g) || []).length;
                const closeCount = (input.match(/\)/g) || []).length;
                const nextChar = openCount > closeCount ? ')' : '(';
                
                if (nextChar === '(' && (/\d$/.test(input) || input.endsWith(')'))) {
                    input += '*(';
                }
                else {
                    input += nextChar;
                }
                break;

            default:
                if (['Error','Indeterminate value!','Undefined!','Infinity'].includes(input)) {    
                    input = '';
                    // This will clear these messages in case of new input by using array
                    // could have also used the input === 'Error' || input === 'Indeterminate value!' || etc.
                }
                if (/\d/.test(value) && input.endsWith(')')) {
                    input += '*' + value;    
                    // we use concatenation here coz value is a variable not a string
                    // or "input += `*${value}`;" which is a temperate literal, more about this in comments below
                }
                else {
                    input += value;
                }
        }

        clickSound.currentTime = 0;
        clickSound.play();
        clickSound.volume = 0.1;    // We can set the vol from 0.0 (silent) to 1.0 (loudest)

        updateScreen();
        
    });
});

updateScreen();

// => is just a shorthand for function.
// For each button, we attach a click event listener. That means: “when this button is clicked, run the function inside.”
// "() =>" is an function with no parameters
// .trim() removes extra spaces
// slice(start, end) extracts part of a string from the start index up to but not including the end index. If end is negative, it counts backward from the end of the string (-1 = last character, -2 = second last, etc.), but since the end is always exclusive, that character itself is not included. For example, "Hello".slice(0, 3) gives "Hel" because it takes indices 0,1,2 and stops before 3, and "Hello".slice(0, -1) gives "Hell" because -1 means “one from the end” (index 4 = "o"), but since the end is exclusive, the "o" is excluded. Similarly, "1234".slice(0, -2) results in "12" because it stops before the last two characters, removing "34". Thus, input.slice(0, -1) in your calculator always means “take everything from the start but drop the last character.”
// try { ... } catch { ... } → This is error handling: Code inside try runs normally. If something goes wrong (error), the catch block runs instead (showing "Error").
// The regular expression or regex /^[0-9+\-*/%.() ]+$/ is a rule that ensures the calculator input contains only valid math characters. The ^ at the start means “beginning of the string” and the $ at the end means “end of the string,” so the entire input must follow the rule, not just part of it. The square brackets [ ... ] define the allowed characters: 0-9 means any digit, + is plus, \- is minus (escaped with \ so it isn’t confused with a range), * is multiply, / is divide, % is modulo, . is decimal point, ( and ) are parentheses, and a space " " is also allowed. The + after the brackets means “one or more of these characters,” so the input must contain at least one allowed character. Together, this ensures the input string is made only of numbers, operators, parentheses, decimals, or spaces. For example, "123+45*2", "3.14*(2+5)", and "5 / 2" all pass because they use only valid characters, but "12a34" fails since a is not allowed, and "alert('hi')" fails since letters and quotes aren’t in the set. This validation step protects the calculator by blocking unsafe or invalid inputs before eval() runs.
// .test(input) will check if the input string matches the regex conditions or not and will return true or false depending on the outcome.
// "if (/\/0(?!\d)/.test(input)) {input = 'Undefined!';}" ensures that if a no. is divided by zero or followed by "/0" then Undefined! would be displayed instead of Infinity. We put this code block in '=' case instead of default coz javascript answer to the input would already be Infinity. So we change it after the evaluation in the '=' case. Our regex "/\/0(?!\d)/" means \/0 → /0, (?!\d) → negative lookahead which can be understood through an example: (?!x) makes sure what follows is not x and will return true/false depending on the outcome.
// eval(input) → takes the string and runs it as JavaScript code while ".toString()" converts the result into a string so it can be displayed on the screen.
// what const openCount & const closeCount does is they return the value of matches of '(' & ')' in the input string.
// The .match() method in JavaScript finds all matches of a regex inside a string. If matches are found → it returns them as an array. If no matches are found → it returns null.
// In regex, parentheses () are special symbols (used for grouping). To search for an actual parenthesis character, you must escape it with a backslash \. So "/\(/" match the character "(" & "/\)/" match the character ")".
// g = “global flag”. Without g, regex would only find the first match. With g, it finds all matches in the string.
// Why "|| []" is required? Because if no matches of regex are found then .match() will return null. But calling .length on null would throw an error. That's why we will use our fallback system. If .match() returns null, || [] replaces it with an empty array [], and .length becomes 0. 
// Hence .match() will find all matches of regex and .length will safely count them with the help from "|| []".
// BTW .length finds how many items are in an array or a string.
// .includes checks whether something exists inside an array or a string.
// input += x is basically shorthand for input = input + x
// openCount > closeCount ? ')' : '('; is a ternary or conditional operator in JavaScript in the format of "condition ? conditionIfTrue : conditionIfFalse;". So if openCount > closeCount then it will return value as ')', or if openCount < closeCount then it will return value as '('.
// The === operator first checks if the data types of the two operands are the same. If the data types are identical, it then checks if their values are equal. It returns true only if both the type and the value are the same; otherwise, it returns false like 5 == 5 : true or like 5 == "5" : false. While == operator will return true even if the type of data are not same but the value is same like 5 == "5" : true, this is because it will try convert both of the data types to a common data type before comparing.
// The && logical operator (ie. conditionOne && conditionTwo;) will return true only if "both" conditions are satisfied.
// "/\d$/" is a regex where \d matches a digit (0-9) while $ matches the end of the string. There is no ^ because we don’t care about the start of the string. ^ anchors to the start, $ anchors to the end. Here, we only want to check the last character, so $ is enough. If you added ^ it would mean “the whole string is a digit, not just the last char” → which is not what we want. ".test(input)" returns true if the last character of input is a digit.
// input.endsWith(')') checks if the last character is a closing parenthesis. ".endsWith()" is easier than regex here; it’s just true/false. || gives us flexibility to check if last character is digit or closing parenthesis ')'.
// Temperate literals allow us to directly embed the variable into the string using backticks and ${}. Example: "input += `*${value}`;" where value is a variable and * is a string, this is like f string in python. Also in "input += '*' + value;", if value were a string instead of a variable THEN we could have used "input += '*value';".~
// To add audio feedback for our calculator buttons, we need to create a new Audio object using const clickSound = new Audio('click.mp3'); here, new constructs a fresh Audio instance that we can control with properties and methods like .play(), .pause(), .currentTime, and .volume. Inside our button click listener, we call clickSound.currentTime = 0; clickSound.play(); where setting .currentTime = 0 rewinds the audio to the start so rapid consecutive clicks play the sound from the beginning without overlapping or cutting off, and .play() actually plays the sound.
// updateScreen() is called at the end of the file to initialize the calculator’s display when the page first loads, making sure it shows 0 based on the JavaScript variable input. Then, inside the button event listener, it’s called again after each button press so the display always reflects the latest input. Without the first call, the screen might just show whatever is in the HTML and not sync with the code. Without the second call, the screen wouldn’t update as you type or calculate.