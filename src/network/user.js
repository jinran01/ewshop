import {request} from "@/network/request";

export function register(data){
    return request({
        url:'/api/auth/register',
        method:'post',
        data,
    })
}
export function login(data){
    return request({
        url:'/api/auth/login',
        method:'post',
        data,
    })
}

export function logout(){
    return request({
        url:'/api/auth/logout',
        method:'post',

    })
}
export function getUser() {
    return request({
        url:'/api/user',
    })
}

//找回密码 获取邮箱验证码
export function getResetCode(params) {
    return request({
        url:'/api/auth/reset/password/email/code',
        method:'post',
        params
    })
}

//找回密码
export function resetPassword(params) {
    return request({
        url:'/api/auth/reset/password/email',
        method:'post',
        params
    })
}

