import {createRouter, createWebHistory} from 'vue-router'
import Management from '../views/Management.vue'

const routes = [
    {
        path:"/management",
        name:'Management',
        component: Management

    }
]

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});


export default router