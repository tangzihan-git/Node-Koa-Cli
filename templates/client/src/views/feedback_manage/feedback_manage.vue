<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
           
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                v-loading="showLoading"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户名" width="100" align="center"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
               <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            imageUrl:'',
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData(){
            this.getJSON('/feedback?pg='+this.query.pageIndex).then(res=>{
            this.tableData = res.data
            this.tableDataCopy = res.data
            this.pageTotal = res.meta.pageTotal
            this.query.pageSize = res.meta.pageSize
            this.query.nextPage = res.meta.nextPage
            this.showLoading = false
            })
        },
        handleSearch() {
            this.tableData = this.tableDataCopy
            this.$set(this.query, 'pageIndex', 1);
            console.log(this.query.name)
            let data = this.tableData.filter(item=>{
                if(item.excerpt.includes(this.query.name)){
                    return item
                }
            })
            this.tableData = data
        },
         handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.title = '编辑';
            this.dialogFormVisible = true;
            this.imageUrl = this.form.path
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$message.success('删除成功');
                this.delData(row.id)
                this.tableData.splice(index, 1);

            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let ids = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                ids += this.multipleSelection[i].id + ',';
            }
            // 去掉最后一个逗号
            let dex = ids.lastIndexOf(',')
            let start = ids.substring(0,dex)
            let end = ids.substring(dex+1)
            ids = start+end
            
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$message.success('删除成功');
                let idArr = ids.split(',')
                console.log(idArr)
                // 前端删除
                this.tableData = this.tableData.filter(items=>{
                    if(!idArr.includes(items.id.toString())){
                        return items
                    }
                })
                // 后端删除
                this.multipleSelection = [];
                this.delData(ids)
                })
            .catch(() => {});

            
        },
        
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData()
            console.log(this.query)
        },
        // 请求后台删除数据
        delData(ids){
            this.deleteJSON('/feedback/'+ids).then(res=>{
                console.log(res)
            })
        },
    
       
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
