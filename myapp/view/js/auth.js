function logout() {
    fetch('/logout')
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
