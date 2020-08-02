import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '@env/environment';

export interface PostResponseData {
  _id: string;
  title: string;
  content: string;
  __v: number;
  imagePath: string;
  creator: any;
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
    this.http.get<{ message: string, posts: PostResponseData[], maxPosts: number}>(`${environment.API_ENDPOINT_URL}/posts${queryParams}`)
      .pipe(map( postData => {
        return {
          posts: postData.posts.map(post => {
            console.log(post);
            return {
              title: post.title,
              content: post.content,
              id: post._id.toString(),
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
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
    this.http.post<{ message: string, post: Post,  }>(`${environment.API_ENDPOINT_URL}/posts`, postData).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }



  /**
   * Fetch a specfic post
   * @param --(id: string)
   * @returns --(post: Post)
   */
  public getPost(id: string): Observable<PostResponseData>{
    return this.http.get<PostResponseData>(`${environment.API_ENDPOINT_URL}/posts/${id}`);
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
      postData = { id, title, content, imagePath: image, creator: null };
      // setting creator to null ensures creator id is updated from server side and can't be manipulated from client-side
    }
    this.http.put<{ message: string }>(`${environment.API_ENDPOINT_URL}/posts/${id}`, postData)
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
    return this.http.delete<{message: string}>(`${environment.API_ENDPOINT_URL}/posts/${postId}`);
  }
}
