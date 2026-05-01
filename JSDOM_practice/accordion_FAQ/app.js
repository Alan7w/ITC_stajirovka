const faqs = [
    {
        'question': 'What is sim racing?',
        'answer': 'Sim racing uses real world physics to give an authentic experience. It’s used by professional F1 drivers to prepare for races. Unlike a video game, sim racing translates to real-world racing experience. Our sims have advanced motion technology. While this provides for the most immersive experience, it can cause motion sickness for some.'
    },

    {
        'question': 'Where is SUPERLAP located?',
        'answer': 'We\'re located on the west side of Woodward, at 27723 Woodward Avenue, Berkley, MI 48072. Right between Vinsetta Garage and Westborn Market.'
    },

    {
        'question': 'Where can I park?',
        'answer': 'Parking is available in front of, and directly behind our building designated with SUPERLAP signage only. Street parking is also available. Please do not park in any lot with a Vinsetta Garage sign as you may be towed.'
    },

    {
        'question': 'What equipment do you use?',
        'answer': 'We have partnered with PODIUM 1 RACING to provide the latest equipment. Chassis: Trak Racer TR120  |  Wheelbase: Asetek Forte  |  Steering Wheel: Asetek Forte  |  Pedals: Heusinkveld Ultimate (2 Pedal)  |  Monitors: Triple 32" AOC 1440p Curved  |  Custom PC (4070ti)  |  Sound: Headset  |  Motion: 4-corner D-Box'
    },

    {
        'question': 'What else is available at SUPERLAP?',
        'answer': 'SUPERLAP also has a coffee bar with prepackaged snacks & beverages. We’ve also got some fun merch available in limited runs.'
    }
]

var wrapper = document.querySelector('.wrapper')

function main() {
    faqs.forEach(function (faq) {
        var question = document.createElement('div')
        question.classList.add('question')
        question.classList.add('closed')
        question.textContent = faq.question
        var dropdownIcon = document.createElement('span')
        dropdownIcon.textContent = '+'
        dropdownIcon.classList.add('dropdown-icon')
        question.appendChild(dropdownIcon)

        var answer = document.createElement('div')
        answer.classList.add('answer')
        answer.textContent = faq.answer

        var faqDiv = document.createElement('div')
        faqDiv.classList.add('faq-div')
        faqDiv.appendChild(question)
        faqDiv.appendChild(answer)

        wrapper.appendChild(faqDiv)
    })
}

wrapper.addEventListener('click', function (e) {
    var isQuestion = e.target.classList[0] == 'question'
    var isClosed = e.target.classList[1] == 'closed'
    if (isQuestion) {
        var answer = e.target.parentElement.querySelector('.answer')
        var dropdownIcon = e.target.querySelector('.dropdown-icon')
        if (isClosed) {
            e.target.classList.replace('closed', 'open')
            answer.style.display = 'block'
            dropdownIcon.textContent = '-'
            console.log('opened')
        } else {
            e.target.classList.replace('open', 'closed')
            answer.style.display = 'none'
            dropdownIcon.textContent = '+'
            console.log('closed')
        }
    }
})