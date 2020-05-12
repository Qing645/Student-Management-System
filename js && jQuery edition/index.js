//  初始化页面
function init() {
    bindEvent()
}
var dialog = document.getElementsByClassName('dialog')[0];
var tableData = [];
// 绑定事件
function bindEvent() {
    var menuList = document.getElementsByClassName('menu-list')[0];
    menuList.addEventListener('click', changeMenu, false);
    var addStudentBtn = document.getElementById('add-student-btn');
    addStudentBtn.addEventListener('click', function(e) {
        changeStudent(e, '/api/student/addStudent', 'add-student-form')
    }, false);
    var tboby = document.getElementById('tbody');
    tbody.addEventListener('click', tbodyclick, false);
    var mask = document.getElementsByClassName('mask')[0];
    mask.onclick = function(e) {
        dialog.classList.remove('show');
    }



    var editStudentBtn = document.getElementById('edit-student-btn');
    editStudentBtn.addEventListener('click', function(e) {
        changeStudent(e, '/api/student/updateStudent', 'edit-student-form');
    }, false);
}
// 下列为执行函数
function tbodyclick(e) {
    var tagName = e.target.tagName.toLowerCase();
    if (tagName != "button") {
        return false;
    }
    var isEdit = e.target.className.indexOf('edit') > -1;
    var isDel = e.target.className.indexOf('del') > -1;
    var index = e.target.getAttribute('data-index');
    if (isEdit) {
        dialog.classList.add('show');
        renderFrom(tableData[index]);
    } else if (isDel) {
        var delConfirm = confirm('是否删除?');
        if (delConfirm) {
            transferData('/api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function() {
                alert('已删除');
                var list = document.getElementsByClassName('list')[0];
                list.click();
            })
        }
    }
}

function renderFrom(data) {
    var form = document.getElementById('edit-student-form');
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}
// 点击事件
function changeMenu(e) {
    var tagName = e.target.tagName;
    if (tagName == 'DD') {
        initMenu(e.target);
        var id = e.target.getAttribute('data-id');
        var content = document.getElementsByClassName(id)[0];
        initContent(content);
        if (id == 'student-list') {
            renderTable();
        }
    }
}

// 渲染右侧表格
function renderTable() {
    transferData('/api/student/findAll', '', function(res) {
        var data = res.data;
        tableData = data;
        var str = "";
        data.forEach(function(item, index) {
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
        var tBody = document.getElementById('tbody');
        tBody.innerHTML = str;
    })
}
//数据交互
function transferData(url, data, cb) {
    if (!data) {
        data = {};
    }
    var result = saveData('http://api.duyiedu.com' + url, Object.assign(data, {
        appkey: 'qing_1554402950527'
    }));
    if (result.status == 'success') {
        cb(result);
        return result;
    } else {
        alert(result.msg);
    }
}
// 点击事件
// function addStudent(e) {
//     //阻止表单的默认事件 
//     e.preventDefault();
//     var form = document.getElementById('add-student-form');
//     var data = getFormData(form);
//     if (!data) {
//         return false;
//     }
//     transferData('/api/student/addStudent', data, function() {
//         var isTurnPage = confirm('提交成功，是否跳转'); //confirm确认框
//         if (isTurnPage) {
//             var studentListTab = document.getElementsByClassName('list')[0];
//             studentListTab.click();
//         }
//         form.reset();
//     });
// }

function changeStudent(e, url, id) {
    //阻止表单的默认事件
    e.preventDefault();
    var form = document.getElementById(id);
    var data = getFormData(form);
    if (!data) {
        return false;
    }
    var msg = '';
    if (id == 'edit-student-form') {
        msg = '更新数据';
    } else {
        msg = '提交成功';
    }
    transferData(url, data, function() {
        var isTurnPage = confirm('更新数据'); //confirm确认框
        if (isTurnPage) {
            var studentListTab = document.getElementsByClassName('list')[0];
            studentListTab.click();
            if (id == 'edit-student-form') {
                var mask = document.getElementsByClassName('mask')[0];
                mask.click();
            }
        }
        form.reset();
    });
}
// 获取表单数据（编辑表单，新增表单）
function getFormData(form) {
    var name = form.name.value;
    var sNo = form.sNo.value;
    var birth = form.birth.value;
    var sex = form.sex.value;
    var phone = form.phone.value;
    var email = form.email.value;
    var address = form.address.value;
    if (!name || !sNo || !birth || !sex || !phone || !email || !address) {
        alert('未填写完全，请继续填写');
        return false;
    }
    return {
        name: name,
        sNo: sNo,
        birth: birth,
        sex: sex,
        phone: phone,
        email: email,
        address: address
    }
}
// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

// 初始化右侧内容样式，动态删除添加class类名
function initContent(dom) {
    var contentActive = document.getElementsByClassName('content-active');
    for (var i = 0; i < contentActive.length; i++) {
        contentActive[i].classList.remove('content-active');
    }
    dom.classList.add('content-active');
}
// 初始化左侧导航条，动态改变class类名
function initMenu(dom) {
    var active = document.getElementsByClassName('active');
    for (var i = 0; i < active.length; i++) {
        active[i].classList.remove('active');
    }
    dom.classList.add('active');
}

init();