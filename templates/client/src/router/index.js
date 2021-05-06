import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: 'system' },
            children: [
                {
                    path: '/home',
                    component: () => import(/* webpackChunkName: "home" */ '../views/index/index.vue'),
                    meta: { title: '系统首页',requiredAuth: true }
                },
                {
                    path: '/user_manage',
                    component: () => import(/* webpackChunkName: "user_manage" */ '../views/user_manage/user_manage.vue'),
                    meta: { title: '用户管理',requiredAuth: true,isAdmin:true }
                },
                {
                    path: '/category_manage',
                    component: () => import(/* webpackChunkName: "category_manage" */ '../views/category_manage/category_manage.vue'),
                    meta: { title: '分类管理',requiredAuth: true,isAdmin:true }
                },
                {
                    path: '/business_manage',
                    component: () => import(/* webpackChunkName: "business_manage" */ '../views/business_manage/business_manage.vue'),
                    meta: { title: '商户管理',requiredAuth: true,isAdmin:true }
                },
                {
                    path: '/goods_manage',
                    component: () => import(/* webpackChunkName: "goods_manage" */ '../views/goods_manage/goods_manage.vue'),
                    meta: { title: '商品管理',requiredAuth: true,isAdmin:true,isBusiness:true }
                },
      
               
                {
                    path: '/comment_manage',
                    component: () => import(/* webpackChunkName: "comment_manage" */ '../views/comment_manage/comment_manage.vue'),
                    meta: { title: '评价管理',requiredAuth: true,isAdmin:true,isBusiness:true }
                },
                {
                    path: '/order_manage',
                    component: () => import(/* webpackChunkName: "order_manage" */ '../views/order_manage/order_manage.vue'),
                    meta: { title: '订单管理',requiredAuth: true,isAdmin:true,isBusiness:true }
                },
                // 商户自定义类别
                {
                    path: '/type_manage',
                    component: () => import(/* webpackChunkName: "type_manage" */ '../views/type_manage/type_manage.vue'),
                    meta: { title: '类别管理',requiredAuth: true,isBusiness:true }
                },
                {
                    path: '/business_info_manage',
                    component: () => import(/* webpackChunkName: "business_info_manage" */ '../views/business_info_manage/business_info_manage.vue'),
                    meta: { title: '商户信息',requiredAuth: true,isBusiness:true }
                },
                {
                    path: '/feedback_manage',
                    component: () => import(/* webpackChunkName: "courser_manage" */ '../views/feedback_manage/feedback_manage.vue'),
                    meta: { title: '意见反馈',requiredAuth: true }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

// 
router.beforeEach((to, from, next) =>{
    // 需要权限认证的路由
    if(to.meta.requiredAuth){
        let token = localStorage.getItem('token')
        if(token){
            // 管理员已登录
            next()
        }else{
            // 管理员未登录
            next({
                path: '/login',
            });
        }
    }else{
        // 不需要权限认证的路由
        next()
    }




    
})

export default router