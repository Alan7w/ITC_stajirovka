let usersData
let paginationState = {
    perPage: 5,
    currentPage: 1,
    totalPages: 2
}
let backBtn = document.querySelector('.back-btn')
let forwardBtn = document.querySelector('.forward-btn')
let pageInput = document.querySelector('.pagination-div input');
let amountPerPageSelector = document.querySelector('.amount-per-page-selector');

let isLoading = false
let loader = document.querySelector('.load-screen')
let userInfoScreen = document.querySelector('.user-info-screen')
let editUserInfoScreen = document.querySelector('.edit-user-info-screen')
let editUserInfoForm = document.querySelector('.edit-user-info-form')
let activeRequests = 0;
let editingRow = null
let editingUser = null

let editFormInputs = {
    id: document.querySelector('.edit-id-input'),
    name: document.querySelector('.edit-name-input'),
    username: document.querySelector('.edit-username-input'),
    email: document.querySelector('.edit-email-input'),
    addressCity: document.querySelector('.edit-address-input'),
    phone: document.querySelector('.edit-phone-number-input'),
    website: document.querySelector('.edit-website-input'),
    companyName: document.querySelector('.edit-company-input')
}

let closeBtns = Array.from(document.querySelectorAll('.close-btn'))
closeBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        if (event.target.nextSibling.tagName == 'p') {
            event.target.parentElement.style.display = 'none'
        } else {
            event.target.parentElement.parentElement.style.display = 'none'
        }

    })
})


function main() {
    loadUsers()
    activePagination()
}

function activePagination() {
    backBtn.addEventListener('click', () => {
        if (paginationState.currentPage == 1) {
            return
        }
        showPage(paginationState.currentPage - 1)
        syncPaginationUI()
    })

    forwardBtn.addEventListener('click', () => {
        if (paginationState.currentPage == paginationState.totalPages) {
            return
        }
        showPage(paginationState.currentPage + 1)
        syncPaginationUI()
    })

    pageInput.addEventListener('change', () => {
        let target = parseInt(pageInput.value, 10)
        if (target < 1) {
            target = 1
        }
        if (target > paginationState.totalPages) {
            target = paginationState.totalPages
        }
        showPage(target)
        pageInput.value = `${target}`
    })

    amountPerPageSelector.addEventListener('change', () => {
        const selectedAmount = parseInt(amountPerPageSelector.value, 10)
        console.log(selectedAmount)
        paginationState.perPage = selectedAmount
        paginationState.currentPage = 1
        renderAllTables()
        showPage(1)
        syncPaginationUI
    })
}

function loadUsers() {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
        .then(res => {
            usersData = res.data
            paginationState.perPage = 5
            paginationState.currentPage = 1
            paginationState.totalPages = Math.ceil(usersData.length / paginationState.perPage)

            renderAllTables()
            showPage(1)
            syncPaginationUI()
        })
        .catch(error => console.log(error))
}

function getDataSlices(users, perPage) {
    let slices = []
    for (let i = 0; i < users.length; i += perPage) {
        slices.push(users.slice(i, i + perPage))
    }
    return slices
}

function renderAllTables() {
    const wrapper = document.querySelector('.wrapper')
    document.querySelectorAll('.usersTable').forEach(table => table.remove())
    const dataSlices = getDataSlices(usersData, paginationState.perPage)
    dataSlices.forEach((slice, index) => {
        const pageNumber = index + 1
        const table = createUsersTable(slice, pageNumber)
        wrapper.appendChild(table)
    })
    paginationState.totalPages = dataSlices.length
}

function showPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > paginationState.totalPages) {
        return
    }
    document.querySelectorAll('.usersTable').forEach(table => {
        table.style.display = 'none'
    });
    const activeTable = document.querySelector('.page-' + pageNumber)
    if (activeTable) {
        activeTable.style.display = 'table'
        paginationState.currentPage = pageNumber
    }
}

function syncPaginationUI() {
    pageInput.min = 1
    pageInput.max = paginationState.totalPages
    pageInput.value = paginationState.currentPage
    amountPerPageSelector.value = String(paginationState.perPage)
}

// request interceptor
axios.interceptors.request.use(config => {
    activeRequests++
    showLoader()
    return config
}, error => {
    activeRequests = Math.max(activeRequests - 1, 0)
    if (activeRequests == 0) {
        hideLoader()
    }
    return Promise.reject(error)
})

// response interceptor
axios.interceptors.response.use(response => {
    activeRequests = Math.max(activeRequests - 1, 0)
    if (activeRequests == 0) {
        hideLoader()
    }
    return response
}, error => {
    activeRequests = Math.max(activeRequests - 1, 0)
    if (activeRequests == 0) {
        hideLoader()
    }
    return Promise.reject(error)
})

function showLoader() {
    loader.style.display = 'flex'
}

function hideLoader() {
    loader.style.display = 'none'
}

function handleAction(event) {
    var thisUserID
    if (event.target.className.includes('btn')) {
        thisUserID = event.target.parentElement.parentElement.firstChild.textContent
    }
    if (event.target.className == "show-content-btn") {
        showUserDetails(thisUserID)
    }
    if (event.target.className == "delete-btn") {
        var row = event.target.parentElement.parentElement
        deleteUser(thisUserID, row, usersData)
    }
    if (event.target.className == "edit-btn") {
        var row = event.target.parentElement.parentElement
        editUser(thisUserID, row, usersData)
    }
}

function showUserDetails(userId) {
    axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => {
            // console.log(res.data)
            userInfoScreen.style.display = 'flex'
            var userInfoText = document.createElement('p')
            userInfoText.textContent = JSON.stringify(res.data, null, 2)
            let userInfoDiv = userInfoScreen.querySelector('.user-info-div')
            userInfoDiv.appendChild(userInfoText)

            // document.querySelector('.close-btn').addEventListener('click', (event) => {
            //     userInfoText.parentElement.removeChild(userInfoText)
            //     event.target.parentElement.style.display = 'none'
            // })
        })
        .catch(error => console.log("This user doesnt exist", error))
}

function deleteUser(userId, row, users) {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(() => {
            users = users.filter(user => user.id != userId)
            usersData = users
            renderAllTables()
            const currentPage = Math.min(paginationState.currentPage, paginationState.totalPages)
            showPage(currentPage)
        })
        .catch(error => console.log("This user doesnt exist", error))

}

function editUser(userId, row, users) {
    editUserInfoScreen.style.display = 'flex'
    editingRow = row
    editingUser = users.find(user => user.id == userId)

    Object.values(editFormInputs).forEach((input, index) => {
        input.value = row.cells[index].textContent
    })
}

function createUsersTable(users, pageNumber) {
    // console.log(users)
    const wrapper = document.querySelector('.wrapper')
    let usersTable = document.createElement('table')
    usersTable.addEventListener('click', handleAction)
    usersTable.classList.add('usersTable')
    usersTable.classList.add('page-' + pageNumber)
    var thead = usersTable.createTHead()
    var headRow = thead.insertRow()
    var headerKeys = Object.keys(users[0])
    // console.log(headerKeys)
    headerKeys.forEach(key => {
        const th = document.createElement('th')
        th.textContent = key
        headRow.appendChild(th)
    })
    // create actions column
    const th = document.createElement('th')
    th.textContent = 'actions'
    headRow.appendChild(th)

    var tbody = usersTable.createTBody()
    users.forEach(user => {
        // console.log(user)
        addUser(tbody, user);
    })
    return usersTable
}

let addUserForm = document.querySelector('.add-user-form')
addUserForm.addEventListener('submit', event => {
    event.preventDefault()
    // console.log(event.srcElement)
    let id = parseInt(event.srcElement.querySelector('.id-input').value)
    let name = event.srcElement.querySelector('.name-input').value
    let username = event.srcElement.querySelector('.username-input').value
    let email = event.srcElement.querySelector('.email-input').value
    let addressCity = event.srcElement.querySelector('.address-input').value
    let phoneNumber = event.srcElement.querySelector('.phone-number-input').value
    let website = event.srcElement.querySelector('.website-input').value
    let companyName = event.srcElement.querySelector('.company-input').value

    const userAlreadyExists = usersData.some(user => user.id == id)
    if (userAlreadyExists) {
        alert(`User with id ${id} already exists`)
        return
    }

    const newUser = {
        id: id,
        name: name,
        username: username,
        email: email,
        address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: addressCity,
            zipcode: '92998-3874',
            geo: {
                lat: '-37.3159',
                lng: '81.1496'
            }
        },
        phone: phoneNumber,
        website: website,
        company: {
            name: companyName,
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets'
        }
    }

    console.log(newUser)
    addNewUser(newUser)
})

editUserInfoForm.addEventListener('submit', event => {
    event.preventDefault()

    let editedUser = {
        id: parseInt(editFormInputs.id.value),
        name: editFormInputs.name.value,
        username: editFormInputs.username.value,
        email: editFormInputs.email.value,
        address: {
            street: editingUser.address.street,
            suite: editingUser.address.suite,
            city: editFormInputs.addressCity.value,
            zipcode: editingUser.address.zipcode,
            geo: {
                lat: editingUser.address.geo.lat,
                lng: editingUser.address.geo.lng
            }
        },
        phone: editFormInputs.phone.value,
        website: editFormInputs.website.value,
        company: {
            name: editFormInputs.companyName.value,
            catchPhrase: editingUser.company.catchPhrase,
            bs: editingUser.company.bs
        }
    }

    axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, editedUser)
        .then(() => {
            let updatedValues = [
                editedUser.id,
                editedUser.name,
                editedUser.username,
                editedUser.email,
                editedUser.address.city,
                editedUser.phone,
                editedUser.website,
                editedUser.company.name
            ]

            updatedValues.forEach((value, index) => {
                editingRow.cells[index].textContent = value
            })
            editUserInfoScreen.style.display = 'none'
        })
        .catch(error => console.log("This user doesnt exist", error))
})

function addUser(tbody, user) {
    var userRow = tbody.insertRow();
    for (let property in user) {
        // console.log(user[property])
        if (property == 'address') {
            userRow.insertCell().textContent = user[property].city;
            continue
        }
        if (property == 'company') {
            userRow.insertCell().textContent = user[property].name;
            continue
        }
        userRow.insertCell().textContent = user[property];

    }
    userRow.insertCell().classList.add('actionsDiv');
    var eyeIcon = document.createElement('img');
    eyeIcon.src = "icons/eye.svg";
    eyeIcon.classList.add('show-content-btn');
    userRow.lastChild.appendChild(eyeIcon);

    var deleteIcon = document.createElement('img');
    deleteIcon.src = "icons/delete.svg";
    deleteIcon.classList.add('delete-btn');
    userRow.lastChild.appendChild(deleteIcon);

    var editIcon = document.createElement('img');
    editIcon.src = "icons/edit.svg";
    editIcon.classList.add('edit-btn');
    userRow.lastChild.appendChild(editIcon);
}

function addNewUser(newUser) {
    axios.post(`https://jsonplaceholder.typicode.com/users/`, newUser)
        .then(() => {
            // console.log('user added')
            usersData.push(newUser)
            renderAllTables()
            showPage(paginationState.totalPages)
        })
        .catch(error => console.log("This user doesnt exist", error))
}