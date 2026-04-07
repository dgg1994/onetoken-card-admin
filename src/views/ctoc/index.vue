<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                @click="handleAdd"
                v-if="dataList.length <= 0"
                >新增</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column
            label="返佣比例类型"
            align="center"
            prop="brokerageRatesType"
          />
          <el-table-column
            label="返佣比例"
            align="center"
            prop="brokerageRates"
          />
          <el-table-column label="修改时间" align="center" prop="gmtModified" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加或修改用户配置对话框 -->
        <el-dialog
          :title="title"
          :visible.sync="dialogOpen"
          width="30%"
          :close-on-click-modal="false"
          append-to-body
        >
          <el-form
            ref="formData"
            :model="formData"
            :rules="rules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="返佣比例" prop="brokerageRates">
                  <el-input
                    v-model="formData.brokerageRates"
                    placeholder="请输入返佣比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" v-debounce
              >确 定</el-button
            >
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sysBrokerageRatesAdd,
  sysBrokerageRatesFindAll,
  sysBrokerageRatesUpdatel,
} from "@/api/channel/index";
export default {
  name: "typesOfPoints",
  components: {},
  data() {
    return {
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      dialogOpen: false,
      loading: true,
      formData: {},
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {
        brokerageRates: [
          { required: true, message: "请输入返佣比例", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      sysBrokerageRatesFindAll(this.queryParams).then((res) => {
        console.log("获取到数据res.data.list", res);
        this.dataList = res.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.upState = false;
      this.reset();
    },

    handleClose() {
      this.dialogOpen = false;
      this.upState = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.logoURL = [];
      this.formData = {};
      this.resetForm("form");
    },
    resetQuery() {
      this.queryParams = {};
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNumber = 1;
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      (this.upState = false), (this.dialogOpen = true);
      this.title = "添加";
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.logoURL = row.imgUrl;
      this.formData = JSON.parse(JSON.stringify(row));
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            //编辑
            sysBrokerageRatesUpdatel(this.formData).then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess("修改成功");
                this.dialogOpen = false;
                this.getList();
              } else {
                this.$modal.msgError("修改失败");
                this.dialogOpen = false;
                this.getList();
              }
            });
          } else {
            //新增
            sysBrokerageRatesAdd(this.formData).then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess("新增成功");
                this.dialogOpen = false;
                this.getList();
              } else {
                this.$modal.msgError("新增失败");
                this.dialogOpen = false;
                this.getList();
              }
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return iosGoodsDelete(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
.mainBox {
  height: calc(100vh - 84px);
  overflow-y: auto;
  background-color: #efefef;
}

.flex_sb {
  display: flex;
  justify-content: space-between;
}

.app-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.conetntBox {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}
</style>
