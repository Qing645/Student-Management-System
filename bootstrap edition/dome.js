// 点击dom操作
(function ($) {
    var obj = {
        init: function () {
            this.bindEvent();
            location.hash = "#student-echarts";
        },
        bindEvent: function () {
            $('.student-item').on('click',function(){
                $('.active').removeClass('active');
                $(this).addClass('active');
                location.hash = $(this).attr('data-id')      //添加哈希值
                return false;                                //点击时会触发a标签，hash值赋予错误，返回false阻止a标签默认事件；
            })
            $('.logo').on('click', function(){
                location.hash = "#student-echarts";
            })
            $('.modal').on('click',function(){
                $(this).hide();
            })
            $('.modal-content').add('.del-modal .con').on('click',function(){
                return false;   
            })
        }
    }
    obj.init();
})(window.jQuery);