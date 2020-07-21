import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  public postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  public getPosts(): void {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe((postData) => {
      this.posts = postData.posts;
      this.postsUpdated.next(this.posts.slice());
    });
  }

  public addPost(title: string, content: string): void{
    const post: Post = {
      id: null,
      title,
      content
    };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next(this.posts.slice());
    });
  }
}
