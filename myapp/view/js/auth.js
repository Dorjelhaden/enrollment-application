function logout() {
    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            window.location.href = 'index.html'
        })
        .catch(error => {
            alert('Unable to logout: ' + error.message)
        })
}

function redirectIfNotAuthorized() {
    fetch('/verify', { method: 'GET', credentials: 'same-origin' })
        .then(response => {
            if (!response.ok) {
                window.location.href = 'index.html'
            }
        })
        .catch(() => {
            window.location.href = 'index.html'
        })
}

function protectPage() {
    redirectIfNotAuthorized()
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            redirectIfNotAuthorized()
        }
    })
    window.history.replaceState(null, '', window.location.href)
}
