(function ($) {
    var obj = {
        init: function () {
            this.bindEvent();
            this.dataList = [];
            this.size;
        },
        bindEvent: function () {
            var self = this;
            $(window).on('hashchange', function () {
                var hash = location.hash;
                $('.show-list').removeClass('show-list');
                $(hash).addClass('show-list');
            });
            $('.student-list').on('click', function () {
                self.getAllData();
            })
            $('.submit-add').on('click', function () {
                self.addStudent();
            });
            $('.serch-btn').on('click', function () {
                self.getSearch();
            })
        },
        getSearch: function () {
            var size = self.size;
            var page = 1;
            var val = $('#inp').val();
            var sex = $('input:radio:checked').val();
            if (!val) {
                alert('请输入搜索内容');
                return;
            }
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/searchStudent?appkey=qing_1554402950527',
                data: { size: size, page: page, search: val, sex: sex },
                success:function(data){
                     var list = JSON.parse(data).data.searchList;
                     self.randerDom(list);
                },
                error:function(){
                    alert('错误');
                }
            })
        },
        addStudent: function () {
            var data = this.getFormData($('#student-form'));
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/addStudent?appkey=qing_1554402950527',
                data: data,
                success: function () {
                    alert('添加成功');
                    $('.student-list').trigger('click');
                },
                error: function () {
                    alert('添加失败');
                }
            })
        },
        getAllData: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll?appkey=qing_1554402950527',
                success: function (data) {
                    var list = JSON.parse(data).data;                        //使用ajax时必须把获取到的数据转化为json格式；
                    self.randerDom(list);
                    self.dataList = list;
                    self.size = list.length;
                },
                beforeSend: function () {
                    $('tbody').html("<p>正在加载中...</p>");
                },
                error: function () {
                    console.log('error');
                }
            })
        },
        randerDom: function (data) {
            var self = this;
            var len = data.length;
            var str = "";
            if (len > 0) {
                data.forEach(function (ele, i) {
                    str += "<tr><td>" + ele.sNo + "</td>\
                <td>"+ ele.name + "</td>\
                <td>"+ (ele.sex ? '女' : '男') + "</td>\
                <td>"+ ele.email + "</td>\
                <td>"+ (new Date().getFullYear() - ele.birth) + "</td>\
                <td>"+ ele.phone + "</td>\
                <td>"+ ele.address + "</td>\
                <td><button class='edit' data-index="+ i + ">编辑</button>\
                <button class='del' data-index="+ i + ">删除</button></td></tr>"
                })
            }
            $('tbody').html(str);
            self.pop();
        },
        pop: function () {                                                 //弹框
            var self = this;
            $('.edit').on('click', function () {                           //编辑弹框
                $('.modal').show();
                // 数据回填
                var i = $(this).attr('data-index');
                var data = self.dataList[i];
                var form = $('#modal-form')[0];
                for (var prop in data) {
                    form[prop] ? form[prop].value = data[prop] : '';
                }
                $('.submit').on('click', function () {                   //  提交
                    var data = self.getFormData($('#modal-form'));
                    $.ajax({
                        type: 'get',
                        url: 'http://api.duyiedu.com/api/student/updateStudent?appkey=qing_1554402950527',
                        data: data,
                        dataType: 'json',
                        success: function (res) {
                            alert(res.msg);
                            $('.modal').hide();
                            $('.student-list').trigger('click');
                        },
                        error: function () {
                            alert(res);
                        }
                    })
                    return false;             //阻止默认事件
                })
            });
            $('.del').on('click', function () {                        //删除
                $('.del-modal').show();
                var i = $(this).attr('data-index');
                var num = self.dataList[i].sNo;
                $('.sure-btn').on('click', function () {
                    $.ajax({
                        url: 'http://api.duyiedu.com/api/student/delBySno?appkey=qing_1554402950527',
                        data: { sNo: num },
                        success: function () {
                            $('.del-modal').hide();
                            alert('删除成功');
                            $('.student-list').trigger('click');
                        },
                        error: function () {
                            alert('error')
                        },
                        error: function () {
                            alert(error);
                        }
                    })
                })
                $('.reset-btn').on('click', function () {
                    $('.del-modal').hide();
                })
            })
        },
        getFormData: function (form) {
            var data = form.serializeArray();     //获取表单数据；
            var obj = {};
            data.forEach(function (ele, i) {
                obj[ele.name] = ele.value;
            })
            return obj;
        }
    }
    obj.init();
})(window.jQuery)
