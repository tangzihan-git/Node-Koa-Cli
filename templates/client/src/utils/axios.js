import axios from 'axios';
import router from '../router/index';
import { Loading } from 'element-ui';
// axios配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'http://localhost:8081';
// 请求拦截器
axios.interceptors.request.use(
  (req) => {
    req.data = req.data || {};
    req.headers.Authorization = localStorage.getItem('token')
    return req;
  },
  err => Promise.reject(err));
// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    // const token = res.headers.authorization;
    // if (token) {
    //   store.commit('LOGIN', token);
    // }
    
    return res;
  }, (err) => {
    if (err.response.status === 403) {
      // store.commit('LOGIN', null);
      router.replace({
        path: '/login',
      });
      alert("登录信息已经过期请重新登录")
    }
    return Promise.reject(err.response.data);
});
export default axios;
