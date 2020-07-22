import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient){}

  /**
   * Fetch all posts
   * @memberof PostsService
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
   * @param title
   * @param content
   * @memberof PostsService
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
    });
  }



  /**
   * Fetch a specfic post
   * @param id
   * @memberof PostsService
   */
  public getPost(id: string): Post{
    return { ...this.posts.find(p => p.id === id) };
  }



  /**
   * Update a post
   * @param id
   * @param title
   * @param content
   * @memberof PostsService
   */
  public updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        console.log(response);
    });
  }



  /**
   * Delete a post by ID
   * @param postId
   * @memberof PostsService
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
