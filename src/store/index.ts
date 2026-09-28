import Vue from 'vue'
import Vuex from 'vuex'
import UserService from '@/service/UserService'
import MessageService from '@/service/MessageService'

Vue.use(Vuex)
import UserInfoResponse from '@/beans/common/UserInfoResponse'
import UnreadMessage from '@/beans/message/res/UnreadMessage'

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      phoneNumber: ''
    },
    unReadMessage: 0,
    UnreadMessageList: [],
    childSchoolName: ''
  },
  mutations: {
    setUser (state: any, user: UserInfoResponse) {
      state.user = user
    },
    setUnreadMessageList (state: any, items) {
      state.UnreadMessageList = items
    },
    setChildSchoolName(state: any,childrenSchool: string) {
      state.childSchoolName = childrenSchool
    }
  },
  actions: {
    getUser ({ commit }) {
      new UserService()
        .getUserInfo()
        .then((res) => {
          if (res.success && res.data) {
            const user = res.data
            commit('setUser', user)
          }
        })
        .catch()
      new MessageService()
        .getUnreadMessage()
        .then((res) => {
          commit('setUnreadMessageList', res.data)
        })
        .catch()
    }
  }
})
