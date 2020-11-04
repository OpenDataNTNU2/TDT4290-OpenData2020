import Router from 'next/router';
import nextCookie from 'next-cookies';

export default function Auth(ctx) {
  const { token } = nextCookie(ctx);

  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return;
  }

  if (!token) {
    Router.push('/login').then(() => window.scrollTo(0, 0));
  }

  return token;
}
