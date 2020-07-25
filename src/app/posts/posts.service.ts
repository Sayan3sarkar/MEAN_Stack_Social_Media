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
            id: post._id.toString()
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
  public addPost(title: string, content: string): void{
    const post: Post = {
      id: null,
      title,
      content
    };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      post.id = responseData.postId;
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
  public updatePost(id: string, title: string, content: string): void {
    const post: Post = { id, title, content };
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        // Immutably updating this.posts
        const updatedPosts = this.posts.slice();
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
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
