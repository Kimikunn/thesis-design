$.get('../public/csv/data.csv', function (data) {
    var myChart4 = echarts.init(document.getElementById('data4'));

    window.onresize = function () {
        myChart4.resize();
    };

    var ack_cnt = [];
    var dataTest = data.split('\r\n');
    for (var i = 1; i < dataTest.length - 1; i++) {
        var temp = dataTest[i].split(',');
        ack_cnt.push(temp[62]);
    }

    var normal = [];
    var abnormal = [];

    for (i = 0; i < ack_cnt.length; i++) {
        if (ack_cnt[i] > 14 || ack_cnt[i] == 0) {
            abnormal.push(ack_cnt[i])
        }
        else {
            normal.push(ack_cnt[i])
        }
    }


    var colorList = ['#17C075', '#EB973F'];

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}:{c}({d}%)',
        },

        series: [
            {
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colorList[params.dataIndex];
                        },
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: normal.length, name: '正常流' },
                    { value: abnormal.length, name: '异常流' },
                ],
            },
        ],
    };
    myChart4.setOption(option);
})