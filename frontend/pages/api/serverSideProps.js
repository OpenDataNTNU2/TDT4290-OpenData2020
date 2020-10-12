import cookie from "cookie";

export async function PageRender(page, context) {
  let uri = 'https://localhost:5001/api/datasets';
  if(page=="ID"){
    uri = 'https://localhost:5001/api/datasets/' + context.params.id;
  }
  const res = await fetch(uri, createRequestOptions(true))
  const data = await res.json()

  const cookies = parseCookies(context.req)

  let propsData = { props: { data } }

  if (JSON.stringify(cookies) !== "{}") {
    propsData = {
      props: {
        data,
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
      }
    }
  }

  return propsData

}

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

// ALERT: This ships HTTPS validation and should not be used when we are handling personal information and authentication etc.
function createRequestOptions(skipHttpsValidation) {
  const isNode = typeof window === 'undefined';
  if (isNode) {
    var Agent = (require('https')).Agent;
    return {
      agent: new Agent({ rejectUnauthorized: !skipHttpsValidation })
    };
  }
}