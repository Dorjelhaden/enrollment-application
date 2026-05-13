package postgres

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// Database connection details
const (
	postgres_host     = "dpg-d7tbdcf7f7vs73fajq0g-a"
	postgres_port     = 5432
	postgres_user     = "postgres_admin"
	postgres_password = "JXDbYy1ZkE3RMRv9zM7xUPO3XJeNxG5D"
	postgres_dbname   = "mydb_fty5"
)

// Global pointer to the database connection
var Db *sql.DB

// init() runs automatically before main()
func init() {
	// Build connection string
	db_info := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=require",
		postgres_host, postgres_port, postgres_user, postgres_password, postgres_dbname,
	)

	var err error
	// Open connection
	Db, err = sql.Open("postgres", db_info)
	if err != nil {
		panic(err)
	} else {
		log.Println("Database successfully connected")
	}
}
