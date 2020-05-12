//翻页效果

(function ($) {
    function TurnPage(options) {
        this.wrap = options.wrap;
        this.allPageSize = options.allPageSize;
        this.nowPage = options.nowPage;
        this.pageSize = options.pageSize;
        this.allPage = Math.ceil(this.allPageSize / this.pageSize);
        this.changePageCb = options.changePageCb;
        this.init = function () {
            if (this.nowPage > this.allPage) {
                console.log(this.allPageSize +'/' + this.pageSize)
                alert('页码错误');
                return false;
            }
        this.creaDom();
        this.bindEvent();
        this.creaDomCss();
        }
    }
    TurnPage.prototype.creaDom = function () {
        $(this.wrap).empty();
        // 方式一：
        //      var oUl = $('<ul class="my-turn-page"></ul>');

        //      if(this.nowPage > 1){
        //          oUl.append($('<li class="pagebtn prevpage">上页</li>'))
        //             .append($('<li class="num">1</li>'))
        //      }
        //      if(this.nowPage == 1){
        //         oUl.append($('<li class="pagebtn">首&nbsp&nbsp页</li>'));
        //      }
        //      if(this.nowPage > 2){
        //          $('<span>..</span>').appendTo(oUl);
        //      }
        //           oUl.append($('<li class="num active">' + this.nowPage + '</li>'))
        //     if(this.nowPage < this.allPage - 1){
        //     $('<span>..</span>').appendTo(oUl);
        //     }
        //     if(this.nowPage < this.allPage){
        //         oUl.append($('<li class="num">'+ this.allPage +'</li>'))
        //            .append($('<li class="pagebtn nextpage">下页</li>'))
        //     }
        //     if(this.nowPage == this.allPage){
        //          oUl.append($('<li class="pagebtn">尾&nbsp&nbsp页</li>'));

        //     }

        //     var oDiv = $('<div class="page-size">每页条数</div>');
        //     var oInp = $('<input type="number" min=1 max=50 value="' + this.pageSize + '">')
        //     oDiv.append(oInp).appendTo(oUl);
        //     oUl.append($('<li> 共'+ this.allPage + '页</li>'))
        //     $(this.wrap).append(oUl);
        //  }

        //方式二：
        var oUl = $('<ul class="my-turn-page"></ul>');
        if (this.nowPage > 1) {
            $('<li class = "pagebtn prevpage">上页</li>').appendTo(oUl);
        }
        if (this.nowPage == 1) {
            oUl.append($('<li class="pagebtn">首页</li>'));
        }
        if (this.nowPage > 3) {
            oUl.append($('<li class="num">1</li>'));  
        }
        if(this.nowPage > 4){
            $('<span>..</span>').appendTo(oUl);
        }
        for (var i = this.nowPage - 2; i < this.nowPage + 3; i++) {
            if (i == this.nowPage) {
                $('<li class="num active">' + i + '</li>').appendTo(oUl);
            } else if (i > 0 && i <= this.allPage) {
                $('<li class="num">' + i + '</li>').appendTo(oUl);
            }
        }
        if(this.nowPage < this.allPage - 3){
            $('<span>..</span>').appendTo(oUl);
        }
        if (this.nowPage < this.allPage - 2) {
            oUl.append($('<li class="num">' + this.allPage + '</li>'));
        }
        if (this.nowPage < this.allPage) {
            $('<li class = "pagebtn nextpage">下页</li>').appendTo(oUl);
        }
        if (this.nowPage == this.allPage) {
            oUl.append($('<li class="pagebtn">尾页</li>'));
        }
        var oDiv = $('<div class="page-size">每页条数</div>');
            var oInp = $('<input class="pagesize_btn" type="number" min=1 max=50 value="' + this.pageSize + '">')
            oDiv.append(oInp).appendTo(oUl);
            oUl.append($('<li> 共'+ this.allPage + '页</li>'))
        $(this.wrap).append(oUl);
    }

    TurnPage.prototype.creaDomCss = function () {
        $(this.wrap).css({
        })
        $('.my-turn-page li').css({
            listStyle: 'none',
            fontSize: 12,
            padding: 5,
            height: 10,
            lineHeight: '10px',
            border: '1px solid #eee',
            display: 'inline-block',
            margin: '0 2px',
            cursor: 'pointer',
            userSelect: 'none',//消除点击蓝色背景色
        })
        $('.my-turn-page li.active').css({
            backgroundColor: '#666',
        })
        $('.my-turn-page li.pagebtn').css({
            fontSize: '10px',
            color: '#666',
            userSelect: 'none',
        })
        $('.my-turn-page .page-size,.my-turn-page input').css({
            display: 'inline-block',
            fontSize: 10,
            userSelect: 'none',
        })
        $('.my-turn-page input').css({
            width: 35,
            border: 'none'
        })
    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        $('.num',this.wrap).on('click', function () {
            var page = parseInt($(this).text());
            self.changePage(page);
        });
        $('.prevpage',this.wrap).on('click', function () {
            if (self.nowPage > 1) {
                self.changePage(self.nowPage - 1);
            }
        });
        $('.nextpage',this.wrap).on('click', function () {
            if (self.nowPage < self.allPage) {
                self.changePage(self.nowPage + 1);
            }
        });
        $('.pagesize_btn',this.wrap).change(function(){
            self.pageSize = parseInt(this.value);
            self.allPage = Math.ceil(self.allPageSize / self.pageSize);
            self.changePage(1);
        })
    }
    TurnPage.prototype.changePage = function (page) {
        this.nowPage = page;
        this.creaDom();
        this.bindEvent();
        this.creaDomCss();
        this.changePageCb && this.changePageCb({
            nowPage : this.nowPage,
            pageSize : this.pageSize
        })
    }
    $.fn.extend({
        page: function (options) {
            options.wrap = this;
            var pageObj = new TurnPage(options);
            pageObj.init();
            return this;
        }
    })
})(jQuery)