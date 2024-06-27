<template>
  <div>
    <div id="numbers-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="value2"
              :title="title"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="男女比">
              <template slot="formatter"> 456/2 </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic
              group-separator=","
              :precision="2"
              decimal-separator="."
              :value="value1"
              :title="title"
            >
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: red"></i>
              </template>
              <template slot="suffix">
                <i class="el-icon-s-flag" style="color: blue"></i>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic :value="like ? 521 : 520" title="Feedback">
              <template slot="suffix">
                <span @click="like = !like" class="like">
                  <i
                    class="el-icon-star-on"
                    style="color: red"
                    v-show="!!like"
                  ></i>
                  <i class="el-icon-star-off" v-show="!like"></i>
                </span>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      id="charts-container"
      style="display: flex; justify-content: space-around; width: 100%"
    >
      <div id="main" style="width: 600px; height: 400px"></div>
      <div id="pie" style="width: 600px; height: 400px"></div>
      <!-- 添加饼图的容器 -->
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  name: "Statistics",
  data() {
    return {
      like: true,
      value1: 4154.564,
      value2: 1314,
      title: "增长人数",
    };
  },
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

        // 添加饼图
        var pieDom = document.getElementById("pie");
        var pieChart = echarts.init(pieDom);
        var pieOption = {
          title: {
            text: "Referer of a Website",
            subtext: "Fake Data",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "50%",
              data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };

        pieChart.setOption(pieOption);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  },
};
</script>

<style>
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>
