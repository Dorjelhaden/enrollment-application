package routes

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"myapp/controller"

	"github.com/gorilla/mux"
)

func InitializeRoutes() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	staticPath := findStaticPath()

	router := mux.NewRouter()
	router.HandleFunc("/student", controller.AddStudent).Methods("POST")
	router.HandleFunc("/student/add", controller.AddStudent).Methods("POST")
	router.HandleFunc("/home/{sid}", controller.GetStudent).Methods("GET")
	router.HandleFunc("/student/update/{sid}", controller.UpdateStudent).Methods("PUT")
	router.HandleFunc("/student/{sid}", controller.DeleteStudent).Methods("DELETE")
	router.HandleFunc("/students", controller.GetAllStudents)

	router.HandleFunc("/enroll", controller.Enroll).Methods("POST")
	router.HandleFunc("/enrolls", controller.GetEnrolls).Methods("GET")
	router.HandleFunc("/enroll/{sid}/{cid}", controller.DeleteEnroll).Methods("DELETE")

	router.HandleFunc("/courses", controller.AddCourse).Methods("POST")
	router.HandleFunc("/courses", controller.GetAllCourses).Methods("GET")
	router.HandleFunc("/courses/{cid}", controller.UpdateCourse).Methods("PUT")
	router.HandleFunc("/courses/{cid}", controller.DeleteCourse).Methods("DELETE")

	router.HandleFunc("/signup", controller.Signup).Methods("POST")
	router.HandleFunc("/login", controller.Login).Methods("POST")
	router.HandleFunc("/logout", controller.Logout).Methods("GET")

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(staticPath, "index.html"))
	}).Methods("GET")

	fhandler := http.FileServer(http.Dir(staticPath))
	router.PathPrefix("/").Handler(fhandler)

	log.Println("Application running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func findStaticPath() string {
	if _, err := os.Stat("view"); err == nil {
		return "view"
	}

	if _, err := os.Stat(filepath.Join("myapp", "view")); err == nil {
		return filepath.Join("myapp", "view")
	}

	log.Fatal("static view folder not found")
	return ""
}
