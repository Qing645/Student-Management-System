var nowPage = 1;
    pageSize = 15;
    allPageSize = 1;
    tableData = [];
    flag = false;
function bindEvent() {                                        //绑定事件
    $('.menu-list').on('click', 'dd', function () {  
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var id = $(this).data('id');
        if (id == 'student-list') {
            getTableData();
        };
        $('.content').fadeOut();
        $('.' + id).fadeIn();
    });
    $('#add-student-btn').on('click', function (e) {
        e.preventDefault();
        var data = $('#add-student-form').serializeArray();
        data = formatObj(data);
        transferData('api/student/addStudent', data, function (res) {
            alert('牛逼！！！添加成功！');
            $('#add-student-form')[0].reset();//reset() 重置表单元素
            $('.list').trigger('click');
        })
    });
    $('#edit-student-btn').on('click', function (e) {
        if (flag) {
            return false;
        }
        flag = true;
        e.preventDefault();
        var data = $('#edit-student-form').serializeArray();
        data = formatObj(data);
        transferData('/api/student/updateStudent', data, function (res) {
            alert('牛逼！！！修改成功！');
            $('#edit-student-form')[0].reset();//reset() 重置表单元素
            $('.mask').trigger('click');
            var val = $('#search-word').val();
            if (val) {
                filterData(val);
            } else {
                getTableData();
            }
            flag = false;
        })
    });
    $('#tbody').on('click', '.btn-edit', function () {       //编辑事件
        var index = $(this).data('index');
        renderFrom(tableData[index]);                        //遍历获取进行编辑的源数据
        $('.dialog').slideDown();
    })
    $('#tbody').on('click', '.btn-del', function () {
        var index = $(this).data('index');
        var isDel = window.confirm('确认删除吗');             //确认弹框，返回值为true或false 
        if (isDel) {
            transferData('api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function (res) {
                alert('牛逼！！！删除成功！');
                $('.list').trigger('click');
            })
        }
    })
    $('.mask').on('click', function () {
        $('.dialog').slideUp();
    })

    //搜索内容
    $('.button').on('click', function (e) {                 
        var val = $('#search-word').val();
        if (val) {
            filterData(val);
        } else {
            getTableData();
        }
    })
}

function formatObj(arr) {                                    //便利获取后端数据
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr.name]) {
            obj[arr[i].name] = arr[i].value;
        }
    }
    return obj;
}

function getTableData() {                                    //按页查询的数据请求
    transferData('api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function (res) {
        allPageSize = res.data.cont;
        tableData = res.data.findByPage;
        renderTable(tableData);
    })
}
function filterData(val) {                                   //搜索的数据请求
    transferData('api/student/searchStudent', {
        sex: -1,
        search: val,
        page: nowPage,
        size: pageSize
    }, function (res) {
        console.log(res);
        allPageSize = res.data.cont;
        renderTable(res.data.searchList)
    })
}
function renderTable(data) {                                //根据后端数据进行前端动态渲染
    var str = "";
    data.forEach(function (item, index) {                   //对后端数据进行遍历
        str += ' <tr>\
           <td>' + item.sNo + '</td>\
           <td>' + item.name + '</td>\
           <td>' + (item.sex ? '女' : '男') + '</td>\
           <td>' + item.email + '</td>\
           <td>' + (new Date().getFullYear() - item.birth) + '</td>\
           <td>' + item.phone + '</td>\
           <td>' + item.address + '</td>\
           <td><button class="btn-edit" data-index = ' + index + '>编辑</button>\
               <button class="btn-del"  data-index = ' + index + '>删除</button>\
              </td>\
       </tr>'
    });
    $('#tbody').html(str);

    $('.pagenum').page({                                     //调用翻页插件
        allPageSize: allPageSize,
        nowPage: nowPage,
        pageSize: pageSize,
        changePageCb: function (page) {
            nowPage = page.nowPage;
            pageSize = page.pageSize;
            var val = $('#search-word').val();
            if (val) {
                filterData(val);
            } else {
                getTableData();
            }
        }
        // allPageSize : 100,
        // nowPage :5,
        // pageSize : 15,

    });
}


function transferData(url, data, callback) {                 //请求后端数据的函数封装
    $.ajax({
        type: 'get',
        url: 'http://api.duyiedu.com/' + url,
        data: $.extend(data, {
            appkey: 'qing_1554402950527'
        }),
        dataType: 'json',
        success: function (res) {
            if (res.status == 'success') {
                callback(res);
            } else {
                alert(res.msg);
            }
        }
    })
}

function renderFrom(data) {                                //编辑弹框的原数据获取
    var form = $('#edit-student-form')[0];
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}
function init() {                                          
    bindEvent();
    $('.list').trigger('click');
};
init();
