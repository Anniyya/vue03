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
        <el-button type="danger" @click="deleteSelected"
          >批量删除 <i class="el-icon-remove-outline"></i
        ></el-button>
        <!-- <el-button type="primary" @click="exportData"
          >导出 <i class="el-icon-top"></i
        ></el-button> -->
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
            <el-button type="success" @click="openEditDialog(scope.row)"
              >编辑<i class="el-icon-edit"></i
            ></el-button>
            <el-button type="danger" @click="deleteCustomer(scope.row)"
              >删除<i class="el-icon-delete"></i
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

    <el-dialog :visible.sync="editDialogVisible" title="编辑客户信息">
      <el-form :model="editForm">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="editForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="editForm.csex"></el-input>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <el-input v-model="editForm.cbirth"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.cphone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateCustomer">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "customer",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      cname: "",
      editDialogVisible: false,
      editForm: {
        cid: "",
        cname: "",
        csex: "",
        cbirth: "",
        cphone: "",
      },
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
        .get("http://localhost:8077/selectbyname", {
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
    openEditDialog(customer) {
      this.editForm = { ...customer };
      this.editDialogVisible = true;
    },
    updateCustomer() {
      axios
        .post("http://localhost:8077/insertcustomer", this.editForm)
        .then((res) => {
          if (res.data === "成功") {
            this.load();
            this.$message.success("更新成功");
            this.editDialogVisible = false;
          } else {
            this.$message.error("更新失败");
          }
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
          this.$message.error("更新失败");
        });
    },
    deleteCustomer(customer) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
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
                this.$message.success("删除成功");
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting customer:", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedCustomers = val;
    },
    deleteSelected() {
      if (this.selectedCustomers.length === 0) {
        this.$message.warning("请先选择要删除的顾客");
        return;
      }
      this.$confirm("此操作将永久删除选中的用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.selectedCustomers.map((customer) => customer.cid);
          console.log(ids);
          axios
            .post("http://localhost:8077/deletebatch", ids, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log(res.data); // 打印响应数据
              if (res.data === 1) {
                this.load();
                this.$message.success("删除成功");
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting customers:", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },

    // exportData() {
    //   axios
    //     .get("http://localhost:8077/exportcustomers", {
    //       responseType: "blob",
    //     })
    //     .then((res) => {
    //       const blob = new Blob([res.data], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //       });
    //       const link = document.createElement("a");
    //       link.href = URL.createObjectURL(blob);
    //       link.download = "customers.xlsx";
    //       link.click();
    //       URL.revokeObjectURL(link.href);
    //       this.$message.success("导出成功");
    //     })
    //     .catch((error) => {
    //       console.error("Error exporting customers:", error);
    //       this.$message.error("导出失败");
    //     });
    // },
  },
};
</script>
