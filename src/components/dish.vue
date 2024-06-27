<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        v-model="type"
        style="width: 300px;margin-right: 10px;"
        placeholder="请输入菜品类型"
        suffix-icon="el-icon-search"
      ></el-input>
      <el-input
        v-model="dishName1"
        style="width: 300px;margin-right: 10px;"
        placeholder="请输入菜品名称"
        suffix-icon="el-icon-search"
      ></el-input>
      <el-button class="ml-5" @click="load">搜索</el-button>

      <el-button class="ml-5" @click="reset">重置</el-button>
    </div>

    <div>
      <el-button class="ml-5" @click="handleAdd" type="primary">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
    </div>

    <div>
      <el-table :data="tableData" style="width: 100%" max-height="250">
        <el-table-column prop="type" label="种类" width="120"></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="dishName"
          label="菜品名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="picture"
          label="菜品图片"
          width="120"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" type="success"
              >编辑 <i class="el-icon-edit"></i></el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.dishName)"
              >删除 <i class="el-icon-delete"></i></el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <div>
      <el-dialog
        title="新增菜品信息"
        :visible.sync="dialogFormVisible"
        width="30%"
      >
        <el-form :model="form" label-width="80px">
          <el-form-item label="菜品分类">
            <el-input v-model="form.type" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜品价格">
            <el-input v-model="form.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜品规格">
            <el-input
              v-model="form.specification"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜品名称">
            <el-input v-model="form.dishName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜品图片">
            <el-input v-model="form.picture" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="load">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "dish",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      dishName1: "",
      type: "",
      form: {},
      dialogFormVisible: false,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/dish/select", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            dishName: this.dishName1,
            type: this.type,
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.dialogFormVisible = false;
        });
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum);
      this.pageNum = pageNum;
      this.load();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;
    },
    reset() {
      this.dishName1 = "";
      this.type = "";
      this.load();
    },
    save() {
      axios
        .post("http://localhost:8077/dish/insertdish", this.form)
        .then((res) => {
          if (res.data) {
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
            this.load();
          } else {
            this.$message.error("保存失败");
          }
        });
    },
    handleDelete(dishName) {
      this.$confirm("此操作将永久删除此菜品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .get("http://localhost:8077/dish/deletedish", {
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
