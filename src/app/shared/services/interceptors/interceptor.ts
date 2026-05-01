import { HttpInterceptorFn } from '@angular/common/http';

export const interceptor: HttpInterceptorFn = (req, next) => {

  // ✅ check SSR safe
  const isBrowser = typeof window !== 'undefined';

   const token = isBrowser ? localStorage.getItem('access_token') : null;

  console.log('TOKEN:', token);

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};