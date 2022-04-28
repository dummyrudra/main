import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-ngc',
  templateUrl: './ngc.component.html',
  styleUrls: ['./ngc.component.css'],
})
export class NgcComponent implements OnInit {
  sortOptions = [
    'name',
    'age',
    'gender',
    'salary',
    'location',
    'updated_at',
    'created_at',
  ];
  constructor(
    public route: ActivatedRoute,
    private service: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((data) => console.log(data));
    // this.route.queryParamMap.subscribe((data) => console.log(data));
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(
        switchMap((combined) => {
          console.log('params:', combined[0]);
          console.log('query:', combined[1]);
          return this.service.getAll();
        })
      )
      .subscribe((data) => console.log(data));
  }
  navigate() {
    this.router.navigate(
      ['/test', Math.round(Math.random() * 12), Math.round(Math.random() * 99)],
      {
        queryParams: {
          page: Math.round(Math.random() * 99),
          sortBy: this.sortOptions[Math.round(Math.random() * 6)],
        },
      }
    );
  }
}
