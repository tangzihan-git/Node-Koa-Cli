<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:464px;">
                    <div class="user-info">
                        <img :src="userinfo.avatar" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userinfo.nick}}</div>
                            <div>{{userinfo.type == '2' ? '商户组':'系统管理员'}}</div>
                        </div>
                    </div>
                  
                </el-card>
               
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user_count}}</div>
                                    <div>用户注册数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{yuyue_count}}</div>
                                    <div>累计订单数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{getDate(new Date)}}</div>
                                    <div>当前时间</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                 <!-- 图表 -->
                 <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            
            <el-col>
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../../components/common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            user_count:0,
            yuyue_count:0,
            userinfo:null,
            teacher_count:0,
            name: localStorage.getItem('ms_username'),
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '一周订单趋势'
                },
                xRorate: 25,
                labels: ['4/23', '4/24', '4/25', '4/26', '4/27'],
                datasets: [
                    {
                        label: '订单数量',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: [144, 198, 150, 235, 999]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '一周订单趋势'
                },
                 labels: ['4/23', '4/24', '4/25', '4/26', '4/27'],
                datasets: [
                    {
                        label: '订单趋势',
                        fillColor: 'rgb(122,134,34)',
                        data: [234, 278, 270, 190, 230]
                    },
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        // this.handleListener();
        // this.changeDate();
        this.fillData()
        this.countIndex()
    },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
         fillData(){
            
            this.getJSON('/week/order').then(res => {
            // 填充时间
            let times = Object.keys(res.retobj)
            this.options2.labels = times
            this.options.labels = times
            // 订单数据
             let datas = []
              for(let i in res.retobj){
                 datas.push(res.retobj[i])
             }
        
            this.options2.datasets = [
                {
                    label: '订单数量',
                    fillColor: 'rgb(122,134,34)',
                    data: datas
                }
            ]
             this.options.datasets = [
                {
                    label: '订单数量',
                    // fillColor: 'rgb(122,134,34)',
                    data: datas
                }
            ]
            console.log(this.options2)
           
            
          })
        },
        countIndex(){
            this.getJSON('/teacher/index/get').then(res => {
                this.user_count  = res.user_count
                this.yuyue_count  = res.yuyue_count
                this.teacher_count  = res.teacher_count
            })
           
        }

    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>

