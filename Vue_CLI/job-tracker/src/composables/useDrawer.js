import { ref } from "vue"

const drawerOpen = ref(false)
const drawerMode = ref('add')
const currentEditingApplication = ref(null)

export function userDrawer() {
    function closeDrawer() {
        drawerOpen.value = false
    }

    function openAddDrawer() {
        currentEditingApplication.value = { company: '', role: '', location: '', status: '', appliedDate: '', notes: '', url: '' }
        drawerMode.value = 'add'
        // currentEditingApplication.value = null
        drawerOpen.value = true
    }

    function openEditDrawer(application) {
        drawerOpen.value = true
        drawerMode.value = 'edit'
        currentEditingApplication.value = application
    }

    return { closeDrawer, openAddDrawer, openEditDrawer, drawerOpen, drawerMode, currentEditingApplication }
}