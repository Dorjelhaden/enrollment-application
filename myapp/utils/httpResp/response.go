// package httpResp

// import (
// 	"encoding/json"
// 	"net/http"

// 	"myapp/model"
// )

// func AddStudent(w http.ResponseWriter, r *http.Request) {
// 	// create variable type student
// 	var stud model.Student

// 	// get data from request body
// 	decoder := json.NewDecoder(r.Body)
// 	if err := decoder.Decode(&stud); err != nil {
// 		httpResp.RespondWithError(w, http.StatusBadRequest, "Invalid json body")
// 		return
// 	}

// 	r.Body.Close()

//		// call model function by passing student data
//		saveErr := stud.Create()
//		if saveErr != nil {
//			httpResp.RespondWithError(w, http.StatusBadRequest, saveErr.Error())
//			return
//		}
//		// no error
//		httpResp.RespondWithJSON(w, http.StatusCreated, map[string]string{"status": "student addded"})
//	}
package httpResp

import (
	"encoding/json"
	"net/http"
)

func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, map[string]string{"error": message})
}

func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
