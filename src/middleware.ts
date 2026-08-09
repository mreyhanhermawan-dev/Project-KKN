import { getEnv } from '@lib/env';
import { defineMiddleware } from 'astro:middleware';
import { validateSession, SESSION_COOKIE, generateSessionId, isSecureCookieRequired } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const method = context.request.method;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  // 1. Generate/Get CSRF Token
  let csrfToken = context.cookies.get('csrf_token')?.value;
  if (!csrfToken) {
    csrfToken = generateSessionId();
    context.cookies.set('csrf_token', csrfToken, {
      httpOnly: true,
      secure: isSecureCookieRequired(context.url),
      sameSite: 'lax',
      path: '/',
    });
  }
  context.locals.csrfToken = csrfToken;

  // 2. Validate CSRF on POST/PUT/DELETE/PATCH for admin routes
  if ((isAdminPage || isAdminApi) && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    let clientToken = context.request.headers.get('X-CSRF-Token');

    if (!clientToken) {
      try {
        const clonedReq = context.request.clone();
        const fd = await clonedReq.formData();
        clientToken = fd.get('csrf_token') as string;
      } catch {
        // Not multipart/form-data or empty
      }
    }

    if (!clientToken || clientToken !== csrfToken) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'CSRF token mismatch' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('CSRF token mismatch', { status: 403 });
    }
  }

  // Public auth endpoints: must stay reachable WITHOUT an existing session.
  // (setup self-guards: it only works while no admin user exists.)
  const isLoginPage = pathname === '/admin/login';
  const isSetupPage = pathname === '/admin/setup';
  const isApiLogin = pathname === '/api/admin/login';
  const isApiSetup = pathname === '/api/admin/setup';
  const isLupaPassword = pathname === '/admin/lupa-password';
  const isResetPassword = pathname === '/admin/reset-password';
  const isApiLupaPassword = pathname === '/api/admin/lupa-password';
  const isApiResetPassword = pathname === '/api/admin/reset-password';

  const needsAuth =
    (isAdminPage && !isLoginPage && !isSetupPage && !isLupaPassword && !isResetPassword) ||
    (isAdminApi && !isApiLogin && !isApiSetup && !isApiLupaPassword && !isApiResetPassword);

  if (needsAuth) {
    const env = getEnv();

    if (!env) return next(); // local dev without runtime, allow through

    const sessionId = context.cookies.get(SESSION_COOKIE)?.value;
    const username = sessionId ? await validateSession(sessionId, env.SESSION_KV) : null;

    if (!username) {
      // API callers get a 401; page navigations get redirected to login.
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/admin/login');
    }

    context.locals.user = { username };
  }

  return next();
});
