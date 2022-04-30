var myChart2 = echarts.init(document.getElementById('data2'));

window.onresize = function () {
    myChart2.resize();
};

var option = {
    tooltip: {},
    legend: {
        data: ['流量']
    },
    xAxis: {
        data: ['Benign', 'C&C', 'DDoS', 'PortScan']
    },
    yAxis: {},
    series: [
        {
            name: '流量',
            type: 'bar',
            data: [1923, 6706, 14394, 122]
        }
    ]
};

myChart2.setOption(option);

