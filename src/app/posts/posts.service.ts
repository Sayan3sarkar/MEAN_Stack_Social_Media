import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

export interface PostResponseData {
  _id: any;
  title: string;
  content: string;
  __v: number;
  imagePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  public postsUpdated = new Subject < { posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  /**
   * Fetch all posts
   * @returns --void
   */
  public getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: PostResponseData[], maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map( postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id.toString(),
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe( transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: this.posts.slice(), postCount: transformedPostData.maxPosts});
    });
  }



  /**
   * Add a new post
   * @param --(title: string)
   * @param --(content: string)
   * @returns --void
   */
  public addPost(title: string, content: string, image: File): void{
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post,  }>('http://localhost:3000/api/posts', postData).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }



  /**
   * Fetch a specfic post
   * @param --(id: string)
   * @returns --(post: Post)
   */
  public getPost(id: string): Observable<PostResponseData>{
    return this.http.get<PostResponseData>('http://localhost:3000/api/posts/' + id);
  }



  /**
   * Update a post
   * @param --(id: string)
   * @param --(title: string)
   * @param --(content: string)
   * @returns --void
   */
  public updatePost(id: string, title: string, content: string, image: File | string): void {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
    });
  }



  /**
   * Delete a post by ID
   * @param --(postId: string)
   * @returns --void
   */
  public deletePost(postId: string): Observable<{message: string}>{
    return this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId);
  }
}
