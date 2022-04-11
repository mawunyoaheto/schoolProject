import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Course, Student } from './students/students.component';


@Injectable({
  providedIn: 'root'
})
export class StudentDataService {

  baseUrl="http://localhost:3000/api/"

  constructor(private http:HttpClient) { }


  getStudents():Observable<any>{
    return this.http.get<Student[]>(this.baseUrl+"students");
  }

  public getStudent(id: string):Observable<Student> {
    const url: string= this.baseUrl + "students/" + id;
    return this.http.get<Student>(url);
    }

  deleteStudents(studentId: any):Observable<any> {
    return this.http.delete(`${this.baseUrl}students/${studentId}`);
  }

  deleteCourse(studentId:string,courseId:string):Observable<any> {

    return this.http.delete(`${this.baseUrl}students/${studentId}/courses/${courseId}`);
  }

  editCourse(studentId:string,courseId:string):Observable<any> {

    return this.http.delete(`${this.baseUrl}students/${studentId}/courses/${courseId}`);
}


getCourses(student_Id:string):  Observable<any> {
  let url =`${this.baseUrl}students/${student_Id}/courses`
  return this.http.get<Course[]>(url);
}

deleteCourses(studentId:string,courseId:string):Observable<any> {

  return this.http.delete(`${this.baseUrl}students/${studentId}/courses/${courseId}`);
}
}

