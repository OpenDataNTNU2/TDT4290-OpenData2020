import Router from 'next/router';

const PostApi = async (url, data, func, path = null) => {
  try {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        try {
          func(response.id);
          path ? Router.push(path + response.id) : null;
        } catch (_) {
          console.log(_);
        }
      });
  } catch (_) {
    console.log(`failed to post to: ${url}`);
    console.log(_);
  }
};

export default PostApi;
