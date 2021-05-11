<template>
    <div>
        <div class="crumbs"><el-breadcrumb separator="/"></el-breadcrumb></div>
        <div class="container">
            <div class="handle-box">
               ${ handleCode }
            </div>
            <el-table :data="Datas" v-loading="showLoading" border class="table" ref="multipleTable"  
            header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                    ${ tableCode }
            </el-table>
            ${ pagination }
        </div>
        <!-- 编辑&添加弹框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                ${ edit }
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
${ vue }
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
