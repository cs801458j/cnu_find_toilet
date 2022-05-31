import { createWebHistory, createRouter } from "vue-router";
import Contact from '@/menu/MyContact.vue'
import Notice from '@/menu/MyNotice.vue'
import Review from '@/menu/MyReview.vue'
import Setting from '@/menu/MySetting.vue'

const routes = [
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/notice',
    name: 'Notice',
    component: Notice
  },
  {
    path: '/review',
    name: 'Review',
    component: Review
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;