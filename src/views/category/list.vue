<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item float-right"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="ID" width="80">
        <!-- <template slot-scope="scope">
          <span>{{ index }}</span>
        </template> -->
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{
            scope.row.create_at | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="类别" >
        <template slot-scope="{ row }">
            {{ row.name }}
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      </el-table-column>

      <!-- <el-table-column min-width="300px" label="Title">
        <template slot-scope="{ row }">
          <router-link :to="'/category/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="Actions">
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="editCategory(row)">
            Edit
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteCategory(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <category-form
      :dialogFormVisible="dialogFormVisible"
      :postForm="postForm"
      :is-edit="false"
      @close="closeDialog"
      @ok="ok"
    />
  </div>
</template>

<script>
import { listCategory, createCategory } from "@/api/category";
import CategoryForm from "./components/CategoryForm";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  components: { Pagination, CategoryForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      dialogFormVisible: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
      },
      postForm: {
        id: undefined,
        name: "",
      },
    };
  },
  mounted() {},

  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listCategory(this.listQuery).then((response) => {
        this.list = response.data.results;
        this.total = response.paginate ? response.paginate.total : 0;
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
    },
    editCategory(form) {
      console.log('=======')
      this.postForm = form
      this.dialogFormVisible = true
    },
    ok() {
      this.dialogFormVisible = false;
      
      createCategory(this.postForm).then(
        (res) => {
          this.listLoading = false
          this.getList()
        },
        (err) => {}
      );
      
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
