
import { StudentDataService } from './../student-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../students/students.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})

export class StudentComponent implements OnInit {
  student!: Student
  studentId!:string
  route: any;
  constructor(private _studentSrvice: StudentDataService, private _router: Router) {
    this.student = new Student({ _id: "1", name: "Kofi James", gpa: 3.5, courses: [{ code: "CS557", title: "MWA",capacity:20 }]});
  }

  ngOnInit() {
    this.studentId = this.route.snapshot.params["studentId"];

    this._studentSrvice.getStudent(this.studentId).subscribe({
      next: (response) => this.fillStudentFromService(response),
      error: (e) => console.error(e),
      complete: () => console.log('get movie', this.student)
    });
  }

  private fillStudentFromService(Student: Student): void {
    this.student = this.student;
    console.log('got movie', this.student);
  }

  onDelete(studentId:string, courseId:string) {
    this._studentSrvice.deleteCourse(studentId,courseId).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => {
        console.error(e)

      },
      complete: () => {
       // this.loadMovies();
        console.info('delete successful')
      }
    });

    console.log('deleted actorId: ' + courseId);
  }

  editCourse(studentId:string, courseId:string) {
    // this.addNewFormEditState = true;
    // this.editData = movie;
    // this.openForm();
  }

}
