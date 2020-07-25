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
  public postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router){}

  /**
   * Fetch all posts
   * @returns --void
   */
  public getPosts(): void {
    this.http.get<{ message: string, posts: PostResponseData[]}>('http://localhost:3000/api/posts')
      .pipe(map( postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id.toString(),
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe( transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next(this.posts.slice());
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
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe((responseData) => {
      const post: Post = { id: responseData.post.id, title, content, imagePath: responseData.post.imagePath};
      this.posts.push(post);
      this.postsUpdated.next(this.posts.slice());
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
        // Immutably updating this.posts
        const updatedPosts = this.posts.slice();
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {id, title, content, imagePath: ''};
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next(this.posts.slice());
        this.router.navigate(['/']);
    });
  }



  /**
   * Delete a post by ID
   * @param --(postId: string)
   * @returns --void
   */
  public deletePost(postId: string): void{
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Deleted');
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next(this.posts.slice());
      });
  }
}
