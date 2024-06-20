<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        style="width: 300px"
        placeholder="请输入订单完成时间"
        suffix-icon="el-icon-search"
        v-model="overtime"
      ></el-input>
      <el-button class="ml-5" @click="load">搜索</el-button>
      <el-button class="ml-5" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="danger" @click="deleteSelected()">
        批量删除 <i class="el-icon-remove-outline"></i>
      </el-button>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
       :default-sort = "{prop: 'ostatus', order: 'descending'}"
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
        sortable
      ></el-table-column>
      <el-table-column
        prop="overtime"
        label="完成时间"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="ostatus"
        label="状态"
        width="120"
        sortable
      ></el-table-column>
      <el-table-column
        prop="ocontent"
        label="订单内容"
        width="120"
      ></el-table-column>
      <el-table-column prop="remark" label="备注" width="120"></el-table-column>
      <el-table-column prop="cid" label="顾客id" width="120"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="openEditDialog(scope.row)">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" @click="deleteOrder(scope.row)">
            删除<i class="el-icon-delete"></i>
          </el-button>
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

    <el-dialog :visible.sync="editDialogVisible" title="编辑订单信息">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="editForm.oid" disabled></el-input>
        </el-form-item>
        <el-form-item label="顾客id">
          <el-input v-model="editForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单内容">
          <el-input type="textarea" v-model="editForm.ocontent"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-row>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                v-model="editForm.date2"
                style="width: 100%"
              ></el-time-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio-group v-model="editForm.ostatus">
            <el-radio label="已完成"></el-radio>
            <el-radio label="已取消"></el-radio>
            <el-radio label="处理中"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="总价">
          <el-input v-model="editForm.sum"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateOrder()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "order",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      overtime: "",
      editDialogVisible: false,
      editForm: {
        oid: "",
        cid: "",
        ocontent: "",
        date1: "",
        date2: "",
        ostatus: "",
        remark: "",
        sum: "",
      },
      formLabelWidth: "120px",
      selectedOrders: [], // 选中的订单
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/selectbyovertime", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            overtime: this.overtime,
          },
        })
        .then((res) => {
          if (res.data && res.data.data) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            console.error("Unexpected response format:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$message.error("加载数据失败");
        });
    },
    reset() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.overtime = "";
      this.load();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.load();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.load();
    },
    handleSelectionChange(val) {
      this.selectedOrders = val;
    },
    deleteSelected() {
      if (this.selectedOrders.length > 0) {
        this.$confirm("此操作将永久删除选中的订单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const ids = this.selectedOrders.map((order) => order.oid);
            console.log(ids)
            axios
              .post("http://localhost:8077/deleteorders",ids)
              .then((res) => {
                if (res.data === 1) {
                  this.load();
                  this.$message.success("删除成功");
                } else {
                  this.$message.error("删除失败");
                }
              })
              .catch((error) => {
                console.error("Error deleting orders:", error);
                this.$message.error("删除失败");
              });
          })
          .catch(() => {
            this.$message.info("取消删除");
          });
      }
    },
    openEditDialog(order) {
      const [date, time] = order.overtime.split(" ");
      const date1 = date; // 只取日期部分
      const date2 = time; // 只取时间部分

      this.editForm = {
        ...order,
        date1: date1,
        date2: time,
      };
      this.editDialogVisible = true;
    },
    updateOrder() {
      const { date1, date2 } = this.editForm;
      // 确保date2仅包含时间部分
      const time = new Date(date2).toTimeString().split(" ")[0];
      this.editForm.overtime = `${date1} ${time}`;
      axios
        .post("http://localhost:8077/updateorder", this.editForm)
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
          console.error("Error updating order:", error);
          this.$message.error("更新失败");
        });
    },

    deleteOrder(order) {
      this.$confirm("此操作将永久删除此订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .get("http://localhost:8077/deleteorderbyoid", {
              params: {
                oid: order.oid,
              },
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
              console.error("Error deleting order:", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
