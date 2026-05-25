import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('counter', {
  state: () => ({
    applications: [],
    filter: 'All',
    loading: false,
    error: null
  }),

  getters: {
    filteredApplications: (state) => {
      return state.filter == 'All' ? state.applications : state.applications.filter(application => application.status == state.filter)
    },
    totalCount: (state) => {
      return state.applications.length
    },
    interviewCount: (state) => {
      return state.applications.filter(application => application.status == 'interview').length
    },
    offerCount: (state) => {
      return state.applications.filter(application => application.status == 'offer').length
    },
    rejectCount: (state) => {
      return state.applications.filter(application => application.status == 'rejected').length
    }
  },

  actions: {
    fetchApplications() {
      fetch('http://localhost:3000/applications')
        .then(res => res.json())
        .then(data => this.applications = data)
        .catch(err => console.log(err))
    },

    addApplication(applicationData) {
      fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      })
        .then(res => res.json())
        .then(data => this.applications.push(data))
        .catch(err => console.log(err))
    },

    updateApplication(editedAppID, newData) {
      return fetch(`http://localhost:3000/applications/${editedAppID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
        .then(res => res.json())
        .then(data => {
          this.applications = this.applications.map(app => app.id == data.id ? data : app)
        })
        .catch(err => console.log(err))
    },

    deleteApplication(applicationID) {
      fetch(`http://localhost:3000/applications/${applicationID}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => this.applications = this.applications.filter(application => application.id != data.id))
        .catch(err => console.log(err))
    }
  }
})
