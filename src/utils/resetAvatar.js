import $ from "jquery";

//重置图片名字
export function reset_fileName(file_name){

    let file_type = file_name.split('.')
    file_type = file_type[file_type.length-1]

    //验证是否为一下格式
    const arr = new Array('jpg','JPG','JPEG','jpeg','png','PNG')
    if(arr.indexOf(file_type) == -1){
        return 0;
    }
    let reset_file_name = ''
    const str = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    for(var i=0;i<5;i++){
        reset_file_name += str[Math.floor(Math.random()*52)];
    }
    const time = new Date();
    reset_file_name = reset_file_name + time.getTime() + '.' +file_type;
    return reset_file_name;
}

export function reset_Avatar(file_name,res,file){
    let formData = new FormData();
    formData.append('key', file_name)
    formData.append('OSSAccessKeyId', res.accessid); //OSS AccessKeyId
    formData.append('policy', res.policy);  //OSS 签名
    formData.append('Signature', res.signature); //OSS 签名
    // formData.append('callback', res.callback);
    formData.append('success_action_status', 200); // 成功后返回的操作码
    formData.append('file', file.file); //文件

    //提交照片到oss
    $.ajax({
        type: "POST", //提交方式
        url: res.host,//路径
        dataType: 'XML',
        processData: false,
        cache: false,
        async: false,
        contentType: false,
        //关键是要设置contentType 为false，不然发出的请求头 没有boundary
        //该参数是让jQuery去判断contentType
        data: formData,//要发送到OSS数据
    });

    return formData;
}
