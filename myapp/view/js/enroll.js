function populateStudentSelect(students) {
    const select = document.getElementById("sid")
    if (!select || !Array.isArray(students)) {
        return
    }
    select.innerHTML = ""
    students.forEach(student => {
        const option = document.createElement("option")
        option.textContent = student.stdid
        option.value = student.stdid
        select.appendChild(option)
    })
}

function populateCourseSelect(courses) {
    const select = document.getElementById("cid")
    if (!select || !Array.isArray(courses)) {
        return
    }
    select.innerHTML = ""
    courses.forEach(course => {
        const option = document.createElement("option")
        option.textContent = course.cid
        option.value = course.cid
        select.appendChild(option)
    })
}

function addEnroll() {
    const stdid = parseInt(document.getElementById("sid").value)
    const cid = document.getElementById("cid").value

    if (isNaN(stdid) || !cid) {
        alert("Select valid data")
        return
    }

    fetch('/enroll', {
        method: "POST",
        body: JSON.stringify({ stdid, cid }),
        headers: {"Content-Type": "application/json; charset=UTF-8"},
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            loadEnrollments()
        })
        .catch(error => {
            alert("Unable to enroll student: " + error.message)
        })
}

function showEnrollment(enrollment) {
    const table = document.getElementById("myTable")
    const row = table.insertRow(-1)
    row.insertCell(0).innerText = enrollment.stdid
    row.insertCell(1).innerText = enrollment.cid
    row.insertCell(2).innerText = enrollment.date ? enrollment.date.split("T")[0] : ""
    row.insertCell(3).innerHTML = '<input type="button" onclick="deleteEnroll(this)" value="Delete">'
}

function showEnrollments(enrollments) {
    const table = document.getElementById("myTable")
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    if (!Array.isArray(enrollments)) {
        return
    }
    enrollments.forEach(enrollment => showEnrollment(enrollment))
}

function deleteEnroll(button) {
    if (!confirm('Are you sure you want to delete this enrollment?')) {
        return
    }

    const row = button.parentElement.parentElement
    const sid = row.cells[0].innerText
    const cid = row.cells[1].innerText

    fetch('/enroll/' + sid + '/' + cid, {
        method: "DELETE",
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            row.remove()
        })
        .catch(error => {
            alert("Unable to delete enrollment: " + error.message)
        })
}

function loadStudents() {
    fetch('/students')
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            populateStudentSelect(payload)
        })
        .catch(error => {
            alert("Unable to load students: " + error.message)
        })
}

function loadCourses() {
    fetch('/courses')
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            populateCourseSelect(payload)
        })
        .catch(error => {
            alert("Unable to load courses: " + error.message)
        })
}

function loadEnrollments() {
    fetch('/enrolls')
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            showEnrollments(payload)
        })
        .catch(error => {
            alert("Unable to load enrollments: " + error.message)
        })
}

window.onload = function () {
    loadStudents()
    loadCourses()
    loadEnrollments()
}
