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
          <el-table-column label="序号" type="index" width="50" align="center" />
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


        <!-- 添加或修改：financeBase + 多语言 Tab -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="720px" :close-on-click-modal="false"
          @close="handleClose" append-to-body class="product-dialog">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="108px">
            <div class="form-section-title">基础信息</div>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="产品图">
                  <uploadImg :value="logoURL" @input="handleLogoInput" :limit="1"></uploadImg>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品类型" prop="financeBase.productType">
                  <el-select v-model="formData.financeBase.productType" filterable placeholder="请选择产品类型"
                    style="width: 100%;" @change="selectTypeList">
                    <el-option v-for="item in productTypeList" :key="item.id" :label="item.title" :value="Number(item.productType)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型名称">
                  <el-input
                    v-model="formData.financeBase.productTypeName"
                    placeholder="选择产品类型后自动带出，全部语言共用"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="资金类型" prop="financeBase.fundsType">
                  <el-input v-model="formData.financeBase.fundsType" placeholder="资金类型" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="理财时长" prop="financeBase.termDays">
                  <el-input :disabled="Number(formData.financeBase.productType) === 2" type="number"
                    v-model="formData.financeBase.termDays" placeholder="请输入理财时长" style="width: calc(100% - 52px);" />
                  <span class="unit-suffix">（天）</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起购金额" prop="financeBase.minInvestment">
                  <el-input type="number" v-model="formData.financeBase.minInvestment" placeholder="请输入起购金额"
                    style="width: calc(100% - 56px);" />
                  <div class="unit-hint">（USDT）</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年利率" prop="financeBase.apyPercent">
                  <el-input type="number" v-model="formData.financeBase.apyPercent" placeholder="请输入年利率"
                    style="width: calc(100% - 44px);" />
                  <span class="unit-suffix">（%）</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品状态" prop="financeBase.status">
                  <el-select v-model="formData.financeBase.status" placeholder="状态" style="width: 100%;">
                    <el-option v-for="item in productStateIdList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">多语言文案</el-divider>
            <p class="locale-tab-hint">必填（至少填写一种语言的产品名称或介绍）</p>
            <el-tabs v-model="activeLocaleTab" class="locale-tabs" v-if="dialogLangTabs.length">
              <el-tab-pane
                v-for="lang in dialogLangTabs"
                :key="lang.name"
                :label="lang.value"
                :name="lang.name"
              >
                <el-row v-if="formData.localeByLang[lang.name]" :gutter="16" class="locale-tab-panel">
                  <el-col :span="24">
                    <el-form-item label="产品名称">
                      <el-input
                        v-model="formData.localeByLang[lang.name].name"
                        placeholder="必填（至少填写一种语言）"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="产品介绍">
                      <el-input
                        type="textarea"
                        :rows="4"
                        v-model="formData.localeByLang[lang.name].features"
                        placeholder="请输入产品介绍"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <div v-else class="locale-empty-tip">暂无语言配置，请先维护字典语言列表</div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm" v-debounce>保 存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage } from "@/api/dic/dic";
import { productList, productTypeListName, productAdd, productUpdate, productOnAndOff, productDelete, productDetail, uploadCommonFile } from "@/api/product/product";

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
        id: undefined,
        financeBase: {
          productType: undefined,
          productTypeName: "",
          fundsType: "USDT",
          termDays: null,
          minInvestment: undefined,
          apyPercent: undefined,
          status: 2
        },
        localeByLang: {}
      },
      /** 多语言 Tab 当前语言 code，与 dic.name 一致 */
      activeLocaleTab: "",
      /** 弹窗内 Tab：字典语言 + 详情接口里出现但字典未配置的语言（如 en） */
      dialogLangTabs: [],
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
          "name": "上架"
        },
        {
          "id": 2,
          "name": "下架"
        }
      ],
      // 表单校验（多语言文案在 Tab 内，提交时单独校验「至少一种语言」）
      rules: {
        "financeBase.productType": [
          { required: true, message: "请选择产品类型", trigger: "change" },
        ],
        "financeBase.fundsType": [
          { required: true, message: "请输入资金类型", trigger: "blur" },
        ],
        "financeBase.minInvestment": [
          { required: true, message: "请输入起购金额", trigger: "blur" },
        ],
        "financeBase.apyPercent": [
          { required: true, message: "请输入年利率", trigger: "blur" },
        ],
        "financeBase.termDays": [
          {
            validator: (rule, value, callback) => {
              const pt = Number(this.formData.financeBase.productType);
              if (pt === 2) {
                callback();
                return;
              }
              if (value === "" || value == null || Number(value) <= 0) {
                callback(new Error("请输入理财时长（天）"));
                return;
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        "financeBase.status": [
          { required: true, message: "请选择产品状态", trigger: "change" },
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
    /** 查询区与弹窗产品类型下拉：GET productType/listName，列表结构与原 list 一致 */
    getProductTypeAll() {
      productTypeListName().then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : (raw && raw.list) || [];
        this.productTypeList = list.filter((item) => item.status === 1);
      });
    },
    /** 统一比较语言 code：忽略大小写、下划线/连字符差异（zh_CN 与 zh-CN 视为同一语言） */
    normalizeLangKey(code) {
      if (code == null || code === "") return "";
      return String(code).trim().replace(/_/g, "-").toLowerCase();
    },
    /**
     * 将接口返回的 language 映射为字典里的 name（作为 Tab / localeByLang 的唯一键）
     * 避免字典 zh_CN 与接口 zh-CN 各建一个 Tab，导致中文写在 zh-CN、界面却绑定 zh_CN 而不回显
     */
    resolveLocaleTabKey(apiLanguage) {
      if (apiLanguage == null || apiLanguage === "") return "";
      const n = this.normalizeLangKey(apiLanguage);
      const list = this.languageList || [];
      const match = list.find((l) => this.normalizeLangKey(l.name) === n);
      return match ? match.name : String(apiLanguage).trim();
    },
    /** 弹窗 Tab：默认与字典一致 */
    defaultDialogLangTabs() {
      return (this.languageList || []).map((l) => ({
        name: l.name,
        value: l.value,
      }));
    },
    /**
     * 详情里出现的语言若不在字典里（如 en），追加 Tab；与字典同义（zh-CN/zh_CN）只保留字典那一项
     */
    syncDialogLanguageTabs(localeListFromApi) {
      const dic = this.languageList || [];
      const usedNorm = new Set();
      const tabs = [];
      dic.forEach((item) => {
        usedNorm.add(this.normalizeLangKey(item.name));
        tabs.push({ name: item.name, value: item.value });
      });
      (localeListFromApi || []).forEach((row) => {
        const code = row.language;
        if (!code) return;
        const canon = this.resolveLocaleTabKey(code);
        const norm = this.normalizeLangKey(canon);
        if (usedNorm.has(norm)) return;
        usedNorm.add(norm);
        tabs.push({ name: canon, value: canon });
      });
      this.dialogLangTabs = tabs.length ? tabs : this.defaultDialogLangTabs();
    },
    /** 为当前 dialogLangTabs（或字典）初始化空文案 map */
    buildEmptyLocaleMap() {
      const map = {};
      const tabs =
        this.dialogLangTabs && this.dialogLangTabs.length
          ? this.dialogLangTabs
          : (this.languageList || []).map((l) => ({ name: l.name }));
      tabs.forEach((t) => {
        map[t.name] = {
          name: "",
          features: "",
        };
      });
      return map;
    },
    /** 仅提交填写过名称或介绍的语种；与详情接口约定一致：locale 仅含 language、name、features */
    buildLocalesPayload() {
      const map = this.formData.localeByLang || {};
      const out = [];
      Object.keys(map).forEach((language) => {
        const row = map[language];
        const name = row.name != null ? String(row.name).trim() : "";
        const features = row.features != null ? String(row.features).trim() : "";
        if (name || features) {
          out.push({
            language,
            name,
            features
          });
        }
      });
      return out;
    },
    buildProductListPayload() {
      const p = { ...this.queryParams, identity: true };
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
    selectTypeList(productType) {
      const currentType = Number(productType);
      const row = this.productTypeList.find(item => Number(item.productType) === currentType);
      if (!row) return;
      this.whetherCurrent = Number(row.productType) === 2 ? 1 : 2;
      if (this.whetherCurrent === 1) {
        this.formData.financeBase.termDays = null;
      }
      if (row.title) {
        this.formData.financeBase.productTypeName = row.title;
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
    /** 新建弹窗默认表单结构 */
    emptyFormData() {
      return {
        id: undefined,
        financeBase: {
          productType: undefined,
          productTypeName: "",
          fundsType: "USDT",
          termDays: null,
          minInvestment: undefined,
          apyPercent: undefined,
          status: 2
        },
        localeByLang: {}
      };
    },
    // 表单重置
    reset() {
      this.dialogLangTabs = this.defaultDialogLangTabs();
      this.formData = this.emptyFormData();
      this.formData.localeByLang = this.buildEmptyLocaleMap();
      this.activeLocaleTab =
        (this.dialogLangTabs[0] && this.dialogLangTabs[0].name) ||
        (this.languageList[0] && this.languageList[0].name) ||
        "";
      this.resetForm("formData");
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

    /** 编辑：兼容详情 financeBase 混入分页字段、locales 含字典外 language */
    handleUpdate(row) {
      this.reset();
      this.loading = true;
      productDetail(row.id).then(res => {
        const data = res.data || {};
        const fb = data.financeBase || {};
        const lc = data.locale || {};
        const ptRaw = fb.productType !== undefined ? fb.productType : data.productType;
        const productType =
          ptRaw !== undefined && ptRaw !== null && ptRaw !== ""
            ? Number(ptRaw)
            : undefined;
        const apyRaw = fb.apy !== undefined ? fb.apy : data.apy;
        const termRaw = fb.termDays !== undefined ? fb.termDays : data.termDays;
        let resolvedTypeName =
          fb.productTypeName ||
          data.productTypeName ||
          lc.productTypeName ||
          "";
        if (!resolvedTypeName && Array.isArray(data.locales) && data.locales.length) {
          const hit = data.locales.find((l) => l.productTypeName);
          resolvedTypeName = (hit && hit.productTypeName) || "";
        }
        if (!resolvedTypeName && productType != null && !Number.isNaN(productType)) {
          resolvedTypeName = this.formatProductType(productType);
        }

        this.syncDialogLanguageTabs(data.locales);
        this.formData.localeByLang = this.buildEmptyLocaleMap();

        const stRaw =
          fb.status !== undefined ? fb.status : data.status;
        const statusNum =
          stRaw !== undefined && stRaw !== null && stRaw !== ""
            ? Number(stRaw)
            : 2;

        this.formData.id = data.id != null ? data.id : fb.id != null ? fb.id : undefined;
        this.formData.financeBase = {
          productType: Number.isNaN(productType) ? undefined : productType,
          productTypeName: resolvedTypeName || "",
          fundsType: fb.fundsType || data.fundsType || "USDT",
          termDays:
            productType === 2
              ? null
              : termRaw != null && termRaw !== ""
                ? Number(termRaw)
                : null,
          minInvestment:
            fb.minInvestment !== undefined
              ? fb.minInvestment
              : data.minInvestment,
          apyPercent:
            apyRaw != null && apyRaw !== ""
              ? Number(apyRaw) * 100
              : undefined,
          status: Number.isNaN(statusNum) ? 2 : statusNum,
        };

        const applyLocaleRow = (language, src) => {
          if (!language) return;
          const key = this.resolveLocaleTabKey(language);
          if (!key) return;
          if (!this.formData.localeByLang[key]) {
            this.$set(this.formData.localeByLang, key, {
              name: "",
              features: "",
            });
          }
          const t = this.formData.localeByLang[key];
          t.name = src && src.name !== undefined && src.name !== null ? String(src.name) : "";
          t.features =
            src && src.features !== undefined && src.features !== null
              ? String(src.features)
              : "";
        };
        if (Array.isArray(data.locales) && data.locales.length) {
          data.locales.forEach((l) => applyLocaleRow(l.language, l));
        } else {
          const lang = lc.language || data.language;
          applyLocaleRow(lang, {
            name: lc.name !== undefined ? lc.name : data.name,
            features: lc.features !== undefined ? lc.features : data.features,
          });
        }

        this.activeLocaleTab =
          (this.dialogLangTabs[0] && this.dialogLangTabs[0].name) ||
          (data.locales &&
            data.locales[0] &&
            data.locales[0].language &&
            this.resolveLocaleTabKey(data.locales[0].language)) ||
          (lc.language && this.resolveLocaleTabKey(lc.language)) ||
          (data.language && this.resolveLocaleTabKey(data.language)) ||
          "";
        this.whetherCurrent = productType === 2 ? 1 : 2;
        this.getProductTypeAll();
        this.$nextTick(() => {
          if (productType != null && !Number.isNaN(productType)) {
            this.selectTypeList(productType);
          }
        });
        const cover = fb.coverImg !== undefined ? fb.coverImg : data.coverImg;
        if (Array.isArray(cover)) {
          this.logoURL = cover.length > 0 ? (cover[0].url || cover[0]) : "";
        } else {
          this.logoURL = cover || "";
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
            const localesPayload = this.buildLocalesPayload();
            if (!localesPayload.length) {
              this.$modal.msgWarning("请至少填写一种语言的产品名称或介绍");
              return;
            }
            const hasProductName = localesPayload.some(
              (x) => x.name && String(x.name).trim()
            );
            if (!hasProductName) {
              this.$modal.msgWarning("请至少填写一种语言的产品名称");
              return;
            }
            const fb = this.formData.financeBase;
            const pt = Number(fb.productType);
            const termDays =
              pt === 2 ? null : (fb.termDays === "" || fb.termDays == null ? null : Number(fb.termDays));
            const submitData = {
              financeBase: {
                coverImg: coverImgUrl,
                productType: pt,
                productTypeName:
                  fb.productTypeName != null ? String(fb.productTypeName).trim() : "",
                fundsType: fb.fundsType || "USDT",
                termDays,
                minInvestment:
                  fb.minInvestment === "" || fb.minInvestment == null ? null : Number(fb.minInvestment),
                apy:
                  fb.apyPercent === "" || fb.apyPercent == null ? 0 : Number(fb.apyPercent) / 100,
                status: fb.status,
              },
              locales: localesPayload,
            };
            if (this.formData.id) {
              submitData.id = this.formData.id;
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
        return productOnAndOff(row.id, type);
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

.product-dialog .form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 4px;
  border-left: 3px solid #409EFF;
}

.product-dialog .unit-suffix {
  margin-left: 6px;
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}

.product-dialog .unit-hint {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
  line-height: 1.2;
}

.product-dialog .locale-tab-hint {
  font-size: 12px;
  color: #909399;
  margin: 0 0 12px 4px;
  line-height: 1.5;
}

.product-dialog .locale-tabs >>> .el-tabs__header {
  margin-bottom: 8px;
}

.product-dialog .locale-tabs >>> .el-tabs__nav-wrap::after {
  height: 1px;
}

.product-dialog .locale-tab-panel {
  padding-top: 4px;
}

.product-dialog .locale-empty-tip {
  color: #909399;
  font-size: 13px;
  padding: 12px 4px;
}
</style>
