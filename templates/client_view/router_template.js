module.exports = function ( router ) {
   
    return `import Vue from 'vue';
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
            component: () => import('../views/index/index.vue'),
            meta: { title: 'system' },
            children: ${ router }
               
        },
        {
            path: '/login',
            component: () => import('../views/login/login.vue'),
            meta: { title: '登录', excludePermision: true }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

// 
router.beforeEach((to, from, next) =>{

    if(to.meta.excludePermision){
        // 不需要权限认证的路由 
        next()
    }else{
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
    }    
})

export default router
    `

}


