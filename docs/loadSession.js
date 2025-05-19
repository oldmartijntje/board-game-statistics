let data = localStorage.getItem("oldma_game_stats")
let tryLogin = false;
let username = null;
let token = null;
let refreshToken = null;
let authenticatedUser = false;
if (data != null) {
    try {
        let dataObject = JSON.parse(data);
        if (dataObject.username != undefined && dataObject.token != undefined) {
            username = dataObject.username;
            token = dataObject.token;
            tryLogin = true;
            if (dataObject.refreshToken != undefined) {
                refreshToken = dataObject.refreshToken;
            }
        }

    } catch (e) {

    }
}
if (tryLogin) {
    fetch('/api/login/validateToken', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, sessionToken: token })
    }).then(async function (res) {
        const content = await res.json();
        writeLog(res, "/validateToken");
        writeLog(content, "/validateToken");
        if (res.status == 200 && res.ok == true) {
            authenticatedUser = true;
        } else {
            if (refreshToken != null) {
                fetch('/api/login/refreshToken', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, refreshToken: refreshToken })
                }).then(async function (res) {
                    writeLog(res, "/refreshToken");
                    const content2 = await res.json();
                    writeLog(content2, "/refreshToken");
                    if (res.status == 200 && res.ok == true && content2.sessionToken != undefined && content2.refreshToken != undefined) {
                        data = {
                            username: username,
                            token: content2.sessionToken,
                            refreshToken: content2.refreshToken
                        };
                        localStorage.setItem("oldma_game_stats", JSON.stringify(data));
                        authenticatedUser = true;
                    } else {
                        localStorage.removeItem("oldma_game_stats");
                        alert("Session Expired, Please log back in!")
                        window.open("/login")
                    }
                });
            } else {
                localStorage.removeItem("oldma_game_stats");
                alert("Session Expired, Please log back in!")
                window.open("/login")
            }
        }
    });
} else {
    window.open("/login")
}