<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="language">
              <el-select v-model="queryParams.language" clearable filterable placeholder="请选择语言" :disabled="upState"
                style="width: 140px;">

                <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable style="width: 200px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="" prop="productType">
              <el-select v-model="queryParams.productType" clearable filterable placeholder="产品类型" :disabled="upState"
                style="width: 130px;">
                <el-option v-for="item in productTypeList" :key="item.productType" :label="item.title" :value="item.productType">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="status">
              <el-select v-model="queryParams.status" clearable filterable placeholder="产品状态" :disabled="upState"
                style="width: 130px;">
                <el-option v-for="item in productStateIdList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="setTimeRange">
              <el-date-picker
                v-model="setTimeRange"
                type="datetimerange"
                style="width: 340px"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="创建时间起"
                end-placeholder="创建时间止"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="产品图" align="center" width="180">
            <template slot-scope="scope">
              <div style="width: 90%; height: 80px; overflow: hidden; cursor: pointer;">
                <img :src="scope.row.coverImg" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="语言" align="center" prop="language" />
          <el-table-column label="产品名称" align="center" prop="name" />
          <el-table-column label="产品类型" align="center">
            <template slot-scope="scope">
              <span>{{ formatProductType(scope.row.productType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资金类型" align="center" prop="fundsType" />
          <el-table-column label="起购金额" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.minInvestment != null ? scope.row.minInvestment + '' + scope.row.fundsType : '—' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="理财时长" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.termDays != null">{{ scope.row.termDays + '天' }}</span>
              <span v-else>活期</span>
            </template>
          </el-table-column>
          <el-table-column label="年利率" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.apy != null ? (Number(scope.row.apy) * 100).toFixed(2) + '%' : '—' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="产品状态" align="center">
            <template slot-scope="scope">
              <span>{{ formatProductStatus(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否活期类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.productType === 2">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="setTime" width="165" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status === 2"
                @click="productOnAndOff(scope.row, 1)">上架</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status === 1"
                @click="productOnAndOff(scope.row,2)">下架</el-button>
                <!-- <el-button size="mini" type="text"
                @click="deleteData(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="50%" :close-on-click-modal="false"
          @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="产品图" prop="logoURL">
                  <uploadImg :value="logoURL" @input="handleLogoInput" :limit="1"></uploadImg>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="语言" prop="language">
                  <el-select v-model="formData.language" filterable placeholder="请选择语言" :disabled="upState"
                    style="width: 100%;">
                    <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="是否活期" prop="whetherCurrent">
                  <el-select v-model="formData.whetherCurrent" filterable placeholder="是否活期产品"
                    style="width: 100%;">
                    <el-option v-for="item in whetherCurrentList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="产品名称" prop="productName">
                  <el-input v-model="formData.productName" placeholder="请输入产品名称" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品类型" prop="productType">
                  <el-select v-model="formData.productType" filterable placeholder="请选择产品类型" style="width: 100%;" @change="selectTypeList">
                    <el-option v-for="item in productTypeList" :key="item.id" :label="item.title" :value="Number(item.productType)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="资金类型" prop="fundsType">
                  <el-input v-model="formData.fundsType" placeholder="请输入资金类型" :disabled="true" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="理财时长" prop="productTime">
                  <el-input :disabled="Number(formData.productType) === 2" type="number" v-model="formData.productTime" placeholder="请输入理财时长" style="width: 85%;" />
                  <span>（天）</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="起购金额" prop="initialMonery">
                  <el-input type="number" v-model="formData.initialMonery" placeholder="请输入起购金额" style="width: 80%;" />
                  <span>（USDT）</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="年利率" prop="interestRate">
                  <el-input type="number" v-model="formData.interestRate" placeholder="请输入年利率" style="width: 85%;" />
                  <span>（%）</span>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="产品介绍" prop="productInfo">
                  <el-input type="textarea" :rows="4" v-model="formData.productInfo" placeholder="请输入产品介绍" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" v-debounce>确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage } from "@/api/dic/dic";
import { productList, productTypeAll, productAdd, productUpdate, productOnAndOff, productDelete, productDetail, uploadCommonFile } from "@/api/product/product";

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
      formData: {
        "fundsType": "USDT",
        "productTime":0
      },
      upState: false,
      logoURL: [],
      coverUploading: false,
      productTypeList: [],
      productTypeFilterOptions: [
        { label: "定期", value: 1 },
        { label: "活期", value: 2 }
      ],
      setTimeRange: [],
      // 查询参数（与 financeProductsList 接口一致：分页 + name + productType + setTime 区间 + 可选筛选）
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
        name: undefined,
        language: undefined,
        productType: undefined,
        status: undefined
      },
      languageList: [],
      whetherCurrent:1,
      whetherCurrentList: [
        {
          "id": 1,
          "name": "是"
        },
        {
          "id": 2,
          "name": "否"
        }
      ],
      productStateIdList: [
        {
          "id": 1,
          "name": "已上架"
        },
        {
          "id": 2,
          "name": "已下架"
        }
      ],
      // 表单校验
      rules: {
        language: [
          { required: true, message: "请选择语言", trigger: "blur" },
        ],
        // whetherCurrent: [
        //   { required: true, message: "请选择是否是活期", trigger: "blur" },
        // ],
        name: [
          { required: true, message: "请输入标签内容", trigger: "blur" },
        ],
        productName: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
        ],
        productInfo: [
          { required: true, message: "请输入产品介绍", trigger: "blur" },
        ],
        productType: [
          { required: true, message: "请选中产品类型", trigger: "blur" },
        ],
        fundsType: [
          { required: true, message: "请输入资金类型", trigger: "blur" },
        ],
        initialMonery: [
          { required: true, message: "请输入起购金额", trigger: "blur" },
        ],
        productTime: [
          { required: true, message: "请输入理财时长", trigger: "blur" },
        ],
        interestRate: [
          { required: true, message: "请输入年利率", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
  },
  created() {
    this.getLanguageList();
    this.getProductTypeAll()
    this.getList();
  },
  methods: {
    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data || [];
      })
    },
    getProductTypeAll() {
      productTypeAll({
        pageNumber: 1,
        pageSize: 100
      }).then(res => {
        const list = (res.data && res.data.list) || [];
        this.productTypeList = list.filter(item => item.status === 1);
      })
    },
    buildProductListPayload() {
      const p = { ...this.queryParams };
      if (p.name === "" || p.name == null) delete p.name;
      if (p.language === "" || p.language == null) delete p.language;
      if (p.productType === "" || p.productType == null) delete p.productType;
      if (p.status === "" || p.status == null) delete p.status;
      if (Array.isArray(this.setTimeRange) && this.setTimeRange.length === 2) {
        p.setTimeStart = this.setTimeRange[0];
        p.setTimeEnd = this.setTimeRange[1];
      }
      return p;
    },
    formatProductType(val) {
      const item = this.productTypeFilterOptions.find(i => i.value === val);
      return item ? item.label : (val != null ? String(val) : "—");
    },
    formatProductStatus(status) {
      if (status === 1) return "已上架";
      if (status === 2) return "已下架";
      return status != null ? String(status) : "—";
    },
    getList() {
      this.loading = true;
      productList(this.buildProductListPayload())
        .then(res => {
          const page = res.data || {};
          this.dataList = page.list || [];
          this.total = page.total != null ? page.total : 0;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selectTypeList(productType){
      const currentType = Number(productType);
      let data = this.productTypeList.find(item => Number(item.productType) === currentType);
      if (!data) return;
      this.whetherCurrent = Number(data.productType) === 2 ? 1 : 2
      if(this.whetherCurrent === 1){
        this.formData.productTime = 0
      }
    },
    async handleLogoInput(val) {
      this.logoURL = val;
      if (!Array.isArray(val) || val.length === 0) {
        return;
      }
      const first = val[0];
      if (!first || !first.raw) {
        return;
      }
      this.coverUploading = true;
      this.$modal.loading("图片上传中，请稍候...");
      try {
        const formData = new FormData();
        formData.append("file", first.raw);
        const uploadRes = await uploadCommonFile(formData);
        const uploadedUrl = uploadRes.data || "";
        if (!uploadedUrl) {
          this.$modal.msgError("图片上传失败，未获取到文件地址");
          this.logoURL = [];
          return;
        }
        this.logoURL = uploadedUrl;
        this.$modal.msgSuccess("图片上传成功");
      } catch (e) {
        this.logoURL = [];
      } finally {
        this.coverUploading = false;
        this.$modal.closeLoading();
      }
    },

    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },

    handleClose() {
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.formData = {
        "fundsType": "USDT"
      };
      this.resetForm("form");
    },
    resetQuery() {
      this.setTimeRange = [];
      this.queryParams = {
        pageNumber: 1,
        pageSize: 10,
        name: undefined,
        language: undefined,
        productType: undefined,
        status: undefined
      };
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
      this.getProductTypeAll();
      this.logoURL = []
      this.upState = false,
      this.dialogOpen = true;
      this.title = "添加";
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.loading = true;
      productDetail(row.id).then(res => {
        const data = res.data;
        this.formData = {
          id: data.id,
          language: data.language,
          productName: data.name,
          productType: data.productType,
          fundsType: data.fundsType || "USDT",
          productTime: data.termDays != null ? data.termDays : 0,
          initialMonery: data.minInvestment,
          interestRate: data.apy != null ? Number(data.apy) * 100 : 0,
          productInfo: data.features,
          productStateId: data.status
        };
        this.whetherCurrent = data.productType === 2 ? 1 : 2;
        this.getProductTypeAll();
        if (Array.isArray(data.coverImg)) {
          this.logoURL = data.coverImg.length > 0 ? (data.coverImg[0].url || data.coverImg[0]) : "";
        } else {
          this.logoURL = data.coverImg || "";
        }
        this.upState = true;
        this.dialogOpen = true;
        this.title = "编辑";
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    async resolveCoverImgUrl() {
      if (typeof this.logoURL === "string") {
        return this.logoURL;
      }
      if (!Array.isArray(this.logoURL) || this.logoURL.length === 0) {
        return "";
      }
      const first = this.logoURL[0];
      if (!first) return "";
      if (first.raw) {
        const formData = new FormData();
        formData.append("file", first.raw);
        const uploadRes = await uploadCommonFile(formData);
        return uploadRes.data || "";
      }
      if (typeof first === "string") return first;
      if (first.url) return first.url;
      return "";
    },

    /** 提交按钮 */
    submitForm: function () {
      if (this.coverUploading) {
        this.$modal.msgWarning("图片仍在上传中，请稍后再提交");
        return;
      }
      this.$refs["formData"].validate(async valid => {
        if (valid) {
          window.loadingInstance = this.$loading({
            lock: true,
            text: '资源上传中，请稍后.....',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          try {
            const coverImgUrl = await this.resolveCoverImgUrl();
            if (!coverImgUrl) {
              this.$modal.msgError("请先上传产品图片");
              return;
            }
            const submitData = {
              id: this.formData.id,
              language: this.formData.language,
              name: this.formData.productName,
              type: Number(this.formData.productType),
              fundsType: this.formData.fundsType,
              termDays: Number(this.formData.productType) === 2 ? null : this.formData.productTime,
              minInvestment: this.formData.initialMonery,
              apy: this.formData.interestRate ? Number(this.formData.interestRate) / 100 : 0,
              features: this.formData.productInfo,
              status: this.formData.productStateId,
              coverImg: coverImgUrl
            };
            if (this.formData.id) {
              await productUpdate(submitData);
              this.$modal.msgSuccess("编辑成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
            } else {
              await productAdd(submitData);
              this.$modal.msgSuccess("新增成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
            }
          } finally {
            if (window.loadingInstance) {
              window.loadingInstance.close();
              window.loadingInstance = null;
            }
          }
        }
      });
    },


    productOnAndOff(row,type) {
      this.$modal.confirm('是否确认进行操作？').then(function () {
        return productOnAndOff(row.id, type, row.language);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },


    /** 删除按钮操作 */
    deleteData(row){
        this.$modal.confirm('是否确认删除？').then(function () {
          return productDelete(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        }).catch(() => { });
    }

  }
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
