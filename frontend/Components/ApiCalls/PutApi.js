const PutApi = async (url, data) => {
  try {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => console.log(response));
  } catch (_) {
    console.log(`failed to put to: ${url}`);
  }
};

export default PutApi;
