import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
  }

  repos;
  page = 0;
  notEmptyRepo = true;
  notscrolly = true;

  ngOnInit() {
    this.loadInitPost();
  }

  // load the inital 30 page
  loadInitPost() {
    const url = 'https://api.github.com/search/repositories?q=created:%3e' + this.getCurrentDate() + '&sort=stars&order=desc&page=' + this.page;//make call for last 30 days
    this.http.get(url).subscribe((data: any) => {
      this.repos = data.items;
    });
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyRepo) {
      this.spinner.show();
      this.notscrolly = false;
      this.loadNextPost();
    }
  }

  getCurrentDate() {
    const utc = new Date();//get current date
    utc.setDate(utc.getDate() - 30);//go back to last 30th date
    return utc.toJSON().slice(0, 10);
  }

  // load the next 30 page
  loadNextPost() {
    const url = 'https://api.github.com/search/repositories?q=created:%3e' + this.getCurrentDate() + '&sort=stars&order=desc&page=' + this.page++;//make call for last 30 days
    this.http.get(url).subscribe((data: any) => {
      this.spinner.hide();
      if (data.items.length === 0) {
        this.notEmptyRepo = false;
      }
      // add newly fetched repos to the existing repos
      this.repos = this.repos.concat(data.items);
      this.notscrolly = true;
    });
  }
}
