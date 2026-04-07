<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form
            :model="queryParams"
            size="small"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="" prop="cardType">
              <el-select
                v-model="queryParams.cardType"
                filterable
                placeholder="请选择卡片类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in cardTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="卡片ID" align="center" prop="cardId" />

          <el-table-column label="卡片名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.cardEntity.title }}
            </template>
          </el-table-column>
          <el-table-column label="封面图(详情)" align="center" width="180">
            <template slot-scope="scope">
              <div
                style="
                  width: 90%;
                  height: 80px;
                  overflow: hidden;
                  cursor: pointer;
                "
              >
                <img
                  :src="scope.row.cardEntity.img"
                  alt="图片"
                  style="width: 100%; height: 100%; object-fit: contain"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="封面图(列表)" align="center" width="180">
            <template slot-scope="scope">
              <div
                style="
                  width: 90%;
                  height: 80px;
                  overflow: hidden;
                  cursor: pointer;
                "
              >
                <img
                  :src="scope.row.cardEntity.listImg"
                  alt="图片"
                  style="width: 100%; height: 100%; object-fit: contain"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="卡片性质" align="center">
            <template slot-scope="scope">
              {{ scope.row.cardEntity.bankCardNature }}
            </template>
          </el-table-column>
          <el-table-column label="卡片类型" align="center"
            ><template slot-scope="scope">
              {{ scope.row.cardEntity.bankCardType }}
            </template>
          </el-table-column>
          <el-table-column label="开卡费用" align="center" prop="openFee" />
          <el-table-column label="充值手续费率" align="center" prop="ratesFee">
            <template slot-scope="scope">
              {{ scope.row.cardEntity.rechargeFee }}
            </template>
          </el-table-column>
          <el-table-column label="渠道商" align="center" prop="username" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.cardEntity.bankCardNature == 'VIRTUAL'"
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
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
          width="500px"
          :close-on-click-modal="false"
          @close="handleClose"
          append-to-body
        >
          <el-form
            ref="formData"
            :model="formData"
            :rules="rules"
            label-width="auto"
          >
            <el-row>
              <el-col>
                <el-form-item label="卡名称">
                  <el-input readOnly v-model="formData.title" />
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="开卡费用" prop="openFee">
                  <el-input
                    v-model="formData.openFee"
                    placeholder="请输入开卡费用"
                  />
                </el-form-item>
              </el-col>
              <!-- 
              <el-col>
                <el-form-item label="充值手续费率" prop="ratesFee">
                  <el-input
                    v-model="formData.ratesFee"
                    placeholder="请输入充值手续费率"
                  />
                </el-form-item>
              </el-col> -->
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
import { mapState } from "vuex";
import { channelCardFindAll, channelCardUpdate } from "@/api/channel/index";
export default {
  name: "typesOfPoints",

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
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      cardTypeList: [
        {
          id: "PHYSICAL",
          name: "实体卡",
        },
        {
          id: "VIRTUAL",
          name: "虚拟卡",
        },
      ],

      // 表单校验
      rules: {
        openFee: [
          { required: true, message: "请填写开卡费用", trigger: "blur" },
        ],

        ratesFee: [
          { required: true, message: "请填写手续费费率", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    hasChannel() {
      const { roles } = this.userInfo;
      return roles.includes("channel");
    },
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { roles } = this.userInfo;
      if (roles.includes("channel")) {
        this.queryParams = {
          ...this.queryParams,
          channelId: this.userInfo.id,
        };
      }
      channelCardFindAll(this.queryParams).then((res) => {
        this.dataList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.reset();
    },

    handleClose() {
      this.dialogOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
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

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.formData = JSON.parse(JSON.stringify(row));
      this.formData.title = row.cardEntity.title;
      this.dialogOpen = true;
      this.title = "编辑";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          const params = {
            id: this.formData.id,
            openFee: this.formData.openFee,
            ratesFee: this.formData.ratesFee,
          };
          channelCardUpdate(params).then((res) => {
            if (res.code == 200) {
              this.$modal.msgSuccess("编辑成功");
              this.dialogOpen = false;
              this.getList();
            } else {
              this.$modal.msgError("编辑失败");
              this.dialogOpen = false;
              this.getList();
            }
          });
        }
      });
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
