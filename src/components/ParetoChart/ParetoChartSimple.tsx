import './style.scss';
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

/** 简化版帕雷托图组件 */
export default function ParetoChartSimple(props: { bgColor: string }) {
  // 图表实例引用
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      window.addEventListener('resize', () => chartInstance.current?.resize());

      // 模拟数据
      const sortedData = [10, 8, 6, 4, 2];
      const total = sortedData.reduce((sum, val) => sum + val, 0);
      let cumulative = 0;
      const cumulativeData = sortedData.map(value => {
        cumulative += value;
        return (cumulative / total) * 100;
      });

      // 设置图表选项
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['数值', '累计百分比']
        },
        xAxis: {
          type: 'category',
          data: sortedData.map((_, i) => `项目${i + 1}`)
        },
        yAxis: [
          {
            type: 'value',
            name: '数值',
            axisLabel: { formatter: '{value}' }
          },
          {
            type: 'value',
            name: '百分比',
            min: 0,
            max: 100,
            axisLabel: { formatter: '{value}%' }
          }
        ],
        series: [
          {
            name: '数值',
            type: 'bar',
            data: sortedData
          },
          {
            name: '累计百分比',
            type: 'line',
            yAxisIndex: 1,
            data: cumulativeData
          }
        ]
      };

      chartInstance.current.setOption(option);
    }
    return () => {
      chartInstance.current?.dispose();
      window.removeEventListener('resize', () => chartInstance.current?.resize());
    };
  }, []);

  return (
    <main style={{backgroundColor: props.bgColor}} className='main'>
      <div 
        ref={chartRef} 
        className='content'
        style={{ width: '100%', height: '400px' }}
      />
    </main>
  );
}