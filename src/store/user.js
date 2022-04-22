import { getUserTempId } from "@/utils/userAbout";
import {
  reqCode,
  reqUserRegister,
  reqUserLogin,
  reqUserInfo,
  reqLogout,
} from "@/api";
// 当该vuex一加载就会自动发送请求获取临时标识
const state = {
  userTempId: getUserTempId(),
  // 注册获取验证码
  code: "",
  // 登陆成功返回token,先从本地去哪,登陆过了就能拿到,否则拿不到,拿不到就是没登陆,让他去登陆
  token: localStorage.getItem("TOKEN_KEY"),
  // 根据token获取的用户信息
  userInfo: {},
};
const mutations = {
  RECEIVE_CODE(state, code) {
    state.code = code;
  },
  RECEVIE_TOKEN(state, token) {
    state.token = token;
  },
  RECEIVE_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  RESET_TOKEN(state) {
    state.token = "";
  },
  RESET_USERINFO(state) {
    state.userInfo = {};
  },
};
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    const result = await reqCode(phone);
    if (result.code === 200) {
      commit("RECEIVE_CODE", result.data);
      return "ok";
    } else {
      // 如果成功就自动填写,所以需要根据返回值来决定做什么
      return Promise.reject(new Error("failed"));
    }
  },
  // 注册
  async userRegister({ commit }, userInfo) {
    const result = await reqUserRegister(userInfo);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
  // 登陆
  async userLogin({ commit }, userInfo) {
    const result = await reqUserLogin(userInfo);
    if (result.code === 200) {
      // 没有登陆过,让他登陆,登陆之后将token存储,在存储本地一份,下次就直接能够从本地获取到
      commit("RECEVIE_TOKEN", result.data.token);
      localStorage.setItem("TOKEN_KEY", result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
  // 根据token获取用户的信息,不需要参数,是因为请求头携带了token就能根据token获取到用户信息
  async getUserInfo({ commit }) {
    const result = await reqUserInfo();
    if (result.code === 200) {
      commit("RECEIVE_USERINFO", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
  // 清理token
  clearToken({ commit }) {
    commit("RESET_TOKEN");
    // 这里老师说,实现自动登陆之后,也要清除本地的,但是如果token过期重新登陆,之前存储在本地的不是被覆盖了吗?

    localStorage.removeItem("TOKEN_KEY");
  },
  //退出登陆
  async userLogout({ commit }) {
    const result = await reqLogout();
    if (result.code === 200) {
      // 退出登陆之前要清除token,清除本地的token,清除用户信息
      commit("RECEVIE_TOKEN");
      commit("RESET_USERINFO");
      localStorage.removeItem("TOKEN_KEY");
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
