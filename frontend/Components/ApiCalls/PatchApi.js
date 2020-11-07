const PatchApi = async (url, data) => {
  try {
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => console.log(response));
  } catch (_) {
    console.log(`failed to patch to: ${url}`);
  }
};

export default PatchApi;
