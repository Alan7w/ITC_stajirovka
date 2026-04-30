let controlNames = ["Include Uppercase", "Include Lowercase", "Include Numbers", "Include Symbols"]

function main() {
    // first add the control divs
    var controlsDiv = document.querySelector('.settings-div')
    for (let i = 0; i < controlNames.length; i++) {
        var control = document.createElement('div')
        control.classList.add('control-div')

        // add control name
        var controlName = document.createElement('p')
        controlName.textContent = controlNames[i]
        controlName.classList.add('control-name')
        control.appendChild(controlName)

        // add toggle button
        var toggleBtn = document.createElement('label')
        toggleBtn.classList.add('toggle-btn')
        var assignedControlName = controlNames[i].split(' ')[1].toLowerCase()
        // console.log(assignedControlName)
        toggleBtn.className += ' ' + assignedControlName
        toggleBtn.innerHTML = `<input type="checkbox" id="btnToggle" name="btnToggle" />
                                 <span class="slider"></span>`
        control.appendChild(toggleBtn)
        console.log(toggleBtn.classList)

        controlsDiv.appendChild(control)
    }

    // second add listener for range input
    var lengthRangeInput = document.querySelector('.range-slider')
    var currentLength = document.querySelector('.current-length')
    lengthRangeInput.addEventListener('input', function (e) {
        currentLength.innerHTML = lengthRangeInput.value
    })
}

function generatePassword() {
    // know which controls are checked
    let checklist = createChecklist()
    console.log(checklist)

    // know the count
    var letterCount = Number(document.querySelector('.current-length').textContent)
    console.log(letterCount)

    // create a set to chose chars from
    var availableSet = createCharSet()
    console.log("availableSet: ", availableSet)

    if (!availableSet.length) {
        document.querySelector('.password-field').textContent = 'Select at least one option'
        return
    }

    // generate Password
    var password = getRandomChars(availableSet, letterCount)
    console.log('password: ', password)
    document.querySelector('.password-field').textContent = password

    function createCharSet() {
        var lowercase = 'abcdefghijklmnopqrstuvwxyz'
        var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var digits = '0123456789'
        var symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

        var charSet = ''
        console.log(checklist["lowercase"])
        if (checklist["lowercase"] == 1) {
            charSet += lowercase
        }
        if (checklist["uppercase"] == 1) {
            charSet += uppercase
        }
        if (checklist["numbers"] == 1) {
            charSet += digits
        }
        if (checklist["symbols"] == 1) {
            charSet += symbols
        }
        return charSet
    }

    function getRandomChars(string, count) {
        console.log('the string: ', string)
        var randomChars = ''
        for (let i = 0; i < count; i++) {
            randomChars += string[Math.floor(Math.random() * string.length)]
        }
        return randomChars
    }

    function createChecklist() {
        let checklist = { 'uppercase': 0, 'lowercase': 0, 'numbers': 0, 'symbols': 0 }
        var toggleButtons = document.querySelectorAll('.toggle-btn')
        for (let i = 0; i < toggleButtons.length; i++) {
            if (toggleButtons[i].querySelector('#btnToggle').checked) {
                var checkedItem = toggleButtons[i].classList[1]
                checklist[checkedItem] = 1
            }
        }
        return checklist
    }
}

// const passwordCombinations = [{
//     label: "Include Uppercase",
//     key: "uppercase",
//     values: 'ABCDEF',
//     isSwitched: false
// }, {
//     label: "Include Emoji",
//     key: "emoji",
//     values: '😄🥳😎',
//     isSwitched: false,
//     isShow: true
// }]