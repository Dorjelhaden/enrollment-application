function login() {
    const _data = {
        email: document.getElementById("email").value,
        password: document.getElementById("pw").value,
    }

    fetch('/login', {
        method: "POST",
        credentials: 'same-origin',
        body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(async response => {
            if (response.ok) {
                window.open("student.html", "_self")
                return
            }
            const payload = await response.json().catch(() => null)
            throw new Error(payload?.error || response.statusText)
        })
        .catch(e => {
            alert(e.message || e)
        })
}

function logout() {
    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(async response => {
            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error || response.statusText)
            }
            window.open("index.html", "_self")
        })
        .catch(e => {
            alert(e.message || e)
        })
}
