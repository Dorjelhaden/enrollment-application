let selectedRow = null
let selectedSid = null

function getFormData() {
    return {
        stdid: parseInt(document.getElementById("sid").value),
        firstname: document.getElementById("fname").value,
        lastname: document.getElementById("lname").value,
        email: document.getElementById("email").value,
    }
}

function validateFormData(data) {
    if (isNaN(data.stdid) || data.stdid <= 0) {
        alert("Enter valid student ID")
        return false
    }
    if (!data.firstname) {
        alert("First name cannot be empty")
        return false
    }
    if (!data.email) {
        alert("Email cannot be empty")
        return false
    }
    return true
}

function addStudent() {
    const data = getFormData()
    if (!validateFormData(data)) {
        return
    }

    fetch('/student/add', {
        method: "POST",
        body: JSON.stringify({
            stdid: data.stdid,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
        }),
        headers: {"Content-Type": "application/json; charset=UTF-8"},
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            resetForm()
            loadStudents()
        })
        .catch(error => {
            alert("Unable to add student: " + error.message)
        })
}

function deleteStudent(button) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return
    }
    const row = button.parentElement.parentElement
    const sid = row.cells[0].innerText

    fetch('/student/' + sid, {
        method: "DELETE",
        headers: {"Content-Type": "application/json; charset=UTF-8"},
    })
        .then(async response => {
            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            row.remove()
        })
        .catch(error => {
            alert("Unable to delete student: " + error.message)
        })
}

function newRow(table, student) {
    const row = table.insertRow(-1)
    row.insertCell(0).innerText = student.stdid
    row.insertCell(1).innerText = student.firstname || student.fname
    row.insertCell(2).innerText = student.lastname || student.lname
    row.insertCell(3).innerText = student.email
    row.insertCell(4).innerHTML = '<input type="button" onclick="deleteStudent(this)" value="Delete" class="button-1">'
    row.insertCell(5).innerHTML = '<input type="button" onclick="editStudent(this)" value="Edit" class="button-2">'
}

function showStudents(students) {
    const table = document.getElementById("myTable")
    if (!Array.isArray(students)) {
        alert("Unable to load student list")
        return
    }
    // Remove existing rows except heading
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    students.forEach(student => newRow(table, student))
}

function editStudent(button) {
    selectedRow = button.parentElement.parentElement
    selectedSid = selectedRow.cells[0].innerText
    document.getElementById("sid").value = selectedSid
    document.getElementById("fname").value = selectedRow.cells[1].innerText
    document.getElementById("lname").value = selectedRow.cells[2].innerText
    document.getElementById("email").value = selectedRow.cells[3].innerText

    const btn = document.getElementById("button-add")
    btn.innerText = "Update"
    btn.onclick = function () {
        updateStudent(selectedSid)
    }
}

function updateStudent(oldSid) {
    const data = getFormData()
    if (!validateFormData(data)) {
        return
    }

    fetch('/student/update/' + oldSid, {
        method: "PUT",
        body: JSON.stringify({
            stdid: data.stdid,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
        }),
        headers: {"Content-Type": "application/json; charset=UTF-8"},
    })
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            resetForm()
            document.getElementById("button-add").innerText = "Add"
            document.getElementById("button-add").onclick = addStudent
            selectedRow = null
            selectedSid = null
            loadStudents()
        })
        .catch(error => {
            alert("Unable to update student: " + error.message)
        })
}

function resetForm() {
    document.getElementById("sid").value = ""
    document.getElementById("fname").value = ""
    document.getElementById("lname").value = ""
    document.getElementById("email").value = ""
}

function loadStudents() {
    fetch('/students')
        .then(async response => {
            const payload = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(payload?.error || `HTTP ${response.status}`)
            }
            showStudents(payload)
        })
        .catch(error => {
            alert("Unable to load students: " + error.message)
        })
}

window.onload = loadStudents
