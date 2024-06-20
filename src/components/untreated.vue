<template>
  <div>
    <div>
      <div style="padding: 10px 0">
        <el-input
          style="width: 300px"
          placeholder="请输入订单创建日期"
          suffix-icon="el-icon-search"
          v-model="createtime"
        ></el-input>
        <el-button class="ml-5" @click="load">搜索</el-button>
        <el-button class="ml-5" @click="reset">重置</el-button>
      </div>

      <div style="margin: 10px 0">
        <el-button type="danger" @click="overSelected()"
          >批量处理 <i class="el-icon-remove-outline"></i
        ></el-button>
      </div>

      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="oid"
          label="订单编号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="sum"
          label="订单总价"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="ostatus"
          label="状态"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="ocontent"
          label="订单内容"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="120"
        ></el-table-column>
        <el-table-column prop="cid" label="顾客id" width="120"></el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="overOrder(scope.row)"
              >完成<i class="el-icon-edit"></i
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
  name: "untreated",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      createtime: "",
      selectedOrders: [], // 选中的订单
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/selectbycreatetime", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            createtime: this.createtime,
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
      this.createtime = "";
      this.pageNum = 1;
      this.load();
    },

    overOrder(untreated) {
      this.$confirm("是否确认已完成该订单", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("http://localhost:8077/overOrder", {
              oid: untreated.oid,
              ostatus: "已完成", // 添加ostatus参数，设置为"已完成"
            //   ocontent: untreated.ocontent,
            //   createtime: untreated.createtime,
            //   overtime: untreated.overtime,
            //   ostatus: untreated.ostatus,
            //   remark: untreated.remark,
            //   sum: untreated.sum,
            //   cid: untreated.cid,
            })
            .then((res) => {
              if (res.data === "成功") {
                this.load();
                this.$message.success("已完成订单");
              } else {
                this.$message.error("处理失败");
              }
            })
            .catch((error) => {
              console.error("Error passing customer check:", error);
              this.$message.error("处理失败");
            });
        })
        .catch(() => {
          this.$message.info("取消处理");
        });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedOrders = val;
    },
    overSelected() {
      if (this.selectedOrders.length === 0) {
        this.$message.warning("请先选择要处理的订单");
        return;
      }
      this.$confirm("此操作将完成订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.selectedOrders.map((untreated) => untreated.oid);
          axios
            .post("http://localhost:8077/orderbatch", ids, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              if (res.data === 1) {
                this.load();
                this.$message.success("处理成功");
              } else {
                this.$message.error("处理失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting customers:", error);
              this.$message.error("处理失败");
            });
        })
        .catch(() => {
          this.$message.info("取消处理");
        });
    },
  },
};
</script>
