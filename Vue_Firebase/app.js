const app = Vue.createApp({
    // data, functions
    // template: '<h2>I am the h2 element</h2>'
    data() {
        return {
            url: 'https://www.youtube.com/watch?v=Aq5WXmQQooo',
            showBooks: true,
            // title: 'Game of Thrones',
            // author: "George R.R. Martin",
            // age: 53,
            books: [
                { title: 'Game Of Thrones', author: "George R.R. Martin", age: 53, img: 'img/ahh_hell_nah.jpg', isFav: false},
                { title: 'House of the Dragon', author: "George R.R. Martin", age: 53, img: 'img/faaah.jpg', isFav: false},
                { title: 'Knight of the Seven Kingdom', author: "George R.R. Martin", age: 53, img: 'img/son.jpg', isFav: true}
            ],
            xPos: 0,
            yPos: 0
        }
    },

    methods: {
        // changeTitle(newTitle) {
        //     // this.title = 'House of the Dragon'
        //     this.title = newTitle
        // }

        toggleShowBooks() {
            this.showBooks = !this.showBooks
        },

        toggleIsFav(event, book) {
            book.isFav = !book.isFav
        },

        handleEvent(event, data) {
            console.log(event, event.type)
            if (data) {
                console.log(data)
            }
        },

        handleMouseMove(event) {
            this.xPos = event.offsetX
            this.yPos = event.offsetY
        }
    },

    computed: {
        filteredBooks() {
            return this.books.filter(book => book.isFav)
        }
    }
})

app.mount('#app')