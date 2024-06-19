<template>
  <div>
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
        <el-button type="primary" @click="passSelected"
          >批量通过 <i class="el-icon-circle-check"></i
        ></el-button>
      </div>
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cid" label="账号" width="120"></el-table-column>
        <el-table-column
          prop="cname"
          label="姓名"
          width="120"
        ></el-table-column>
        <el-table-column prop="csex" label="性别" width="120"></el-table-column>
        <el-table-column
          prop="cbirth"
          label="生日"
          width="120"
        ></el-table-column>
        <el-table-column prop="cphone" label="电话"></el-table-column>
        <el-table-column prop="cstatus" label="审核状态"></el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="passCheck(scope.row)"
              >通过<i class="el-icon-circle-check"></i
            ></el-button>
            <el-button type="danger" @click="deleteCheck(scope.row)"
              >驳回<i class="el-icon-circle-close"></i
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "check",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      cstatus: "",
      cname: "",
      formLabelWidth: "120px",
      selectedCustomers: [], // 选中的客户
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/selectbyname2", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            cname: this.cname,
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total;
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
    handleSelectionChange(val) {
      console.log(val);
      this.selectedCustomers = val;
    },
    deleteCheck(customer) {
      this.$confirm("此操作将驳回该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .get("http://localhost:8077/deletecustomer", {
              params: { cid: customer.cid },
            })
            .then((res) => {
              if (res.data === 1) {
                this.load();
                this.$message.success("驳回成功");
              } else {
                this.$message.error("驳回失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting customer:", error);
              this.$message.error("驳回失败");
            });
        })
        .catch(() => {
          this.$message.info("取消驳回");
        });
    },
    passCheck(customer) {
      this.$confirm("是否确认通过审核", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("http://localhost:8077/insertcustomer", {
              cid: customer.cid,
              cstatus: "已通过", // 添加cstatus参数，设置为"已通过"
              cname: customer.cname,
              csex: customer.csex,
              cbirth: customer.cbirth,
              cphone: customer.cphone,
            })
            .then((res) => {
              if (res.data === "成功") {
                this.load();
                this.$message.success("审核通过成功");
              } else {
                this.$message.error("审核失败");
              }
            })
            .catch((error) => {
              console.error("Error passing customer check:", error);
              this.$message.error("审核失败");
            });
        })
        .catch(() => {
          this.$message.info("取消审核");
        });
    },
    passSelected() {
      if (this.selectedCustomers.length === 0) {
        this.$message.warning("请先选择要通过审核的顾客");
        return;
      }
      this.$confirm("此操作将审核通过用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.selectedCustomers.map((customer) => customer.cid);
          console.log(ids);
          axios
            .post("http://localhost:8077/checkbatch", ids, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log(res.data); // 打印响应数据
              if (res.data === 1) {
                this.load();
                this.$message.success("通过审核成功");
              } else {
                this.$message.error("通过审核失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting customers:", error);
              this.$message.error("通过审核失败");
            });
        })
        .catch(() => {
          this.$message.info("取消审核");
        });
    },
  },
};
</script>
