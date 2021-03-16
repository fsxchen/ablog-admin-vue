<template>
  <div class="createPost-container">
    <el-dialog title="Shipping address" :visible.sync="dialogFormVisible">
      <el-form :model="postForm">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="postForm.name" autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=closeForm>Cancel</el-button>
        <el-button type="primary" @click="ok"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import { fetchArticle, createArticle } from "@/api/article";
import { listCategory } from "@/api/category";
import {
  PlatformDropdown,
  SourceUrlDropdown,
} from "./Dropdown";


export default {
  components: {
    MarkdownEditor,
    Sticky,
    PlatformDropdown,
    SourceUrlDropdown,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    postForm: {
      type: Object
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error",
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error",
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      // postForm: Object.assign({}, defaultForm),
      loading: false,
      categoryListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content_md: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }],
      },
      tempRoute: {},
      formLabelWidth: "50"

    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time);
      },
      set(val) {
        this.postForm.display_time = new Date(val);
      },
    },
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }

    this.getRemoteCategory();
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then((response) => {
          this.postForm = response.data;

          // just for test
          this.postForm.title;

          this.postForm.category = response.data.category.id;

          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title}`;
    },
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          this.postForm.status = "published";
          createArticle(this.postForm).then(
            (res) => {
              this.$notify({
                title: "成功",
                message: "发布文章成功",
                type: "success",
                duration: 2000,
              });
              this.$router.push("/article/list");
            },
            (err) => {}
          );
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content_md.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning",
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000,
      });
      this.postForm.status = "draft";
      createArticle(this.postForm).then(
        (res) => {
          console.log(res);
        },
        (err) => {}
      );
    },
    getRemoteCategory(query) {
      listCategory(query).then((response) => {
        if (!response.results) return;
        this.categoryListOptions = response.results.map((v) => v);
      });
    },
    content_generate(html) {
      this.postForm.content = html;
      console.log(this.postForm);
    },
    closeForm() {
      this.$emit("close")
    },
    ok() {
      this.$emit("ok")
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
