<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        style="width: 300px"
        placeholder="请输入用户名称"
        suffix-icon="el-icon-search"
      ></el-input>
      <el-button class="ml-5">搜索</el-button>
      <el-button class="ml-5">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary"
        >新增 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <el-button type="danger"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>
      <el-button type="primary">导出 <i class="el-icon-top"></i></el-button>
    </div>

    <el-table :data="tableData">
      <el-table-column prop="cid" label="账号" width="120"> </el-table-column>
      <el-table-column prop="cpwd" label="密码" width="120"> </el-table-column>
      <el-table-column prop="cname" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="csex" label="性别" width="120"> </el-table-column>
      <el-table-column prop="cbirth" label="生日" width="120">
      </el-table-column>
      <el-table-column prop="cphone" label="电话"> </el-table-column>
      <el-table-column prop="operate" label="操作">
        <templates slot-scope="scope">
          <el-button type="success">编辑<i class="el-icon-edit"></i></el-button>
          <el-button type="danger"
            >删除<i class="el-icon-remove-outline"></i
          ></el-button>
        </templates>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style></style>

<script>
import router from "@/router/route";
import axios from "axios";
import { RouterLink } from "vue-router";
export default {
  data() {
    const item = {};
    return {
      tableData: Array(10).fill(item),
    };
  },
  created: function () {
    axios.get("http://localhost:8077/findcustomer").then((response) => {
      this.tableData = response.data;
    });
  },
};
</script>
