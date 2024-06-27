<template>
  <div>
    <div style="margin: 10px 0">
      <el-button type="danger" @click="deleteSelectedPictures()">
        批量删除 <i class="el-icon-remove-outline"></i>
      </el-button>
      <el-button type="success" @click="showAddDialog = true">
        增加图片<i class="el-icon-edit"></i>
      </el-button>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="picid"
        label="图片编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="picname"
        label="图片名称"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="url"
        label="图片预览"
        width="180"
        scoped-slot="scope"
      >
        <template v-slot="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="`http://localhost:8077${scope.row.url}`"
            :preview-src-list="[`http://localhost:8077${scope.row.url}`]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="播放顺序"
        width="120"
      ></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="editPicture(scope.row)">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" @click="deletePicture(scope.row)">
            删除<i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加图片" :visible.sync="showAddDialog">
      <el-form :model="pictureForm">
        <el-form-item label="图片名称">
          <el-input v-model="pictureForm.picname"></el-input>
        </el-form-item>
        <el-form-item label="播放顺序">
          <el-select v-model="pictureForm.number" placeholder="请选择">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :data="uploadData"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :show-file-list="false"
          >
            <img v-if="uploadUrl" :src="uploadUrl" class="avatar" />
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddPicture">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑图片" :visible.sync="showEditDialog">
      <el-form :model="pictureForm">
        <el-form-item label="图片编号">
          <el-input v-model="pictureForm.picid" disabled></el-input>
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="pictureForm.picname"></el-input>
        </el-form-item>
        <el-form-item label="播放顺序">
          <el-select v-model="pictureForm.number" placeholder="请选择">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEditPicture">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "pictures",
  data() {
    return {
      tableData: [],
      total: 0,
      picid: "",
      selectedPictures: [], // 选中的图片
      showAddDialog: false,
      showEditDialog: false,
      pictureForm: {
        picid: "",
        picname: "",
        url: "",
        number: "",
      },
    };
  },
  computed: {
    uploadUrl() {
      return "http://localhost:8077/pictures/upload";
    },
    uploadData() {
      return { picname: this.pictureForm.picname };
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/pictures/all")
        .then((res) => {
          this.tableData = res.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    reset() {
      this.picid = "";
    },
    handleSelectionChange(val) {
      this.selectedPictures = val;
    },
    deleteSelectedPictures() {
      if (this.selectedPictures.length === 0) {
        this.$message.warning("请先选择要删除的图片");
        return;
      }
      this.$confirm("此操作将彻底删除图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.selectedPictures.map((picture) => picture.picid);
          axios
            .post("http://localhost:8077/pictures/deleteSelected", ids, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              if (res.data === "成功") {
                this.load();
                this.$message.success("删除成功");
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting pictures:", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    deletePicture(picid) {
      this.$confirm("此操作将彻底删除图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("http://localhost:8077/pictures/delete", { picid: picid })
            .then((res) => {
              if (res.data === "成功") {
                this.load();
                this.$message.success("删除成功");
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((error) => {
              console.error("Error deleting picture:", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    addPicture() {
      this.pictureForm = {
        picid: "",
        picname: "",
        url: "",
        number: "",
      };
      this.showAddDialog = true;
    },
    handleUploadSuccess(response, file, fileList) {
      this.pictureForm.url = response.url; // 后端返回图片的相对路径
      this.$forceUpdate();
      this.$message.success("图片上传成功");
    },
    handleUploadError(err, file, fileList) {
      this.$message.error("图片上传失败");
    },
    submitAddPicture() {
      axios
        .post("http://localhost:8077/pictures/add", this.pictureForm)
        .then((res) => {
          if (res.data === "成功") {
            this.load();
            this.$message.success("添加成功");
            this.showAddDialog = false;
          } else {
            this.$message.error("添加失败");
          }
        })
        .catch((error) => {
          console.error("Error adding picture:", error);
          this.$message.error("添加失败");
        });
    },
    editPicture(row) {
      this.pictureForm = { ...row };
      this.showEditDialog = true;
    },
    submitEditPicture() {
      axios
        .post("http://localhost:8077/pictures/edit", this.pictureForm)
        .then((res) => {
          if (res.data === "成功") {
            this.load();
            this.$message.success("编辑成功");
            this.showEditDialog = false;
          } else {
            this.$message.error("编辑失败");
          }
        })
        .catch((error) => {
          console.error("Error editing picture:", error);
          this.$message.error("编辑失败");
        });
    },
  },
};
</script>
