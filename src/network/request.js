import axios from 'axios';
import {Notify, Toast} from 'vant';
import router from '../router'

export function request(config){
    const instance = axios.create({
        baseURL: 'http://localhost',
        // baseURL: 'http://47.92.51.18',
        // baseURL: 'https://api.shop.eduwork.cn',
        timeout: 10000,
    })


    //请求拦截
    instance.interceptors.request.use(config=>{
        console.log(config)
        // 如果有一个接口需要认证才可以访问，就在这统一设置
        const token = window.localStorage.getItem('token')
        if(token){
            config.headers.Authorization = 'Bearer '+token;
        }
        // 直接放行
        return config;
    }, err=>{
    })


    // 响应拦截
    instance.interceptors.response.use(res=>{
        //   console.log(res);

        return res.data ? res.data : res;
    }, err=>{
        console.log(err)

        // while(err.code == 'ECONNABORTED'){
        Toast.loading({message:'加载中...',forbidClick:true})
        // }
        if (err.code == 'ECONNABORTED'){
            location.reload();

        }
        // console.log(err.response.status == '401')
        // 如果有需要授权才可以访问的接口， 统一去login授权
        if(err.response.status == '401'){
            // Toast.fail('请先登录');
            // console.log(err.response)
            router.push({path:'/login'})
        }
        if(err.response.status == '400'){

            Notify({
                message: err.response.data.message,
                position: 'center',
            });
        }
        //
        if(err.response.status == '422'){
            // Toast.fail('请先登录');
            Notify({
                message: err.response.data.errors[Object.keys(err.response.data.errors)[0]][0],
                position: 'center',
            });
        }

        // 如果有错误，这里面会去处理，显示错误信息
        Notify({
            message: err.response.data.errors[Object.keys(err.response.data.errors)[0]][0],
            position: 'center',
        });

    })

    return instance(config);
}
