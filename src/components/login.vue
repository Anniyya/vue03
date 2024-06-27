<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px" class="login-form">
      <h2 class="form-title">管理员登录</h2>
      <el-form-item label="管理员ID">
        <el-input v-model="form.aid" placeholder="请输入管理员ID"></el-input>
      </el-form-item>
      <el-form-item label="管理员密码">
        <el-input
          v-model="form.pwd"
          type="password"
          placeholder="请输入管理员密码"
        ></el-input>
      </el-form-item>

      <el-form-item class="form-button">
        <el-button type="primary" @click="onSubmit">立即登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      form: {
        aid: "",
        pwd: "",
      },
      loginMessage: "",
    };
  },
  methods: {
    onSubmit() {
      axios
        .get("http://localhost:8077/admin/findadminbyaidpwd", {
          params: {
            aid: this.form.aid,
            apwd: this.form.pwd,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.loginMessage = res.data.msg;

          if (this.loginMessage === "查询成功") {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("admin", JSON.stringify(res.data.admin));
            this.$router.push("/statistics");
          } else {
            alert("登录失败，请重试");
          }
        })
        .catch((error) => {
          console.error("登录请求出错:", error);
          alert("登录失败，请重试");
        });
    },
    resetForm() {
      this.form.aid = "";
      this.form.pwd = "";
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  width: 400px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form-button {
  text-align: center;
  margin-top: 20px;
}
</style>
