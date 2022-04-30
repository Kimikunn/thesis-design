var myChart1 = echarts.init(document.getElementById('data1'));

window.onresize = function () {
    myChart1.resize();
};

option = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        orient: 'vertical',
        left: 20
    },
    series: [
        {
            name: '协议名',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center',
                formatter: '{b}:{d}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '20',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [{
                value: 348,
                name: 'DNS查询'
            },
            {
                value: 44,
                name: 'DNS响应'
            },
            {
                value: 12,
                name: 'HTTP请求'
            },
            {
                value: 2,
                name: 'HTTP响应'
            },
            {
                value: 153,
                name: 'HTTP'
            },
            {
                value: 22238,
                name: 'UDP'
            },
            {
                value: 167905,
                name: 'TCP'
            },
            {
                value: 0,
                name: 'FTP'
            },
            {
                value: 2,
                name: 'DHCP请求'
            },
            {
                value: 2,
                name: 'DHCP确认'
            },
            {
                value: 0,
                name: 'ICMP'
            },
            {
                value: 5396,
                name: 'ARP'
            }
            ]
        }
    ]
};
myChart1.setOption(option);
