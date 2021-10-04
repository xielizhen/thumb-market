import React from 'react';

const addRoutes = (): IRoute[] => [
  {
    path: '/',
    component: () => import('components/Layouts'),
    routes: [
      {
        path: '/dashboard',
        // component: () => import('layouts/BlankLayout'),
        routes: [
          {
            path: '/auth/login',
            // component: () => import('pages/admin/login')
          }
        ]
      }
    ]
  }
];

export function addLazyComponent(routes: IRoute[]) {
  routes.forEach(route => {
    route.component = React.lazy(route.component);

    if (route.routes) {
      addLazyComponent(route.routes);
    }
  });
}

const getRoutes = () => {
  const routes = addRoutes();
  addLazyComponent(routes);
  return routes;
};

export default getRoutes;
