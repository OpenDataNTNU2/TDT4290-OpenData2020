const DeleteApi = async (url) => {
    try {
        fetch(url, {
            method: 'DELETE',
        })
            .then(response => response.json())
    }
    catch (_) {
        console.log("failed to delete from: " + url)
    }
}

export default DeleteApi;
