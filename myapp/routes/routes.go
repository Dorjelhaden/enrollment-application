package routes

import (
	"log"
	"myapp/controller"
	"net/http"

	"github.com/gorilla/mux"
)

func InitializeRoutes() {
	var port = 8080
	router := mux.NewRouter()
	router.HandleFunc("/student/add", controller.AddStudent).Methods("POST")
	router.HandleFunc("/home/{sid}", controller.GetStudent).Methods("GET")
	router.HandleFunc("/student/update/{sid}", controller.UpdateStudent).Methods("PUT")
	router.HandleFunc("/student/{sid}", controller.DeleteStudent).Methods("DELETE")

	log.Println("Application running on port", port)
	log.Fatal(http.ListenAndServe(":8080", router))
}
