import { StudentDataService } from './../student-data.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export class Course {
  #_id!: string;
  #code!: string;
  #title!: string;
  #capacity!: number;

  get _id() { return this.#_id; }
  get code() { return this.#code; }
  get title() { return this.#title; }
  get capacity() { return this.#capacity; }

  set _id(_id: string) { this.#_id = _id; }

  set code(code: string) { this.#code = code; }
  set title(title: string) { this.#title = title; }

  constructor(course: any) {
    this.#_id = course._id;
    this.#code = course.code;
    this.#title = course.title;
    this.#capacity = course.capacity;
  }
}

export class Student {
  #_id!: string;
  #name!: string;
  #gpa!: number;
  #courses!: Course[];

  get _id() { return this.#_id; }
  get courses() { return this.#courses; }
  get name() { return this.#name; }
  get gpa() { return this.#gpa; }

  set _id(_id: string) { this.#_id = _id; }

  set courses(courses: Course[]) { this.#courses = courses; }
  set name(name: string) { this.#name = name; }
  set gpa(gpa: number) { this.#gpa = gpa; }

  constructor(student: any) {
    this.#_id = student._id;
    this.#courses = student.courses;
    this.#name = student.name;
    this.#gpa = student.gpa;
  }

}
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students!: Student[];
  addNewFormEditState = false;
  editData!: Student;
  title: any
  constructor(private _studentsService:StudentDataService, private _router:Router) { }

  loadStudents(): void {
    console.log('load clicked');
    this._studentsService.getStudents().subscribe({
      next: (response) => this.fillStudentsFromService(response),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }
  ngOnInit(): void {
    this._studentsService.getStudents().subscribe(response => this.fillStudentsFromService(response));
  }

  private fillStudentsFromService(students: Student[]) {
    this.students = students;
  }


  onDelete(student_id: string) {
    this._studentsService.deleteStudents(student_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => console.error(e),
      complete: () => {
        this.loadStudents();
        console.info('delete successful')
      }
    });

    console.log('deleted movieId: ' + student_id);
  }



}
