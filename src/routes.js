import { createWebHistory, createRouter } from 'vue-router';
//frontend

import Home from './components/frontends/Home.vue';

//admin part

import AdminLogin from './components/admin/AdminLogin.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';

import AddDocument from './components/admin/pages/documents/create.vue';
import AllDocuments from './components/admin/pages/documents/index.vue';

const routes = [
    {
		path: '/',
		name: 'Home',
		component: Home,
		meta:{
			requiredAuth: false,
		}
   },

   { 
        path: '/admin/login', 
        name: 'AdminLogin', 
        component: AdminLogin,
        meta:{
            requiredAuth: false,
        } 
   },

   { 
        path: '/admin/dashboard', 
        name: 'AdminDashboard', 
        component: AdminDashboard,
        meta:{
            requiredAuth: true,
        } 
    },

    { 
        path: '/admin/add-document', 
        name: 'AddDocument', 
        component: AddDocument,
        meta:{
            requiredAuth: true,
        } 
    },

    { 
        path: '/admin/all-documents', 
        name: 'AllDocuments', 
        component: AllDocuments,
        meta:{
            requiredAuth: true,
        } 
    },
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to,from)=>{
	if(to.meta.requiredAuth && !localStorage.getItem('token')){
		return {name: 'AdminLogin'}
	}
});

export default router;