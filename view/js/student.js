function addStudent(){
    var data = {
        stdid : parseInt(document.getElementById("sid").value),
        fname : document.getElementById("fname").value,
        lname : document.getElementById("lname").value,
        email : document.getElementById("email").value,

    }
    var sid = data.stdid
    if(isNaN(sid)) {
        alert("Enter vaild student ID")
        return
    }else if (data.email == "") {
        alert("Email cannot be empty")
        return
    }else if(data.fname == ""){
        alert("first name cannot be empty")
        return
    }

    console.log(data)

    var data = getFormData()
    fetch('/student', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTP-8"}

    }).then(response1 => {
        var sid = data.stdid;
        if (response1.ok){
            fetch('/student/'+sid)
            .then(response2 => response2.text())
            .then(data => showStudent(data))
        } else {
            throw new Error(response1.statusText)
        }    
        
}).catch(e => {
    alert(e)
})
resetform();
}

function deleteStudent(r){
    // this(input)-> td -> tr
    if (confirm('Are you sure want to DELETE THIS?')){
        selectedRow = r.parentElement.parentElement;
        sid = selectedRow.cells[0].innerHTML;

        fetch('/student/'+sid, {
            method: "DELETE",
            headers: {"Content-type": "application/json; charset=UTP-8"}
        });
        var rowIndex = selectedRow.rowIndex;//index starts from 0
        if (rowIndex>0) {//this row 0
           document.getElementById("mytable").deleteRow(rowIndex); 
        }
        selectedRow = null
    }
}

function showStudent(data) {
    const student = JSON.parse(data)
    //Find a <table> element with id="myTable":
    var table = document.getElementById("myTable")
    //create an empty <tr> element and add to the last position of the table:
    var row = table.insertRow(table.length);

    //Inset new cells (<td>elements) at the 1st and 2nd position of the "new" <tr> element:
    var td=[]
    for(i=0; i<table.rows[0].cells.length; i++){
        td[i] = row.insertCell(i)
    }
    //Add student details to the new cells
    td[0].innerHTML = student.stdid;
    td[1].innerHTML = student.fname;
    td[2].innerHTML = student.lname;
    td[3].innerHTML = student.email;
    td[4].innerHTML = '<input type="button" onclick="deleteStudent(this)" value="delete" id="button-1">';
    td[5].innerHTML = '<input type="button" onclick="updateStudent(this)" value="edit" id="button-2">';
}
function newRow(student) {
    // Find a <table> element with id="myTable":
    var table = document.getElementById("myTable")
    // Create an empty <tr> element and add it to the last position of the table:
    var row = table.insertRow(table.length);
    // Insert new cells (<td> elements) in new <tr> element:
    var td = [];
    // Iterate the loop till the row 0 cell length in the table
    for (i = 0; i < table.rows[0].cells.length; i++) {
        td[i] = row.insertCell(i);
    }
    //Add student details to the new cells
    td[0].innerHTML = student.stdid;
    td[1].innerHTML = student.fname;
    td[2].innerHTML = student.lname;
    td[3].innerHTML = student.email;
    td[4].innerHTML = '<input type="button" onclick="deleteStudent(this)" value="delete" id="button-1">';
    td[5].innerHTML = '<input type="button" onclick="updateStudent(this)" value="edit" id="button-2">';
}
function showStudents(data) {
    const students = JSON.parse(data)
    students.forEach(stud => {
        // Find a <table> element with id= "mytable":
        var table = document.getElementById("myTable");
        // Create an empty <tr> element and add to the last position of the table:
        var row = table.insertRow(table.length);
        // Insert new cells (<td> elements) in new <tr> element:
        var td=[]
        // Iterate the loop till the row 0 cell length in the table
        for(i=0; i<table.rows[0].cells.length; i++){
            td[i] = row.insertCell(i);
        }
        // Add student detail to the new cells:
        td[0].innerHTML = studstdid;
        td[1].innerHTML = stud.fname;
        td[2].innerHTML = stud.lname;
        td[3].innerHTML = stud.email;
        td[4].innerHTML = '<input type= "button" onclick="deleteStudent(this)" value="delete" id="button-1">';
        td[5].innerHTML = '<input type="button" onclick="updateStudent(this) value="edit" id="button-2">';
        
    })
}

function newRow(table, student) {
 // Create an empty <tr> element and add it to the last position of the
table:
 var row = table.insertRow(table.length);
 // Insert new cells (<td> elements) in new <tr> element:
 var td=[]
 // Iterate the loop till the row 0 cell length in the table
 for(i=0; i<table.rows[0].cells.length; i++){
 td[i] = row.insertCell(i);
 }
 // Add student detail to the new cells:
 td[0].innerHTML = student.stdid;
 td[1].innerHTML = student.fname;
 td[2].innerHTML = student.lname;
 td[3].innerHTML = student.email;
 td[4].innerHTML = '<input type="button" onclick="deleteStudent(this)" value="delete" id="button-1">';
 td[5].innerHTML = '<input type="button" onclick="updateStudent(this)"value="edit" id="button-2">';
}

var selectedRow = null;
function updateStudent(r) {
    selectedRow = r.parentElement.parentElement;
    // fill in the form fields with selected row data
    document.getElementById("sid").value = selectedRow.cells[0].innerHTML;
    document.getElementById("fname").value = selectedRow.cells[1].innerHTML;
    document.getElementById("lname").value = selectedRow.cells[2].innerHTML;
    Document.getElementById("email").value = selectedRow.cells[3].innerHTML;

    var btn = document.getElementById("button-add");
    sid = selectedRow.cells[0].innerHTML;
    if (btn) {
        btn.innerHTML = "Update";
        btn.setAttribute("onclick", "update(sid");

    }

}

function update(sid) {
    // data to be send to the UPDATE request
    var newDate = getFormDate()
    fetch('/student/'+sid, {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {"Content-type": "application/json; charset=UTP-8"}
    }).then (res => {
        if (res.ok) {
            // fill in selected row wiht updated value
            selectedRow.cells[0].innerHTML = newData.stdid;
            selectedRow.cells[1].innerHTML = newData.fname;
            selectedRow.cells[2].innerHTML = newData.lname;
            selectedRow.cells[3].innerHTML = newData.email;
            // set to previous value
            var button = document.getElementById("button-add");
            button.innerHTML = "Add";
            button.setAttribute("onclick", "addStudent()");
            selectedRow = null;

            resetform();
        }else {
            alert("Server: Update request error.")
        }
    })
}
// set form fields to empty
function resetform() {
    document.getElementById("sid").value = "";
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
}
window.onload = function () {
    fetch('/students')
    .then(response => response.text())
    .then(data => showStudents(data));
}

function showStudents(data) {
    const students = JSON.parse(data)
    var table = document.getElementById("mytable");

    students.forEach( stud => {
        newRow(table, stud)
    })
}
function showStudent(data) {
    const student = JSON.parse(data)
    var table = document.getElementById("mytable")
    newRow(table, student)
}
function getFormData() {
    var formData = {
        stdid : parseInt(document.getElementById("sid").value),
        fname : document.getElementById("fname").value,
        lname : document.getElementById("lname").value,
        email : document.getElementById("email").value
    }
    return formData
}