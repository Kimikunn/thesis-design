$.get('../public/csv/data.csv', function (data) {
    var myChart6 = echarts.init(document.getElementById('data6'));

    window.onresize = function () {
        myChart6.resize();
    };

    var time = [];
    var fpl = [];
    var bpl = [];
    var dataTest = data.split('\r\n');
    for (var i = 1; i < dataTest.length - 1; i++) {
        var temp = dataTest[i].split(',');
        time.push(temp[12]);
        fpl.push(temp[40]);
        bpl.push(temp[45]);
    }

    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 30,
            itemHeight: 2,
            itemGap: 13,
            orient: 'inside',
            data: ['上行速率', '下行速率'],
            right: '4%',
            textStyle: {
                fontSize: 12,
                color: '#666'
            },
            selectedMode: true
        },
        grid: {
            left: '4%',
            right: '14%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 0,
                end: 100,
                handleSize: 8
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 12,
                height: '70%',
                handleSize: 8,
                showDataShadow: false,
                left: '93%'
            }
        ],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#333333'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#e4e4e4'
                }
            },

            axisTick: {
                show: false
            },
            axisLabel: {
                formatter: '{value}'
            },
            data: time
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#333333'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                },
                interval: 0,
                formatter: '{value}'
            },
            splitLine: {
                lineStyle: {
                    color: '#e4e4e4'
                }
            },
        }],
        series: [{
            name: '上行速率',
            type: 'line',
            showSymbol: false,
            smooth: false,
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255, 142, 9, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(255, 142, 9, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: '#ff8d07'
                }
            },
            data: fpl
        }, {
            name: '下行速率',
            type: 'line',
            showSymbol: false,
            smooth: false,
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(19, 162, 252, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(19, 162, 252, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: '#029bfc'
                }
            },
            data: bpl
        },]
    };
    myChart6.setOption(option);
})
