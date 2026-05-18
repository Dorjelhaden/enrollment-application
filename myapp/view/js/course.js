let selectedCourseRow = null
let selectedCourseId = null

function addCourse() {
    const cid = document.getElementById('cid').value.trim()
    const cname = document.getElementById('cname').value.trim()

    if (!cid || !cname) {
        alert('Enter valid course details')
        return
    }

    fetch('/courses', {
        method: 'POST',
        body: JSON.stringify({ cid, cname }),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            resetCourseForm()
            loadCourses()
        })
        .catch(error => {
            alert('Unable to add course: ' + error.message)
        })
}

function showCourse(course) {
    const table = document.getElementById('myTable')
    const row = table.insertRow(-1)
    row.insertCell(0).innerText = course.cid
    row.insertCell(1).innerText = course.cname
    row.insertCell(2).innerHTML = '<input type="button" value="Delete" onclick="deleteCourse(this)" class="btn-delete">'
    row.insertCell(3).innerHTML = '<input type="button" value="Edit" onclick="editCourse(this)" class="btn-edit">'
}

function getAllCourses(courses) {
    const table = document.getElementById('myTable')
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }

    if (!Array.isArray(courses)) {
        alert('Unable to load course list')
        return
    }

    courses.forEach(course => showCourse(course))
}

function editCourse(button) {
    selectedCourseRow = button.parentElement.parentElement
    selectedCourseId = selectedCourseRow.cells[0].innerText

    document.getElementById('cid').value = selectedCourseId
    document.getElementById('cname').value = selectedCourseRow.cells[1].innerText

    const btn = document.getElementById('button-add')
    btn.innerText = 'Update'
    btn.onclick = function () {
        updateCourse(selectedCourseId)
    }
}

function updateCourse(oldCid) {
    const cid = document.getElementById('cid').value.trim()
    const cname = document.getElementById('cname').value.trim()

    if (!cid || !cname) {
        alert('Enter valid course details')
        return
    }

    fetch('/courses/' + encodeURIComponent(oldCid), {
        method: 'PUT',
        body: JSON.stringify({ cid, cname }),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            resetCourseForm()
            const btn = document.getElementById('button-add')
            btn.innerText = 'Add'
            btn.onclick = addCourse
            selectedCourseRow = null
            selectedCourseId = null
            loadCourses()
        })
        .catch(error => {
            alert('Unable to update course: ' + error.message)
        })
}

function deleteCourse(button) {
    if (!confirm('Delete this course?')) {
        return
    }

    const row = button.parentElement.parentElement
    const cid = row.cells[0].innerText

    fetch('/courses/' + encodeURIComponent(cid), {
        method: 'DELETE',
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            row.remove()
        })
        .catch(error => {
            alert('Unable to delete course: ' + error.message)
        })
}

function resetCourseForm() {
    document.getElementById('cid').value = ''
    document.getElementById('cname').value = ''
}

function loadCourses() {
    fetch('/courses')
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            getAllCourses(payload)
        })
        .catch(error => {
            alert('Unable to load courses: ' + error.message)
        })
}

window.onload = loadCourses
