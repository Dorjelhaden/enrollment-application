package controller

import (
	"encoding/json"
	"net/http"
	"strings"

	"myapp/model"
	"myapp/utils/httpResp"

	"github.com/gorilla/mux"
)

func AddCourse(w http.ResponseWriter, r *http.Request) {
	if !VerifyCookie(w, r) {
		return
	}
	var c model.Course
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	defer r.Body.Close()

	c.CID = strings.TrimSpace(c.CID)
	c.CName = strings.TrimSpace(c.CName)
	if c.CID == "" || c.CName == "" {
		httpResp.RespondWithError(w, http.StatusBadRequest, "course id and name are required")
		return
	}

	if err := c.Create(); err != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusCreated, map[string]string{"status": "course added"})
}

func GetAllCourses(w http.ResponseWriter, r *http.Request) {
	if !VerifyCookie(w, r) {
		return
	}
	courses, err := model.GetAllCourses()
	if err != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, courses)
}

func UpdateCourse(w http.ResponseWriter, r *http.Request) {
	if !VerifyCookie(w, r) {
		return
	}
	oldCid := mux.Vars(r)["cid"]
	if oldCid == "" {
		httpResp.RespondWithError(w, http.StatusBadRequest, "course id is required")
		return
	}

	var c model.Course
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	defer r.Body.Close()

	c.CID = strings.TrimSpace(c.CID)
	c.CName = strings.TrimSpace(c.CName)
	if c.CID == "" || c.CName == "" {
		httpResp.RespondWithError(w, http.StatusBadRequest, "course id and name are required")
		return
	}

	if err := c.Update(oldCid); err != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "course updated"})
}

func DeleteCourse(w http.ResponseWriter, r *http.Request) {
	if !VerifyCookie(w, r) {
		return
	}
	cid := mux.Vars(r)["cid"]
	if cid == "" {
		httpResp.RespondWithError(w, http.StatusBadRequest, "course id is required")
		return
	}
	c := model.Course{CID: cid}
	if err := c.Delete(); err != nil {
		httpResp.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "course deleted"})
}
