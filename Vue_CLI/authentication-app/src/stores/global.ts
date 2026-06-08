import { message, notification } from "ant-design-vue";
import { defineStore } from "pinia";
import { reactive } from "vue";

interface NotificationMsg {
    msg: string | any
    desc?: string
    type?: string
    [key: string]: any
}

export const useGlobalStore = defineStore('global', () => {
    const msg: NotificationMsg = reactive({
        msg: '',
        desc: '',
        type: ''
    })

    const notify = (msgData) => {
        if (typeof msgData.msg == 'string') {
            Object.assign(msg, msgData)
        } else if (typeof msgData.msg == 'object') {
            Object.assign(msg, { ...msgData, msg: msgData.msg.message })
        }
        notification[msg.type || 'error']({
            message: msg.msg,
            description: msg.desc,
            style: { whiteSpace: 'pre-line' }
        })
    }
    return { notify }
})