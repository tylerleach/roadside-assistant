import Vue from 'vue';
import Router from 'vue-router';

import { authenticationService } from '@/_services';
import RegisterPage from '@/views/RegisterPage';
import HomePage from '@/views/HomePage';
import LoginPage from '@/views/LoginPage';
import AdminPage from '@/views/AdminPage';
import MakeRequestPage from '@/views/MakeRequestPage';
import RequestsPage from '@/views/RequestsPage';
import UpdateUserDetailsPage from '@/views/UpdateUserDetailsPage';
import AcceptedRequest from '@/views/AcceptedRequest';
import UpdateBankPage from '@/views/UpdateBankPage';
import UpdateCardPage from '@/views/UpdateCardPage';
import ReportPage from '@/views/ReportPage';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: HomePage,
            meta: { authorize: [] }
        },
        {
            path: '/register',
            component: RegisterPage
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '/admin',
            component: AdminPage,
            meta: { authorize: ['Admin'] }
        },
        {
            path: '/make-request',
            component: MakeRequestPage,
            meta: { authorize: ['Member'] }
        },
        {
            path: '/accepted-responders',
            component: AcceptedRequest,
            meta: { authorize: ['Member'] }
        },
        {
            path: '/requests',
            component: RequestsPage,
            meta: { authorize: ['Professional'] }
        },
        {
            path: '/update-details',
            component: UpdateUserDetailsPage,
            meta: { authorize: ['Member', 'Professional'] } // Both members and professionals should be able to update details
        },
        {
            path: '/update-bank',
            component: UpdateBankPage,
            meta: { authorize: ['Professional'] }
        },
        {
            path: '/update-card',
            component: UpdateCardPage,
            meta: { authorize: ['Member'] }
        },
        {
            path: '/current-request',
            name: 'current-request',
            meta: { authorize: ['Professional'] },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/CurrentRequestPage'),
            props: true
        },
        {
            path: '/report',
            component: ReportPage,
            meta: { authorize: ['Admin'] }
        },
        
        // Else redirect to home page
        { path: '*', redirect: '/' }
    ]
});

router.beforeEach((to, from, next) => {
    // Redirect to login page if not logged in and trying to access a restricted page
    const { authorize } = to.meta;
    const currentUser = authenticationService.currentUserValue;

    if (authorize) {
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return next({ path: '/login', query: { returnUrl: to.path } });
        }

        // check if route is restricted by role
        if (authorize.length && !authorize.includes(currentUser.role)) {
            // role not authorised so redirect to home page
            return next({ path: '/' });
        }
    }

    next();
})