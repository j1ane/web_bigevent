$(function(){
    var layer=layui.layer
    var form=layui.form
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        m=m>10 ?m :'0'+m
        var d = dt.getDate()
        d=d>10 ?d :'0'+d
        var hh = dt.getHours()
        hh=hh>10 ?hh :'0'+hh
        var mm = dt.getMinutes()
        mm=mm>10 ?mm :'0'+mm
        var ss = dt.getSeconds()
        ss=ss>10 ?ss :'0'+ss
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要请求参数对象提交到服务器
    var q={
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
                
              return layer.msg('获取文章列表失败！')
            }
            // console.log(res);
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            renderPage(res.total)
          }
        })
    }
    

    // 初始化文章分类的方法
     function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

//   定义渲染分页的方法
  function renderPage(total){
    // console.log(total);
    laypage.render({
        elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit:q.pagesize,
        curr:q.pagenum,
        layout:['count','limit','prev', 'page', 'next','skip'],
        limits:[2,3,10],
        jump: function(obj,first){
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            q.pagenum=obj.curr
            q.pagenum=obj.limit
            // initCate()
            if(!first){
                //do something
                initCate()
              }
        }
      });
  }
//   通过代理的方式，为删除按钮绑定点击事件
   $('tbody').on('click','.btn-delete',function(){
    var len=$('.btn-delete').length
    // console.log(len);
    var id=$(this).attr('data-id')
    // console.log('ok');
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
        //do something
        $.ajax({
            method:'get',
            url:'/my/article/delete/'+id,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功')
                // 当数据删除完成后，需要判断这一页中是否还有剩余数据。如无，则页码值减一后，重新调用initTable
                if(len===1){
                    q.pagenum=q.pagenum==1 ?1 :q.pagenum-1
                }
                initTable()
            }
        })
        layer.close(index);
      });
  }) 

//   $('tbody').on('click', '.btn-delete', function() {
//     // 获取删除按钮的个数
//     var len = $('.btn-delete').length
//     // 获取到文章的 id
//     var id = $(this).attr('data-id')
//     // 询问用户是否要删除数据
//     layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
//       $.ajax({
//         method: 'GET',
//         url: '/my/article/delete/' + id,
//         success: function(res) {
//           if (res.status !== 0) {
//             return layer.msg('删除文章失败！')
//           }
//           layer.msg('删除文章成功！')
//           // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
//           // 如果没有剩余的数据了,则让页码值 -1 之后,
//           // 再重新调用 initTable 方法
//           // 4
//           if (len === 1) {
//             // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
//             // 页码值最小必须是 1
//             q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
//           }
//           initTable()
//         }
//       })

//       layer.close(index)
//     })
// })

})