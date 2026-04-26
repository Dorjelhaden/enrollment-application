package model

import "myapp/datastore/postgres"

type Admin struct {
	FirstName string
	LastName  string
	Email     string
	Password  string
}

const queryInsertAdmin = "INSERT INTO admin(firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING email;"

func (adm *Admin) Create() error {
	row := postgres.Db.QueryRow(queryInsertAdmin, adm.FirstName,
		adm.LastName, adm.Email, adm.Password)
	err := row.Scan(&adm.Email)
	return err
}
