<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        style="width: 300px"
        placeholder="请输入留言内容"
        suffix-icon="el-icon-search"
        v-model="rcontent"
      ></el-input>
      <el-button class="ml-5" @click="load">搜索</el-button>
      <el-button class="ml-5" @click="reset">重置</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="留言编号">
                <span>{{ props.row.rid }}</span>
              </el-form-item>
              <el-form-item label="用户ID">
                <span>{{ props.row.cid }}</span>
              </el-form-item>
              <el-form-item label="用户评分">
                <el-rate
                  :value="getStarCount(props.row.rscore)"
                  disabled
                  text-color="#ff9900"
                  score-template="{value}"
                  style="padding-top: 6px;"
                >
                </el-rate>
              </el-form-item>
              <el-form-item label="留言时间">
                <span>{{ props.row.rtime }}</span>
              </el-form-item>
              <el-form-item label="留言内容">
                <span>{{ props.row.rcontent }}</span>
              </el-form-item>
              <el-form-item label="反馈情况">
                <span @click="openDrawer(props.row.rid)"> 点我打开 </span>
                <el-drawer
                  title="反馈情况"
                  :visible.sync="drawer"
                  :with-header="false"
                >
                  <el-card
                    v-for="reply in sortedReplies"
                    :key="reply.pid"
                    class="box-card"
                    :style="{
                      backgroundColor: reply.cid === null ? '#FFFACD' : '',
                    }"
                  >
                    <div slot="header" class="clearfix">
                      <span>{{
                        reply.cid === null
                          ? "商家回复"
                          : reply.aid === null
                          ? reply.cid
                          : ""
                      }}</span>
                    </div>
                    <div class="text item" style="margin: 0px;">{{ reply.pcontent }}</div>
                    <div class="text item" style="color: #707070;font-size: x-small">{{ reply.ptime }}</div>
                  </el-card>
                </el-drawer>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="留言编号" prop="rid" width="80">
        </el-table-column>
        <el-table-column label="用户ID" prop="cid" width="120">
        </el-table-column>
        <el-table-column label="用户评分" prop="rscore" width="130">
        </el-table-column>
        <el-table-column label="留言时间" prop="rtime" width="130">
        </el-table-column>
        <el-table-column label="留言内容" prop="rcontent"> </el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="openReplyDialog(scope.row)"
              >回复<i class="el-icon-edit"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <el-dialog :visible.sync="replyDialogVisible" title="回复留言">
      <el-form :model="replyForm" label-width="100px">
        <el-form-item label="留言id">
          <el-input v-model="replyForm.rid" disabled></el-input>
        </el-form-item>
        <el-form-item label="顾客id">
          <el-input v-model="replyForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="留言内容">
          <el-input
            type="textarea"
            v-model="replyForm.rcontent"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="留言时间">
          <el-input v-model="replyForm.rtime" disabled></el-input>
        </el-form-item>
        <el-form-item label="回复">
          <el-input type="textarea" v-model="replyForm.pcontent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertReply">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "review",
  data() {
    return {
      drawer: false,
      value: 3.7,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      rcontent: "",
      tableData: [],
      replies: [], // 存储回复内容
      replyDialogVisible: false,
      replyForm: {
        rid: "",
        cid: "",
        rcontent: "",
        rtime: "",
        pcontent: "",
      },
    };
  },
  methods: {
    load() {
      axios
        .get("http://localhost:8077/selectAllReviewByPage", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rcontent: this.rcontent,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.map((item) => {
            item.rscore = Number(item.rscore);
            return item;
          });
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
      this.rcontent = "";
      this.pageNum = 1;
      this.load();
    },
    openReplyDialog(review) {
      this.replyDialogVisible = true;
      this.replyForm.rid = review.rid;
      this.replyForm.cid = review.cid;
      this.replyForm.rcontent = review.rcontent;
      this.replyForm.rtime = review.rtime;
    },
    insertReply() {
      // 发送更新请求，更新回复内容
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1并确保两位数
      const day = String(today.getDate()).padStart(2, "0");

      const currentDate = `${year}-${month}-${day}`;
      axios
        .post("http://localhost:8077/insertReply", {
          rid: this.replyForm.rid,
          aid: "admin1",
          ptime: currentDate,
          pcontent: this.replyForm.pcontent,
        })
        .then((res) => {
          this.replyDialogVisible = false;
          if (res.data) {
            this.load();
            this.$message.success("回复成功，可在反馈情况里查看");
            this.editDialogVisible = false;
          } else {
            this.$message.error("回复失败");
          }
          this.load(); // 重新加载数据
        })
        .catch((error) => {
          console.error("Error updating reply:", error);
        });
    },
    openDrawer(rid) {
      axios
        .get("http://localhost:8077/selectAllReplyByRid", {
          params: {
            rid: rid,
          },
        })
        .then((response) => {
          const replies = response.data;
          const nullCidReplies = replies.filter((reply) => reply.cid === null);
          const nonNullCidReplies = replies.filter(
            (reply) => reply.cid !== null
          );
          this.replies = [...nullCidReplies, ...nonNullCidReplies];
          this.drawer = true;
        })
        .catch((error) => {
          console.error("获取回复内容失败:", error);
        });
    },
    getStarCount(rscore) {
      switch (rscore) {
        case 0:
          return 1;
        case 25:
          return 2;
        case 50:
          return 3;
        case 75:
          return 4;
        case 100:
          return 5;
        default:
          return 0;
      }
    },
  },
  mounted() {
    this.load();
  },
  computed: {
    sortedReplies() {
      const nullCidReplies = this.replies.filter((reply) => reply.cid === null);
      const nonNullCidReplies = this.replies.filter(
        (reply) => reply.cid !== null
      );
      return [...nullCidReplies, ...nonNullCidReplies];
    },
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 60%;
}
.line {
  text-align: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  font-size: small;
  height: 200px;
  width: 420px;
  margin-bottom: 5px;
}
</style>
