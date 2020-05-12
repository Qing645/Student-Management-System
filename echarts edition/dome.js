// 点击dom操作
(function ($) {
    var obj = {
        init: function () {
            this.bindEvent();
            location.hash = "#student-echarts";
        },
        bindEvent: function () {
            var list = $('header .drop-list');
            var num = 0;
            $('header .btn').on('click', function () {
                if (num == 0) {
                    $('.btn').css({
                        transform: " translateY(-50%) rotate(90deg)"
                    });
                    num = 1
                    list.slideToggle();
                }else{
                    $('.btn').css({
                        transform: " translateY(-50%) rotate(0deg)"
                    });
                    num = 0
                    list.slideToggle();
                }
            });
            $(window).resize(function(){
                if($(window).innerWidth() > 600){
                    list.hide();
                    $('.btn').css({
                        transform: " translateY(-50%) rotate(0deg)"
                    });
                    num = 0
                }
            })
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