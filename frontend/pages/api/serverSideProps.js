import cookie from 'cookie';

export async function PageRender(page, context) {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  let uri = `${host}/api/datasets`;
  if (page === 'ID') {
    uri = `${host}/api/datasets/${context.params.id}`;
  } else if (page === 'CoordinationID') {
    uri = `${host}/api/coordinations/${context.params.id}`;
  }
  const res = await fetch(uri, createRequestOptions(true));
  const data = await res.json();

  const cookies = parseCookies(context.req);

  let propsData = { props: { data, uri } };

  if (page === 'CoordinationID' || page === 'ID') {
    propsData = {
      props: {
        data,
        uri,
        prevPublisherId: cookies.prevPublisherId ? cookies.prevPublisherId : '-1',
        prevUserId: cookies.prevUserId ? cookies.prevUserId : '-1',
        prevLoggedUsername: cookies.prevLoggedUsername ? cookies.prevLoggedUsername : 'false',
      },
    };
  }

  if (JSON.stringify(cookies) !== '{}') {
    propsData = {
      props: {
        data,
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId,
        uri,
      },
    };
  }

  return propsData;
}

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

// ALERT: This ships HTTPS validation and should not be used when we are handling personal information and authentication etc.
function createRequestOptions(skipHttpsValidation) {
  const isNode = typeof window === 'undefined';
  if (isNode) {
    const { Agent } = require('https');
    return {
      agent: new Agent({ rejectUnauthorized: !skipHttpsValidation }),
    };
  }
  return null;
}
