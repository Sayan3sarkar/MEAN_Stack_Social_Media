import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  public postsUpdated = new Subject<Post[]>();


  public getPosts(): Post[] {
    return this.posts.slice();
  }

  public addPost(title: string, content: string): void{
    const post: Post = {
      title: title,
      content: content
    };
    this.posts.push(post);
    this.postsUpdated.next(this.posts.slice());
  }
}
