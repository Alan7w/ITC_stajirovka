import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userCounterStore = defineStore('counter', () => {
    // state: () => {
    //     return {
    //         count: 0
    //     }
    // },

    // getters: {
    //     double: (state) => state.count * 2
    // },

    // actions: {
    //     increment() {
    //         this.count++
    //     }
    // }

    const count = ref(0)
    const double = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    return { count, double, increment }
})