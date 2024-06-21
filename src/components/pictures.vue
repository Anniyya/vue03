<template>
  <div>
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" :alt="`Image ${index + 1}`" />
      </el-carousel-item>
    </el-carousel>

    <el-button @click="openDialog">上传图片</el-button>

    <el-dialog :visible.sync="dialogVisible" title="上传图片">
      <el-form @submit.native.prevent="handleUpload">
        <el-form-item label="选择图片">
          <input type="file" @change="handleFileChange" accept="image/*" />
        </el-form-item>
        <el-form-item label="选择位置">
          <el-select v-model="selectedPosition" placeholder="请选择位置">
            <el-option
              v-for="n in 4"
              :key="n"
              :label="`第 ${n} 张`"
              :value="n - 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      images: [
        require("@/assets/image1.jpg"),
        require("@/assets/image2.jpg"),
        require("@/assets/image3.jpg"),
        require("@/assets/image4.jpg"),
      ],
      dialogVisible: false,
      selectedFile: null,
      selectedPosition: null,
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async submitForm() {
      if (this.selectedFile && this.selectedPosition !== null) {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("position", this.selectedPosition);

        try {
          const response = await axios.post("http://localhost:8077/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            this.images.splice(
              this.selectedPosition,
              1,
              `@/assets/image${this.selectedPosition + 1}.jpg`
            );
            this.dialogVisible = false;
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        } catch (error) {
          this.$message.error("图片上传失败");
        }
      } else {
        this.$message.error("请选择文件和位置");
      }
    },
  },
};
</script>

<style>
.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent; /* 清除背景色 */
}

.el-carousel__item img {
  width: 300px; /* 设置为正方形的宽度 */
  height: 300px; /* 设置为正方形的高度 */
  object-fit: cover; /* 保持图片比例，裁剪图片 */
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
