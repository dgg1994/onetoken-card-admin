<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_end">
          <el-row :gutter="10" class="mb8" v-if="dataList == null || dataList.length < 1">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="苹果内购入口" align="center" >
            <template slot-scope="scope">
             <span v-if="scope.row.iosPay">
                开启
              </span>
              <span v-else>
                关闭
              </span>
            </template>
          </el-table-column>
          <el-table-column label="udst支付入口" align="center" >
            <template slot-scope="scope">
             <span v-if="scope.row.usdtPay">
                开启
              </span>
              <span v-else>
                关闭
              </span>
            </template>
          </el-table-column>
           <el-table-column label="银行卡支付入口" align="center" >
            <template slot-scope="scope">
             <span v-if="scope.row.cardPay">
                开启
              </span>
              <span v-else>
                关闭
              </span>
            </template>
          </el-table-column>
          <el-table-column label="理财入口" align="center" >
          <template slot-scope="scope">
             <span v-if="scope.row.manageState">
                开启
              </span>
              <span v-else>
                关闭
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center" prop="gmtModified" />
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
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
                <el-form-item label="苹果内购入口" prop="iosPay">
                 <el-select v-model="formData.iosPay" filterable placeholder="请选择" style="width: 100%;">
                  <el-option v-for="item in openState" :key="item.name" :label="item.value" :value="item.name">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="udst支付入口" prop="usdtPay">
                 <el-select v-model="formData.usdtPay" filterable placeholder="请选择" style="width: 100%;">
                  <el-option v-for="item in openState" :key="item.name" :label="item.value" :value="item.name">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="24">
                <el-form-item label="银行卡支付" prop="cardPay">
                 <el-select v-model="formData.cardPay" filterable placeholder="请选择" style="width: 100%;">
                  <el-option v-for="item in openState" :key="item.name" :label="item.value" :value="item.name">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="24">
                <el-form-item label="理财入口" prop="manageState">
                 <el-select v-model="formData.manageState" filterable placeholder="请选择" style="width: 100%;">
                  <el-option v-for="item in openState" :key="item.name" :label="item.value" :value="item.name">
                  </el-option>
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
import { PayTypeSateList, PayTypeSateUpdate} from "@/api/PayTypeSate/PayTypeSate";

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
      },
      userInfo:{},
      openState:[
        { name: true, value: '开启' },
        { name: false, value: '关闭' },
      ],
      // 表单校验
      rules: {
        language: [
          { required: true, message: "请选择语言", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入简介内容", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
  },
  created() {
    this.userInfo = this.$store.state.user.userInfo;
    this.getList();
  },
  methods: {


    getList() {
      this.loading = true;
      PayTypeSateList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
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
      this.upState = false,
      this.dialogOpen = true;
      this.title = "添加";
    },

      handleUpdate(row) {
      this.reset();
      this.formData = row;
      console.log(row)
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.setUser = this.userInfo.id
          this.formData.setUserName = this.userInfo.username
          if(this.formData.id){//编辑
             PayTypeSateUpdate(this.formData).then(res => {
              if(res.code == 200){
                this.$modal.msgSuccess("修改成功");
                this.dialogOpen = false;
                this.getList()
              }else{
                this.$modal.msgError("修改失败");
                this.dialogOpen = false;
                this.getList()
              }
            })
          }else{//新增
            walletTransfetRatesAdd(this.formData).then(res => {
              if(res.code == 200){
                this.$modal.msgSuccess("新增成功");
                this.dialogOpen = false;
                this.getList()
              }else{
                this.$modal.msgError("新增失败");
                this.dialogOpen = false;
                this.getList()
              }
            })
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除？').then(function () {
        return firmAccountDelete(row.id);
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

.flex_end {
  display: flex;
  justify-content: flex-end;
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
