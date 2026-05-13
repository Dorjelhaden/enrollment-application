package controller

import (
	"bytes"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

// test case 1 for registered admin
func TestAdmLogin(t *testing.T) {
	// api endpoint
	url := "http://localhost:8080/login"
	// data of type byte slice
	var jsonStr = []byte(`{"email":"pc@gmail.com", "password":"pass"}`)
	// create http request
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	// set request header
	req.Header.Set("Content-Type", "application/json")
	// create a pointer variable client which points to Client struct type
	client := &http.Client{}
	// client sends http request using Do() and gets http response
	resp, err := client.Do(req)
	// handle error if any
	if err != nil {
		panic(err)
	}
	// defer the closing of response body until function terminates
	defer resp.Body.Close()
	// get data from the response body. body is of type []byte
	body, _ := io.ReadAll(resp.Body)
	// validate if response status is same as expected status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	expResp := `{"message":"login success"}`
	// validate if response body is same as expected response body
	assert.JSONEq(t, expResp, string(body))
}

// test case 2 for admin which does not exist
func TestAdmUserNotExist(t *testing.T) {
	url := "http://localhost:8080/login"
	var data = []byte(`{"email": "tsh@msitprogram.net", "password": "pass1"}`)
	// create req object
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")
	// create client
	client := &http.Client{}
	// send POS
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
	assert.JSONEq(t, `{"error":"sql: no rows in result set"}`,
		string(body))
}
