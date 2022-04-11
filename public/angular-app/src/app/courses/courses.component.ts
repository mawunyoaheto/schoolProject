import { StudentDataService } from './../student-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../students/students.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses!: Course[];

  @Input()
  studentId = '';
  count: number = 1; showForm = false;
  addNewFormEditState = false;
  editData!: Course;
  title: any
  constructor(private _studentService: StudentDataService, private _router: Router) { }

  ngOnInit(): void {
  }

  private fillCoursesFromService(courses: Course[]) {
    this.courses = courses;
    console.log('got actors', courses);
  }

  loadCourses(): void {
    this._studentService.getCourses(this.studentId).subscribe({
      next: (response) => this.fillCoursesFromService(response.actors),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  openForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addNewFormEditState = false;
    }
  }

  closeForm(event: boolean) {
    if (event) {
      this.addNewFormEditState = false;

      this.loadCourses();
      this.openForm();
    }
  }

  onDelete(course_id: string) {
    this._studentService.deleteCourses(this.studentId,course_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => console.error(e),
      complete: () => {
        this.loadCourses();
        console.info('delete successful')
      }
    });
  }

  editCourse(course: Course) {
    this.addNewFormEditState = true;
    this.editData = course;
    this.openForm();
  }
}
