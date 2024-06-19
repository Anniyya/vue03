<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside
        width="200px"
        style="background-color: rgb(238, 241, 246); height: 100%"
      >
        <el-menu
          style="height: 100%; overflow-x: hidden"
          background-color="rgb(48,65,86)"
          text-color="#fff"
          active-text-color="yellow"
          router
        >
          <div style="height: 60px; line-height: 60px; text-align: center">
            <b style="color: white">商家后台管理</b>
          </div>
          <el-menu-item router index="/statistics">
            <template slot="title"
              ><i class="el-icon-pie-chart"></i>销量统计</template
            >
          </el-menu-item>
          <el-menu-item router index="/pictures">
            <template slot="title"
              ><i class="el-icon-picture-outline"></i>轮播图管理</template
            >
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-food"></i>菜品管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/dish">菜品总览</el-menu-item>
              <el-menu-item index="/category">类目管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-user"></i>用户管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/customer">用户总览</el-menu-item>
              <el-menu-item index="/check">注册审核</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="el-icon-shopping-cart-2"></i>订单管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/order">订单总览</el-menu-item>
              <el-menu-item index="/untreated">未处理订单</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          style="
            text-align: right;
            font-size: 12px;
            border-bottom: 1px solid #ccc;
            line-height: 60px;
          "
        >
          <el-dropdown>
            <i class="el-icon-user-solid" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>你好, csy</span>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
</script>
