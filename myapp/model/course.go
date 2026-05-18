package model

import "myapp/datastore/postgres"

type Course struct {
	CID   string `json:"cid"`
	CName string `json:"cname"`
}

const queryInsertCourse = "INSERT INTO course (cid, coursename) VALUES ($1, $2);"
const queryGetAllCourses = "SELECT cid, coursename FROM course;"
const queryDeleteCourse = "DELETE FROM course WHERE cid = $1 RETURNING cid;"

func (c *Course) Create() error {
	_, err := postgres.Db.Exec(queryInsertCourse, c.CID, c.CName)
	return err
}

func GetAllCourses() ([]Course, error) {
	rows, err := postgres.Db.Query(queryGetAllCourses)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courses := []Course{}
	for rows.Next() {
		var c Course
		if err := rows.Scan(&c.CID, &c.CName); err != nil {
			return nil, err
		}
		courses = append(courses, c)
	}
	return courses, nil
}

func (c *Course) Delete() error {
	var cid string
	return postgres.Db.QueryRow(queryDeleteCourse, c.CID).Scan(&cid)
}
