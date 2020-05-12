(function () {                                        //echarts 图例
    var obj = {
        init: function () {
            this.getData();
            this.option = {
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: []
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        },
        getData: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll?appkey=qing_1554402950527',
                success: function (data) {
                    var jsonList = JSON.parse(data);                             //字符串转化为json类型
                    self.getAreaChart(jsonList.data);
                    self.getSexChart(jsonList.data);
                },
                error: function () {
                    console.log('error');
                },
            })
        },
        getAreaChart: function (listData) {
            var myAreaChart = echarts.init($('.area')[0]);                //echarts 插件    
            var seriesArr = [];                                 //数据处理  地区分布
            var legendArr = [];
            var numObj = {};
            listData.forEach(function (ele) {           //遍历后台数据数组
                if (legendArr.indexOf(ele.address) == -1) {          //寻找没有重复的
                    legendArr.push(ele.address);                   //地名数组中添加地名
                    numObj[ele.address] = 1;                 //新对象中添加  地名：数量
                } else {
                    numObj[ele.address]++;                    //有重复的 数量加一
                }
            });
            for (var prop in numObj) {                        //遍历新对象
                var obj = {};
                obj.name = prop;
                obj.value = numObj[prop];
                seriesArr.push(obj);                          //目标数组添加最终数据
            }
            this.option.title.text = '学生地区分布';
            this.option.series[0].name = '地区分布';
            this.option.legend.data = legendArr;                //处理好的数据放入插件
            this.option.series[0].data = seriesArr;
            var option = this.option;
            myAreaChart.setOption(option);
        },
        getSexChart: function (listData) {
            var mySexChart = echarts.init($('.sex')[0]);        //echarts 插件 
            var man = 0,                                         //数据处理 性别比例
                woman = 0;
            for (var prop in listData) {
                if (listData[prop].sex == 0) {
                    man++;
                } else {
                    woman++;
                }
            }
            var sexArr = [{ name: '男', value: man }, { name: '女', value: woman }];
            this.option.title.text = '学生性别比例';
            this.option.series[0].name = '性别比例';
            this.option.legend.data = ['男', '女']
            this.option.series[0].data = sexArr;
            var option = this.option;
            mySexChart.setOption(option);
        }
    }
    obj.init();
})();