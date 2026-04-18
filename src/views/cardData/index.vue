<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="bankCardNature">
              <el-select v-model="queryParams.bankCardNature" filterable placeholder="请选择卡片类型" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in bankCardNatureList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入卡片名称" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary"  @click="pullData">更新银行卡信息</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
                    <el-table-column label="卡片ID" align="center" prop="id" />

          <el-table-column label="封面图(详情)" align="center" width="180">
            <template slot-scope="scope">
              <div style="width: 90%; height: 80px; overflow: hidden; cursor: pointer;" >
                <img :src="scope.row.img" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </template>
          </el-table-column>
           <el-table-column label="封面图(列表)" align="center" width="180">
            <template slot-scope="scope">
              <div style="width: 90%; height: 80px; overflow: hidden; cursor: pointer;" >
                <img :src="scope.row.listImg" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="卡片名称" align="center" prop="title" />
          <el-table-column label="卡片性质" align="center" prop="bankCardNature" />
          <!-- <el-table-column label="银行卡来源" align="center" prop="bankCardSource" /> -->
          <el-table-column label="卡片类型" align="center" prop="bankCardType" />
          <el-table-column label="卡币种" align="center" prop="ccy" />
          <el-table-column label="月费" align="center" prop="monthFee" />
          <el-table-column label="卡号段" align="center" prop="cardBin" />
          <el-table-column label="开卡费用" align="center" prop="openCardCost" />
          <el-table-column label="预存费用" align="center" prop="preSaveCost" />
          <el-table-column label="充值手续费率" align="center" prop="rechargeFee" />
          <el-table-column label="激活/首充最低金额" align="center" prop="activeMinLimit" />
          <el-table-column label="每次非首充最低金额" align="center" prop="rechargeMinLimit" />
          <el-table-column label="每次非首充最高金额" align="center" prop="rechargeMaxLimit" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
             <span v-if="scope.row.cardState === 1" style="color: #67c23a;">上架中</span>
             <span v-else style="color: #f56c6c;">未上架</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
                <el-button size="mini" type="text" icon="el-icon-d-arrow-right">操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="openHandleUpdate" >修改配置</el-dropdown-item>
                  <el-dropdown-item command="openImgUpdate" >配置封面图</el-dropdown-item>
                  <el-dropdown-item command="openImgListUpdate" >配置列表图</el-dropdown-item>
                  <el-dropdown-item command="openCopyCard" >复制卡片</el-dropdown-item>
                  <el-dropdown-item command="down" v-if="scope.row.cardState === 1" >下架</el-dropdown-item>
                  <el-dropdown-item command="superior" v-if="scope.row.cardState === 2" >上架</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="50%" :close-on-click-modal="false" @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="150px">
             <el-row>
              <el-col :span="24">
                <el-form-item label="卡名称" prop="title">
                  <el-input  v-model="formData.title" placeholder="请输入卡名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开卡费用" prop="openCardCost">
                  <el-input  v-model="formData.openCardCost" placeholder="请输入开卡费用" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="预存费用" prop="preSaveCost">
                  <el-input  v-model="formData.preSaveCost" placeholder="请输入预存费用" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="充值手续费率" prop="rechargeFee">
                  <el-input v-model="formData.rechargeFee" placeholder="请输入充值手续费率" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="首充最低金额" prop="activeMinLimit">
                  <el-input v-model="formData.activeMinLimit" placeholder="请输入激活/首充最低金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="非首充最低金额" prop="rechargeMinLimit">
                  <el-input v-model="formData.rechargeMinLimit" placeholder="请输入每次非首充最低金额" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="非首充最高金额" prop="rechargeMaxLimit">
                  <el-input v-model="formData.rechargeMaxLimit" placeholder="请输入每次非首充最高金额" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="标签介绍" prop="lableIdList">
                  <el-select v-model="formData.lableIdList" multiple  placeholder="请选择标签介绍"
                    style="width: 100%;">
                    <el-option v-for="item in cardTagList" :key="item.id" :label="item.languageName+'--'+item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="24">
                 <el-form-item label="银行卡简介" prop="synopsisIdList">
                  <el-select v-model="formData.synopsisIdList" multiple  placeholder="请选择银行卡简介"
                    style="width: 100%;">
                    <el-option v-for="item in synopsisList" :key="item.id" :label="item.languageName+'--'+item.title" :value="item.id">
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


         <el-dialog title="修改卡片图" :visible.sync="imgDialogOpen" width="26%" :close-on-click-modal="false" @close="imgHandleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="24">
                <el-form-item  prop="logoURL">
                  <uploadImg imgWidth=686 imgHeight=280 v-model="logoURL" :limit="1"></uploadImg>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ImgSubmitForm" v-debounce>确 定</el-button>
            <el-button @click="imgHandleClose">取 消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="修改卡片列表展示图" :visible.sync="imgListDialogOpen" width="26%" :close-on-click-modal="false" @close="imgListHandleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="24">
                <el-form-item  prop="logoListURL">
                  <uploadImg  imgWidth=560 imgHeight=320 v-model="logoListURL" :limit="1"></uploadImg>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ImgListSubmitForm" v-debounce>确 定</el-button>
            <el-button @click="imgListHandleClose">取 消</el-button>
          </div>
        </el-dialog>


      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage} from "@/api/dic/dic";
import { cardList,pullList,cardUpdate,cardUpdateImg,cardUpdateListImg,cardCopyCard,upState} from "@/api/card/cardData";
import { cardTagFindAll} from "@/api/card/cardTag";
import { cardSynopsisFindAll} from "@/api/card/cardSynopsis";
import uploadImg from '@/components/uploadImg/uploadImg.vue'
export default {
  name: "typesOfPoints",
  components: {
    uploadImg
  },
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
      imgDialogOpen:false,
      imgListDialogOpen:false,
      loading: true,
      formData: {},
      upState: false,
      logoURL:[],
      logoListURL:[],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      languageList: [],
      bankCardNatureList:[
        {
          "id":"PHYSICAL",
          "name":"实体卡"
        },
         {
          "id":"VIRTUAL",
          "name":"虚拟卡"
        }
      ],
      cardTagList: [],
      synopsisList:[],
      // 表单校验
      rules: {
        title: [
          { required: true, message: "请填写银行卡名称", trigger: "blur" },
        ],
        openCardCost: [
          { required: true, message: "请填写开卡费用", trigger: "blur" },
        ],
        preSaveCost: [
          { required: true, message: "请填写预存费用", trigger: "blur" },
        ],
        rechargeFee: [
          { required: true, message: "请填写手续费费率", trigger: "blur" },
        ],
        activeMinLimit: [
          { required: true, message: "请填写首充最低金额", trigger: "blur" },
        ],
        rechargeMinLimit: [
          { required: true, message: "请填写非首充最低金额", trigger: "blur" },
        ],
        rechargeMaxLimit: [
          { required: true, message: "请填写非首充最高金额", trigger: "blur" },
        ],
        lableIdList: [
          { required: true, message: "请输选择标签", trigger: "blur" },
        ],
        synopsisIdList: [
          { required: true, message: "请输选择银行卡简介", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
  },
  created() {
    this.getLanguageList()
    this.getCardTagList()
    this.getSynopsisList()
    this.getList();
  },
  methods: {

    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data
      })
    },

    getCardTagList(){
      cardTagFindAll().then(res =>{
        this.cardTagList = res.data
      })
    },

    getSynopsisList(){
      cardSynopsisFindAll().then(res =>{
        this.synopsisList = res.data
      })
    },

    getList() {
      this.loading = true;
      cardList(this.queryParams).then(res => {
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

    pullData(){
      this.loading = true;
      pullList().then(res =>{
        this.getList()
      })
    },

    /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.upState = false,
    //   this.dialogOpen = true;
    //   this.title = "添加";
    // },

     /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.formData = row;
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },
    imgUpdate(row){
      this.logoURL = row.img
      this.reset();
      this.formData = row;
      this.imgDialogOpen = true
    },
    imgHandleClose(){
      this.imgDialogOpen = false;
      this.logoURL = []
      this.reset();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          cardUpdate(this.formData).then(res => {
            if(res.code == 200){
              this.$modal.msgSuccess("编辑成功");
              this.dialogOpen = false;
              this.getList()
            }else{
              this.$modal.msgError("编辑失败");
              this.dialogOpen = false;
              this.getList()
            }
          })
        }
      });
    },
    ImgSubmitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          window.loadingInstance = this.$loading({
            lock: true,
            text: '资源上传中，请稍后.....',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          

          let fordata = new FormData()
          if (this.logoURL && this.logoURL.length > 0 && this.logoURL[0].raw) {
              this.logoURL.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
          }
          fordata.append("uuid", this.formData.uuid)
          cardUpdateImg(fordata).then(res =>{
            if(res.code == 200){
              this.$modal.msgSuccess("编辑成功");
              this.imgDialogOpen = false;
              this.getList()
              window.loadingInstance.close();
              window.loadingInstance = null;
            }else{
              this.$modal.msgError("编辑失败");
              this.imgDialogOpen = false;
              this.getList()
              window.loadingInstance.close();
              window.loadingInstance = null;
            }
          })
          // cardUpdate(this.formData).then(res => {
          //   if(res.code == 200){
          //     this.$modal.msgSuccess("编辑成功");
          //     this.dialogOpen = false;
          //     this.getList()
          //   }else{
          //     this.$modal.msgError("编辑失败");
          //     this.dialogOpen = false;
          //     this.getList()
          //   }
          // })
        }
      });
    },

    copyCard(row){
      this.$modal.confirm('是否确认复制此卡片？').then(function () {
        return cardCopyCard(row.uuid);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("复制成功");
      }).catch(() => { });
    },

    imgListUpdate(row){
      this.logoListURL = row.listImg
      this.reset();
      this.formData = row;
      this.imgListDialogOpen = true
    },
    imgListHandleClose(){
      this.imgListDialogOpen = false;
      this.logoListURL = []
      this.reset();
    },

    ImgListSubmitForm(){
      this.$refs["formData"].validate(valid => {
        if (valid) {
          window.loadingInstance = this.$loading({
            lock: true,
            text: '资源上传中，请稍后.....',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          

          let fordata = new FormData()
          if (this.logoListURL && this.logoListURL.length > 0 && this.logoListURL[0].raw) {
              this.logoListURL.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
          }
          fordata.append("uuid", this.formData.uuid)
          cardUpdateListImg(fordata).then(res =>{
            if(res.code == 200){
              this.$modal.msgSuccess("编辑成功");
              this.imgListDialogOpen = false;
              this.getList()
              window.loadingInstance.close();
              window.loadingInstance = null;
            }else{
              this.$modal.msgError("编辑失败");
              this.imgListDialogOpen = false;
              this.getList()
              window.loadingInstance.close();
              window.loadingInstance = null;
            }
          })
        }
      });
    },

    //上下架
    upCardState(row,stateId){
      console.log(row,stateId)
      let msg = stateId === 1 ? '上架' : '下架'
      this.$modal.confirm(`是否确认${msg}此卡片？`).then(function () {
        return upState(row.uuid,stateId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(`${msg}成功`);
      }).catch(() => { });
    },

    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "openHandleUpdate":
          this.handleUpdate(row);//编辑配置
          break;
        case "openImgUpdate":
          this.imgUpdate(row);//修改封面图
          break;
        case "openImgListUpdate":
          this.imgListUpdate(row);//修改列表图
          break;
        case "openCopyCard":
          this.copyCard(row);//复制卡片
          break;
        case "down":
          this.upCardState(row,2);//下架
          break;
        case "superior":
          this.upCardState(row,1);//上架
          break;
        default:
          break;
      }
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
