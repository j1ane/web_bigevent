$(function(){
    getUserInfo()
    var layer=layui.layer
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click',function(){
        // console.log('ok');
       
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // console.log('ok');
            localStorage.removeItem('token')
            
            // 清空本地存储中的token,重新跳转到登录页面
            location.href='/login.html'
            // 关闭confirm询问框
            layer.close(index);
          });
    })
})
// 获取用户信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token')||''
        // },
        success:function(res){
            console.log(res);
            if(res.status!==0){
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
        /* complete:function(res){
            // console.log('ok');
            // console.log(res);
            if(res.responseJSON.status==1 && res.responseJSON.message=='身份认证失败！'){
                localStorage.removeItem('token')
                location.href='/login.html'
            }
        } */
    })
}
// 渲染用户头像
function renderAvatar(user){
    var name=user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        var first=name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}