
let data = localStorage.getItem("oldma_game_stats")
let tryLogin = false;
let username = null;
let token = null;
if (data != null) {
    try {
        let dataObject = JSON.parse(data);
        if (dataObject.username != undefined && dataObject.token != undefined) {
            username = dataObject.username;
            token = dataObject.token;
            tryLogin = true;
        }

    } catch (e) {

    }
}
if (tryLogin) {
    (async () => {
        const rawResponse = await fetch('./login/validateToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, sessionToken: token })
        });
        const content = await rawResponse.json();

        console.log(content);
    })();
}