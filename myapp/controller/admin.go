package controller

import (
	"encoding/json"
	"myapp/model"
	"myapp/utils/httpResp"
	"net/http"
	"time"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	var admin model.Admin
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&admin); err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	defer r.Body.Close()
	saveErr := admin.Create()
	if saveErr != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, saveErr.Error())
		return
	}
	// no error
	httpResp.RespondWithJSON(w, http.StatusCreated, map[string]string{"status": "admin added"})
}
func Login(w http.ResponseWriter, r *http.Request) {
	var admin model.Admin
	err := json.NewDecoder(r.Body).Decode(&admin)
	if err != nil {
		httpResp.RespondWithError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	defer r.Body.Close()

	getErr := admin.Get()
	if getErr != nil {
		httpResp.RespondWithError(w, http.StatusUnauthorized, getErr.Error())
		return
	}

	// set cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "my-cookie",
		Value:    "my-value",
		Path:     "/",
		Expires:  time.Now().Add(30 * time.Minute),
		MaxAge:   1800,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "login success"})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "my-cookie",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "cookie deleted"})
}

func Verify(w http.ResponseWriter, r *http.Request) {
	if !VerifyCookie(w, r) {
		return
	}
	httpResp.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func VerifyCookie(w http.ResponseWriter, r *http.Request) bool {
	// Retrieve the "my-cookie" cookie from the request
	cookie, err := r.Cookie("my-cookie")
	if err != nil {
		if err == http.ErrNoCookie {
			httpResp.RespondWithError(w, http.StatusUnauthorized, "cookie not found")
			return false
		}

		httpResp.RespondWithError(w, http.StatusInternalServerError, "internal server error")
		return false
	}
	// Verify the cookie value
	if cookie.Value != "my-value" {
		// Invalid cookie value, redirect to login page or return an error
		httpResp.RespondWithError(w, http.StatusUnauthorized, "cookie does not match")
		return false
	}
	return true
}
