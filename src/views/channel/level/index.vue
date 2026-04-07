<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button @click="resetQuery">刷新</el-button>
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
          <el-table-column label="等级名称" align="center" prop="levelName" />
          <el-table-column label="等级级别" align="center" prop="levelNo" />
          <el-table-column label="预存费用" align="center" prop="prepaidFees" />
          <el-table-column
            label="直属下级佣金比例"
            align="center"
            prop="directlyRatesFee"
          />
          <el-table-column
            label="一级佣金比例"
            align="center"
            prop="ratesFee"
          />
          <el-table-column
            label="二级佣金比例"
            align="center"
            prop="twoRatesFee"
          />
          <el-table-column
            label="三级佣金比例"
            align="center"
            prop="threeRatesFee"
          />
          <el-table-column
            label="开卡扣除费用"
            align="center"
            prop="openFees"
          />
          <el-table-column
            label="等级介绍"
            align="center"
            prop="levelInfo"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="创建时间" align="center" prop="setTime" />
          <!-- <el-table-column label="状态" align="center" prop="applyState" /> -->
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
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

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
            label-width="auto"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="等级名称" prop="levelName">
                  <el-input
                    v-model="formData.levelName"
                    placeholder="请输入等级名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="等级级别" prop="levelNo">
                  <el-input-number
                    style="width: 100%"
                    v-model="formData.levelNo"
                    :min="1"
                    placeholder="请输入等级级别"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="预存费用" prop="prepaidFees">
                  <el-input
                    v-model="formData.prepaidFees"
                    placeholder="请输入预存费用"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="直属下级佣金比例" prop="directlyRatesFee">
                  <el-input
                    v-model="formData.directlyRatesFee"
                    placeholder="请输入佣金比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="一级返佣比例" prop="ratesFee">
                  <el-input
                    v-model="formData.ratesFee"
                    placeholder="请输入佣金比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="二级返佣比例" prop="twoRatesFee">
                  <el-input
                    v-model="formData.twoRatesFee"
                    placeholder="请输入佣金比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="三级返佣比例" prop="threeRatesFee">
                  <el-input
                    v-model="formData.threeRatesFee"
                    placeholder="请输入佣金比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="开卡扣除费用" prop="openFees">
                  <el-input
                    v-model="formData.openFees"
                    placeholder="请输入开卡扣除费用"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="等级介绍" prop="levelInfo">
                  <el-input
                    type="textarea"
                    rows="4"
                    v-model="formData.levelInfo"
                    placeholder="请输入等级介绍"
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
  channelLevelAdd,
  channelLevelUpdate,
  channelLevelFindList,
  channelLevelDelete,
} from "@/api/channel/index";
export default {
  name: "typesOfPoints",
  components: {},
  data() {
    return {
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      dialogOpen: false,
      loading: true,
      formData: {},
      upState: false,
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },

      // 表单校验
      rules: {
        levelName: [
          { required: true, message: "请输入等级名称", trigger: "blur" },
        ],
        levelNo: [
          { required: true, message: "请输入等级级别", trigger: ["blur","change"] },
        ],
        prepaidFees: [
          { required: true, message: "请输入预存费用", trigger: "blur" },
        ],
        ratesFee: [
          { required: true, message: "请输入佣金比例", trigger: "blur" },
        ],
        twoRatesFee: [
          { required: true, message: "请输入佣金比例", trigger: "blur" },
        ],
        threeRatesFee: [
          { required: true, message: "请输入佣金比例", trigger: "blur" },
        ],
        directlyRatesFee: [
          { required: true, message: "请输入佣金比例", trigger: "blur" },
        ],
        openFees: [
          { required: true, message: "请输入开卡扣除费用", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      channelLevelFindList(this.queryParams).then((res) => {
        this.dataList = res.data.list;
        this.total = res.data.total;
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
      this.resetForm("formData");
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
            channelLevelUpdate(this.formData).then((res) => {
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
            channelLevelAdd(this.formData).then((res) => {
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
          return channelLevelDelete({ id: row.id });
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
