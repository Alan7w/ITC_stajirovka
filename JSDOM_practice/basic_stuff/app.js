// GET ELEMENTS BY ID
// var banner = document.getElementById('page-banner')
// console.log(banner.textContent)

// var booklist = document.getElementById('book-list')
// console.log(booklist.textContent)


// GET ELEMENTS BY CLASS OR TAG
// var titles = Array.from(document.getElementsByClassName('title'))
// var titles = document.getElementsByClassName('title')
// console.log(titles[0].innerHTML)
// console.log(titles[1].textContent)
// titles.forEach(element => {
//     console.log(element.textContent)
// });

// for (let index = 0; index < titles.length; index++) {
//     const element = titles[index];
//     console.log(element.textContent)
// }


// QUERY SELECTOR
// var wrap = document.querySelector('#wrapper')
// console.log(wrap)

// const name = document.querySelector('#book-list li:nth-child(2) .name')
// console.log(name)

// var book = document.querySelector('.name')
// book = document.querySelectorAll('.name')
// console.log(book)


// CHANGING TEXT & HTML CONTENT
// var booklist = document.querySelector('#book-list')
// booklist.innerHTML = "<h2>Books and more books ... </h2>"
// booklist.innerHTML += "<p>Paragaphs and more Paragaphs ... </p>"


// NODES
// var banner = document.querySelector('#page-banner')
// console.log(banner.nodeType)
// console.log(banner.nodeName)
// console.log(banner.hasChildNodes())
// console.log(banner.childNodes)


// TRAVERSING DOM PART1
// var booklist = document.querySelector('#book-list')
// console.log(booklist.parentElement)
// console.log(booklist.parentElement.parentElement)


// TRAVERSING DOM PART2
// var booklist = document.querySelector('#book-list')
// console.log(booklist.nextSibling)
// console.log(booklist.nextElementSibling)

// console.log(booklist.previousSibling)
// console.log(booklist.previousElementSibling)

// booklist.previousElementSibling.querySelector('p').innerHTML = "Books for niggas"


// EVENTS
// var h2 = document.querySelector('h2')
// h2.addEventListener('click', function(e) {
//     console.log(e.target)
//     console.log(e)
// })

// var btns = document.querySelectorAll('.delete')
// Array.from(btns).forEach(function(button){
//     button.addEventListener('click', function(e){
//         const li = e.target.parentElement
//         li.parentElement.removeChild(li)
//     })
// })

// var link = document.querySelector('a')
// link.addEventListener('click', function(e) {
//     e.preventDefault()
//     console.log('default behaviour blocked for: ', e.target.textContent)
// })


// EVENT BUBBLING

var list = document.querySelector('ul')
list.addEventListener('click', function (e) {
    if (e.target.className == 'delete') {
        const li = e.target.parentElement
        list.removeChild(li)
    }
    // else {
    //     console.log('Click the delete button to delete a book')
    // }
})


// INTERACTING WITH FORMS - creating elements; styles & classes
const addForm = document.querySelector('#add-book')
// const addForm = document.form['add-form']    // another way of retrieving the form
addForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const inputValue = addForm.querySelector('input[type="text"]').value
    console.log(inputValue)

    // create a new book - method 1 
    // const li = document.createElement('li')

    // li.innerHTML = `
    //     <span class="name"> ${inputValue}</span >
    //         <span class="delete">delete</span>
    //      `
    // list.appendChild(li)


    // create a new book - method 2
    const li = document.createElement('li')
    const bookName = document.createElement('span')
    const deleteButton = document.createElement('span')

    // bookName.className = 'name'
    bookName.innerHTML = inputValue
    // deleteButton.className = 'delete'
    deleteButton.innerHTML = 'delete'
    bookName.classList.add('name')
    deleteButton.classList.add('delete')

    li.appendChild(bookName)
    li.appendChild(deleteButton)
    list.appendChild(li)
})


// CHECKBOXES & CHANGE EVENTS
const hideBox = document.querySelector('#hide')
hideBox.addEventListener('change', function (e) {
    if (hideBox.checked) {
        list.style.display = 'none'
    } else {
        list.style.display = 'initial'
    }
})


// CUSTOM SEARCH FILTER
// my method
const searchbar = document.querySelector('#search-books')
var searchInput = searchbar.querySelector('input')
var keyword;
searchInput.addEventListener('keyup', function (e) {
    keyword = searchInput.value.toLowerCase()
    console.log(keyword)
    
    var books = Array.from(document.querySelectorAll('.name'))
    books.forEach(function(book){
        var bookText = book.textContent.toLowerCase()
        if (!bookText.includes(keyword)) {
            book.parentElement.setAttribute('style', 'display: none')
        } else {
            book.parentElement.setAttribute('style', 'display: list-item')
        }
    })
})