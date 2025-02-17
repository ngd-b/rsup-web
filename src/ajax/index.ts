import Axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { ResParams } from "./type/index";
/**
 * 1. 浏览器创建XMLHttpRequest；node 创建http
 * 2. 拦截请求、响应
 * 3. 转换响应数据和请求数据
 * 4. 取消请求
 * 5. 自动转换JSON数据
 * 6. 防御XSRF攻击
 *
 */

class Api {
  private axios: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.axios = Axios.create({
      timeout: 5 * 60 * 1000,
      ...config,
    });
    // 拦截器
    this.interceptorsRequest();
    this.interceptorsResponse();
  }
  interceptorsRequest() {
    this.axios.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error: AxiosError) {
        return Promise.reject(error);
      }
    );
  }
  interceptorsResponse() {
    this.axios.interceptors.response.use(
      function (res) {
        if (res.status === 200) {
          return res.data;
        }
        return Promise.reject(res);
      },
      function (error: AxiosError) {
        return Promise.reject(error);
      }
    );
  }
  request<T>(config: AxiosRequestConfig): Promise<ResParams<T>> {
    return this.axios.request<ResParams<T>, ResParams<T>>(config);
  }
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ResParams<T>> {
    return this.axios.get<ResParams<T>, ResParams<T>>(url, config);
  }
  post<T, P>(
    url: string,
    data?: P,
    config?: AxiosRequestConfig
  ): Promise<ResParams<T>> {
    return this.axios.post<ResParams<T>, ResParams<T>>(url, data, config);
  }
}

// 默认的服务地址
export const ajax = new Api({
  baseURL: import.meta.env.VITE_URL,
});
export default Api;
