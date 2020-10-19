const PostApi = async (url, data, func) => {
    try {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => { try { func(response.id) } catch (_) { console.log(_) } })
    }
    catch (_) {
        console.log("failed to post to: " + url)
        console.log(_)
    }
}

export default PostApi