import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { JsonPostService } from '../services/json-post.service';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'dummy-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class DummyPostsComponent implements OnInit {
  form: any;
  posts: any = [];
  showLoader: boolean = true;

  constructor(private service: JsonPostService, fb: FormBuilder) {
    this.form = fb.group({
      title: fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.service.getAll().subscribe(
      (response) => {
        this.showLoader = false;
        this.posts = response;
      },
      (error: AppError) => {
        this.showLoader = false;
        throw error;
      }
    );
  }

  createPost(input: HTMLInputElement) {
    if (input.value.length === 0) return;
    let post = { title: input.value, body: '....' };
    input.value = '';
    this.service.create(post).subscribe(
      (response) => {
        this.posts.unshift(response);
      },
      (error: AppError) => {
        if (error instanceof BadInput) {
          this.form.setErrors({ badRequest: error.originalError.message });
        } else throw error;
      }
    );
  }
  updatePost(post: any) {
    post.isRead = !post.isRead;
    this.service.updatePatch(post).subscribe(
      (response) => {
        let index = this.posts.findIndex((p: any) => p.id === post.id);
        this.posts[index] = { ...this.posts[index], ...response };
      },
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          return alert('Post has already been deleted');
        } else throw error;
      }
    );
  }

  deletePost(post: any) {
    this.service.delete(post.id).subscribe(
      (response) => {
        let index = this.posts.findIndex((p: any) => p.id === post.id);
        this.posts.splice(index, 1);
      },
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          return alert('Not Found');
        } else throw error;
      }
    );
  }
}
