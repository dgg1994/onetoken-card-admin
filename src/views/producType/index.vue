<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入类型名称" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

             <el-form-item label="" prop="status">
              <el-select v-model="queryParams.status" filterable placeholder="请选择状态" :disabled="upState"
                style="width: 100%;">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
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
          <el-table-column label="语言" align="center" prop="language" />
          <el-table-column label="类型名称" align="center" prop="title" />
          <el-table-column label="产品类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.productType === 1">
                定期
              </span>
              <span v-else>
                活期
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">
                启用
              </span>
              <span v-else>
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">
                编辑
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="30%" :close-on-click-modal="false" @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="语言" prop="language">
                  <el-select v-model="formData.language" filterable placeholder="请选择语言" :disabled="upState"
                    style="width: 100%;">
                    <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="产品类型" prop="productType">
                  <el-select v-model="formData.productType" filterable placeholder="请选择产品类型" :disabled="upState"
                    style="width: 100%;">
                    <el-option label="定期" :value="1"></el-option>
                    <el-option label="活期" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="类型名称" prop="title">
                  <el-input v-model="formData.title" placeholder="请输入类型名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="formData.status" filterable placeholder="请选择状态" :disabled="upState"
                    style="width: 100%;">
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                  </el-select>
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
import { getLanguage} from "@/api/dic/dic";
import { productTypeList, productTypeAdd, productTypeDelete, productTypeFind } from "@/api/product/product";

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
      upState: false,
      logoURL:[],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
        title: undefined,
        status: undefined,
      },
      languageList: [],
      whetherCurrentList:[
        {
          "id":1,
          "name":"是"
        },
         {
          "id":2,
          "name":"否"
        }
      ],
      // 表单校验
      rules: {
        language: [
          { required: true, message: "请选择语言", trigger: "blur" },
        ],
        productType: [
          { required: true, message: "请选择产品类型", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" },
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

    getList() {
      this.loading = true;
      const payload = {
        pageNumber: this.queryParams.pageNumber,
        pageSize: this.queryParams.pageSize,
      };
      if (this.queryParams.title) payload.title = this.queryParams.title;
      if (this.queryParams.status !== undefined && this.queryParams.status !== '') {
        payload.status = Number(this.queryParams.status);
      }
      productTypeList(payload).then(res => {
        const page = res.data || {};
        this.dataList = page.list || []
        this.total = page.total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })

    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },

    handleClose(){
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.formData = {};
      this.resetForm("form");
    },
    resetQuery() {
      this.queryParams = {
        pageNumber: 1,
        pageSize: 10,
        title: undefined,
        status: undefined,
      }
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
      this.upState = false,
      this.dialogOpen = true;
      this.title = "添加";
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.loading = true;
      productTypeFind(row.id).then(res => {
        const data = res.data || {};
        this.formData = {
          id: data.id,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          title: data.title,
          language: data.language,
          productType: data.productType,
          status: data.status,
          setTime: data.setTime,
          gmtModified: data.gmtModified
        };
        this.dialogOpen = true;
        this.title = "编辑";
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },


    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          productTypeAdd(this.formData).then(res => {
            if(res.code == 200){
              this.$modal.msgSuccess(this.formData.id ? "编辑成功" : "新增成功");
              this.dialogOpen = false;
              this.getList()
            }else{
              this.$modal.msgError(this.formData.id ? "编辑失败" : "新增失败");
              this.dialogOpen = false;
              this.getList()
            }
          })
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除？').then(() => {
        return productTypeDelete(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },


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
