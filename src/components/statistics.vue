<template>
  <div>
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  name: "Statistics",
  mounted() {
    // 使用axios获取后端数据
    axios
      .get("http://localhost:8077/completed-weekly")
      .then((response) => {
        const data = response.data; // 后端返回的数据，例如 [150, 230, 224, 218, 135, 147, 260]

        var option = {
          title: {
            text: "本周已完成订单量",
            subtext: "6.17 - 6.23",
            left: "center",
          },
          xAxis: {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 30,
          },
          series: [
            {
              data: data, // 将从后端获取的数据更新到这里
              type: "line", // 或者修改为"type: 'bar'"，根据需要选择折线图或柱状图
            },
            {
              data: data, // 同样将数据更新到第二个系列
              type: "bar",
            },
          ],
        };

        var chartDom = document.getElementById("main");
        var myChart = echarts.init(chartDom);
        myChart.setOption(option);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  },
};
</script>

<style>
/* 可以添加一些样式，例如设置图表容器的宽高等 */
</style>
