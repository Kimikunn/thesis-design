$.get('../public/csv/data.csv', function (data) {
    var myChart8 = echarts.init(document.getElementById('data8'));

    window.onresize = function () {
        myChart8.resize();
    };

    var sport = [];
    var fwin = [];
    var bwin = [];
    var dataTest = data.split('\r\n');
    for (var i = 1; i < dataTest.length - 1; i++) {
        var temp = dataTest[i].split(',');
        sport.push(temp[1]);
        fwin.push(temp[18]);
        bwin.push(temp[23]);
    }

    console.log(fwin);
    console.log(bwin);


    myChart8.hideLoading();
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
            }
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            data: ['Growth', '上行拥塞窗口均值', '下行拥塞窗口均值'],
            itemGap: 5
        },
        grid: {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                name: '目的端口',
                data: sport
            }
        ],
        yAxis: [
            {
                type: 'value',
            }
        ],
        dataZoom: [
            {
                show: true,
                start: 0,
                end: 5
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            }
        ],
        series: [
            {
                name: '上行拥塞窗口均值',
                type: 'bar',
                data: fwin
            },
            {
                name: '下行拥塞窗口均值',
                type: 'bar',
                data: bwin
            }
        ]
    };
    myChart8.setOption(option);
}
);