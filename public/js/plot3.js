var myChart3 = echarts.init(document.getElementById('data3'));

window.onresize = function () {
    myChart3.resize();
};

option = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        orient: 'vertical',
        left: 20,

    },
    series: [
        {
            name: '数据包数量',
            type: 'pie',
            radius: '70%',
            data: [
                { value: 133918, name: '60B-79B' },
                { value: 10428, name: '80B-159B' },
                { value: 2636, name: '160B-319B' },
                { value: 22, name: '320B-639B' },
                { value: 47610, name: '640B-1279B' },
                { value: 39234, name: '1280B-1514B' },
                { value: 17, name: '2962B' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

myChart3.setOption(option);