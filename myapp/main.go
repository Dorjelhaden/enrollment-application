package main

import "myapp/routes"

func main() {
	routes.InitializeRoutes()
	// 	// Create a new router
	// 	router := mux.NewRouter()

	// 	// Register route and handler
	// 	router.HandleFunc("/home/{course}", homeHandler)

	// 	// Start the server
	// 	fmt.Println("Server running on http://localhost:8080")
	// 	err := http.ListenAndServe(":8080", router)
	// 	if err != nil {
	// 		fmt.Println("Error:", err)
	// 	}
	// }

	// // Handler function
	//
	//	func homeHandler(w http.ResponseWriter, r *http.Request) {
	//		p := mux.Vars(r)
	//		course := p["course"]
	//		_, err := w.Write([]byte("hello world. \nThis course is" + course))
	//		if err != nil {
	//			fmt.Println("error:", err)
	//		}
}
