function getCourses(data) {
    const courses = []
    const allCourses = JSON.parse(data)

    allCourses.forEach(course => {
        courses.push(course.cid)
    });

    var select = document.getElementById("cid")

    courses.forEach(cid => {
        var option = document.createElement("option")
        option.textContent = cid
        option.value = cid
        select.appendChild(option)
    });
}

// Add new course
function addCourse() {
    var _data = {
        cid: document.getElementById("courseId").value,
        cname: document.getElementById("courseName").value
    }

    if (_data.cid === "" || _data.cname === "") {
        alert("Enter valid course details")
        return
    }

    fetch('/courses', {
        method: "POST",
        body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
}

// Show one course row
function showCourse(course) {
    var table = document.getElementById("courseTable")
    var row = table.insertRow(table.length)

    row.insertCell(0).innerHTML = course.cid
    row.insertCell(1).innerHTML = course.cname
    row.insertCell(2).innerHTML =
        '<input type="button" value="Delete" onclick="deleteCourse(this)">'
}

// Load all courses
function getAllCourses(data) {
    const allCourses = JSON.parse(data)
    allCourses.forEach(course => showCourse(course))
}

// Delete course
function deleteCourse(btn) {
    if (confirm("Delete this course?")) {
        let row = btn.parentElement.parentElement
        let cid = row.cells[0].innerHTML

        fetch('/courses/' + cid, {
            method: "DELETE"
        }).then(res => {
            if (res.ok) {
                document.getElementById("courseTable")
                    .deleteRow(row.rowIndex)
            }
        })
    }
}

// On load
window.onload = function () {
    fetch('/courses')
    .then(res => res.text())
    .then(data => getAllCourses(data))
}