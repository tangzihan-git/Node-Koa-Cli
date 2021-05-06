<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <!-- <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template> -->
                <template v-if="item.type.includes(userinfo.type)">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'home',
                    title: '系统首页',
                    type:[2,3] // 允许访问的用户组
                },
                {
                    icon: 'el-icon-user-solid',
                    index: 'user_manage',
                    title: '用户管理',
                    type:[3]
                },
                {
                    icon: 'el-icon-s-operation',
                    index: 'category_manage',
                    title: '分类管理',
                    type:[3]
                },
                {
                    icon: 'el-icon-star-on',
                    index: 'business_manage',
                    title: '商户管理',
                    type:[3]
                },
                  {
                    icon: 'el-icon-s-custom',
                    index: 'business_info_manage',
                    title: '商户信息',
                    type:[2]
                },
                {
                    icon: 'el-icon-s-goods',
                    index: 'goods_manage', 
                    title: '商品管理',
                    type:[2,3] 
                },
              
                 {
                    icon: 'el-icon-s-operation',
                    index: 'type_manage',
                    title: '类别管理',
                    type:[2]
                },
                 {
                    icon: 'el-icon-position',
                    index: 'order_manage',
                    title: '订单管理',
                    type:[2,3]
                },
                {
                    icon: 'el-icon-document',
                    index: 'comment_manage',
                    title: '评价管理',
                    type:[2,3]
                },

                
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
