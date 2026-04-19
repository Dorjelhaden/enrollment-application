package controller

import (
	"database/sql"
	"encoding/json"
	"myapp/model"

	"myapp/utils/httpResp"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func AddStudent(w http.ResponseWriter, r *http.Request) {
	// create variable type student
	var stud model.Student

	// get data from request body
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&stud); err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "Invalid json body")
		return
	}

	r.Body.Close()

	// call model function by passing student data
	saveErr := stud.Create()
	if saveErr != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, saveErr.Error())
		return
	}
	// no error
	httpResp.RespondWithJSON(w, http.StatusCreated, map[string]string{"status": "student addded"})
}
func GetStudent(w http.ResponseWriter, r *http.Request) {

	// get URL parameter (id)
	sid := mux.Vars(r)["sid"]
	stdId, idErr := getUserId(sid)
	if idErr != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, idErr.Error())
		return
	}
	s := model.Student{StdId: stdId}
	getErr := s.Read()
	if getErr != nil {
		switch getErr {
		case sql.ErrNoRows:
			httpResp.RespondWithError(w, http.StatusNotFound, "Student not found")
		default:
			httpResp.RespondWithError(w, http.StatusInternalServerError, getErr.Error())
		}
		return
	}

	httpResp.RespondWithJSON(w, http.StatusOK, s)
}
func getUserId(userIdParm string) (int64, error) {
	userId, userErr := strconv.ParseInt(userIdParm, 10, 64)
	if userErr != nil {
		return 0, userErr
	}
	return userId, nil
}
func UpdateStudent(w http.ResponseWriter, r *http.Request) {
	old_sid := mux.Vars(r)["sid"]
	old_stdId, idErr := getUserId(old_sid)
	if idErr != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, idErr.Error())
		return
	}
	var stud model.Student
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&stud); err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "Invalid json body")
		return
	}
	defer r.Body.Close()

	updateErr := stud.Update(old_stdId)
	if updateErr != nil {
		switch updateErr {
		case sql.ErrNoRows:
			httpResp.RespondWithError(w, http.StatusNotFound, "Student not found")
		default:
			httpResp.RespondWithError(w, http.StatusInternalServerError, updateErr.Error())
		}
	} else {
		httpResp.RespondWithJSON(w, http.StatusOK, stud)
	}
}
func DeleteStudent(w http.ResponseWriter, r *http.Request) {
	sid := mux.Vars(r)["sid"]
	stdId, idErr := getUserId(sid)
	if idErr != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, idErr.Error())
		return

	}
	s := model.Student{StdId: stdId}
	if err := s.Delete(); err != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "student deleted"})
}
func GetAllStudents(w http.ResponseWriter, r *http.Request) {
	students, getErr := model.GetAllStudents()
	if getErr != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, getErr.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, students)
}
