let userList;
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
}

function loadUsers() {
    axios.get(`https://jsonplaceholder.typicode.com/users?limit=${5}`)
        .then(res => {
            userList = res.data
            createUsersTable(userList)
        })
        .catch(error => console.log(error))
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
        deleteUser(thisUserID, row, userList)
    }
    if (event.target.className == "edit-btn") {
        var row = event.target.parentElement.parentElement
        editUser(thisUserID, row, userList)
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
            users.splice(parseInt(userId) - 1, 1)
            row.parentElement.removeChild(row)
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

function createUsersTable(users) {
    // console.log(users)
    const wrapper = document.querySelector('.wrapper')
    let usersTable = document.createElement('table')
    usersTable.addEventListener('click', handleAction)
    usersTable.classList.add('usersTable')
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

    wrapper.appendChild(usersTable)
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

    const userAlreadyExists = userList.some(user => user.id === id)
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
            console.log('user added')
            userList.push(newUser)
            addUser(document.querySelector('tbody'), newUser)
        })
        .catch(error => console.log("This user doesnt exist", error))
}