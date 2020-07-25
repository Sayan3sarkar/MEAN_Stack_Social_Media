import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private postSub: Subscription;
  public posts: Post[] = [];
  public isLoading = false;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSub = this.postsService.postsUpdated.subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  public onDelete(postId: string): void {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
