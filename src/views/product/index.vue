<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="language">
              <el-select v-model="queryParams.language" filterable placeholder="请选择语言" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="productName">
              <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="" prop="whetherCurrent">
              <el-select v-model="queryParams.whetherCurrent" filterable placeholder="是否活期产品" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in whetherCurrentList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="productStateId">
              <el-select v-model="queryParams.productStateId" filterable placeholder="产品状态" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in productStateIdList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
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
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="产品图" align="center" width="180">
            <template slot-scope="scope">
              <div style="width: 90%; height: 80px; overflow: hidden; cursor: pointer;">
                <img :src="scope.row.coverImg" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="语言" align="center" prop="languageName" />
          <el-table-column label="产品名称" align="center" prop="productName" />
          <el-table-column label="产品分类" align="center" prop="productType" />
          <el-table-column label="资金类型" align="center" prop="fundsType" />
          <el-table-column label="起购金额" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.initialMonery + '' + scope.row.fundsType }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="理财时长" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.productTime + '天' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="年利率" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.interestRate * 100 + '%' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="产品状态" align="center" prop="productState" />
          <el-table-column label="是否活期类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.whetherCurrent === 1">
                是
              </span>
              <span v-else>
                否
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" v-if="scope.row.productStateId === 2"
                @click="productOnAndOff(scope.row, 1)">上架</el-button>
              <el-button size="mini" type="text" v-if="scope.row.productStateId === 1"
                @click="productOnAndOff(scope.row, 2)">下架</el-button>
                <el-button size="mini" type="text"
                @click="deleteData(scope.row)">删除</el-button>
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
                  <uploadImg v-model="logoURL" :limit="1"></uploadImg>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="语言" prop="language">
                  <el-select v-model="formData.language" filterable placeholder="请选择语言" :disabled="upState"
                    style="width: 100%;" @change="selectLanguage">
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
                <el-form-item label="产品类型" prop="productTypeId">
                  <el-select v-model="formData.productTypeId" filterable placeholder="请选择产品类型" style="width: 100%;" @change="selectTypeList">
                    <el-option v-for="item in productTypeList" :key="item.id" :label="item.name" :value="item.id">
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
                  <el-input :disabled="whetherCurrent === 1" type="number" v-model="formData.productTime" placeholder="请输入理财时长" style="width: 85%;" />
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
import { productList, productTypeAll, productAdd, productUpdate, productOnAndOff,productDelete } from "@/api/product/product";

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
      productTypeList: [],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
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
        productTypeId: [
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
    this.getLanguageList()
    this.getList();
  },
  methods: {

    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data
      })
    },
    getProductTypeAll(language) {
      productTypeAll(language).then(res => {
        console.log(res)
        this.productTypeList = res.data
      })
    },
    getList() {
      this.loading = true;
      productList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    selectLanguage(value) {
      this.getProductTypeAll(value)
    },

    selectTypeList(id){
      let data = this.productTypeList.find(item => item.id === id);
      this.whetherCurrent = data.whetherCurrent
      if(this.whetherCurrent === 1){
        this.formData.productTime = 0
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
      this.queryParams = {}
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
      this.logoURL = []
      this.upState = false,
      this.dialogOpen = true;
      this.title = "添加";
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.formData = JSON.parse(JSON.stringify(row));
      this.formData.fundsType = "USDT"
      this.formData.interestRate = this.formData.interestRate * 100;
      this.getProductTypeAll(row.language)
      this.logoURL = row.coverImg
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          window.loadingInstance = this.$loading({
            lock: true,
            text: '资源上传中，请稍后.....',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          if (this.formData.id) {
            let fordata = new FormData()
            if (this.logoURL && this.logoURL.length > 0 && this.logoURL[0].raw) {
              this.logoURL.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
            }
            fordata.append("dataStr", JSON.stringify(this.formData))
            productUpdate(fordata).then(res => {
              this.$modal.msgSuccess("编辑成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
              window.loadingInstance.close();
              window.loadingInstance = null;
            })
          } else {
            let fordata = new FormData()
            if (this.logoURL && this.logoURL.length > 0 && this.logoURL[0].raw) {
              this.logoURL.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
            } else {
              this.$modal.msgError("请上传商品图片")
              window.loadingInstance.close();
              window.loadingInstance = null;
              return;
            }
            fordata.append("dataStr", JSON.stringify(this.formData))
            productAdd(fordata).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
              window.loadingInstance.close();
              window.loadingInstance = null;
            });
          }
        }
      });
    },


    productOnAndOff(row,type) {
      this.$modal.confirm('是否确认进行操作？').then(function () {
        return productOnAndOff(row.id,type);
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
