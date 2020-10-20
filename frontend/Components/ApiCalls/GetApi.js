const GetApi = async (url, setResponse) => {
  try {
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        setResponse(response);
      });
  } catch (_) {
    console.log(`failed to fetch from: ${url}`);
  }
};

export default GetApi;
