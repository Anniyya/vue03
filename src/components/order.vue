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
      :default-sort="{ prop: 'ostatus', order: 'descending' }"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="oid" label="订单编号" width="80"></el-table-column>
      <el-table-column
        prop="sum"
        label="订单总价"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column
        prop="createtime"
        label="下单时间"
        width="180"
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
      <el-table-column
        prop="way"
        label="用餐方式"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column prop="cid" label="顾客id" width="80"></el-table-column>
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
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="editForm.overtime"
            type="datetime"
            placeholder="选择完成订单时间"
            default-time="12:00:00"
          >
          </el-date-picker>
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
        <el-form-item label="用餐方式">
          <el-radio-group v-model="editForm.way">
            <el-radio label="堂食"></el-radio>
            <el-radio label="打包"></el-radio>
          </el-radio-group>
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
import moment from 'moment';

export default {
  name: "order",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      overtime: "",
      value3: "",
      editDialogVisible: false,
      editForm: {
        oid: "",
        cid: "",
        ocontent: "",
        ostatus: "",
        remark: "",
        way: "",
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
            console.log(ids);
            axios
              .post("http://localhost:8077/deleteorders", ids)
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
      this.editForm = { ...order };
      this.editDialogVisible = true;
    },
    updateOrder() {
      // 验证表单数据
      if (
        !this.editForm.oid ||
        !this.editForm.cid ||
        !this.editForm.ocontent ||
        !this.editForm.overtime ||
        !this.editForm.ostatus ||
        !this.editForm.sum
      ) {
        this.$message.error("请填写完整的订单信息");
        return;
      }
      // 将完成时间转换为 'YYYY-MM-DD HH:mm:ss' 格式
      const overtimeFormatted = moment(this.editForm.overtime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      axios
        .post("http://localhost:8077/updateorder", {
          oid: this.editForm.oid,
          ocontent: this.editForm.ocontent,
          createtime: this.editForm.createtime,
          overtime: overtimeFormatted,
          ostatus: this.editForm.ostatus,
          remark: this.editForm.remark,
          sum: this.editForm.sum,
          cid: this.editForm.cid,
          way: this.editForm.way,
        })
        .then((res) => {
          if (res.data === "成功") {
            this.load();
            this.$message.success("更新成功");
            this.editDialogVisible = false;
            this.loadOrders(); // 重新加载订单数据
          } else {
            this.$message.error("更新失败");
          }
        })
        .catch((error) => {
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
