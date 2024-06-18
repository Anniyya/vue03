<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        style="width: 300px"
        placeholder="请输入用户名称"
        suffix-icon="el-icon-search"
        v-model="cname"
      ></el-input>
      <el-button class="ml-5" @click="load">搜索</el-button>
      <el-button class="ml-5" @click="reset">重置</el-button>
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
      <el-table-column prop="cname" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="csex" label="性别" width="120"> </el-table-column>
      <el-table-column prop="cbirth" label="生日" width="120">
      </el-table-column>
      <el-table-column prop="cphone" label="电话"> </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="success">编辑<i class="el-icon-edit"></i></el-button>
          <el-button type="danger"
            >删除<i class="el-icon-remove-outline"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "customer",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      cname: "",
    };
  },
  created() {
    // 请求分页查询数据
    this.load();
  },
  methods: {
    load() {
      // 请求分页查询数据
      fetch(
        "http://localhost:8077/selectbyname?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.pageSize +
          "&cname=" +
          this.cname
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
          this.total = res.total;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },
    reset() {
      this.cname = "";
      this.pageNum = 1;
      this.load();
    },
  },
};
</script>

<style>
.ml-5 {
  margin-left: 5px;
}
</style>
