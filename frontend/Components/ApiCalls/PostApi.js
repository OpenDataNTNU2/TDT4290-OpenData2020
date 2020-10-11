const PostApi = async (url, data, func) => {
    try{
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {func(response.id)})
    }
    catch(_){
        console.log("failed to post to: " + url)
    }
}

export default PostApi