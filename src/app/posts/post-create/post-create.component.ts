import { Component, OnInit, EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public postCreated = new EventEmitter<Post>();
  private postId: string;
  public post: Post;
  public isLoading = false;
  private mode = 'create';

  constructor(private postsService: PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  public onSavePost(form: NgForm): void{
    if (form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
     this.postsService.addPost(form.value.title.toString(), form.value.content.toString());
    } else {
      this.postsService.updatePost(this.postId, form.value.title.toString(), form.value.content.toString());
    }
    form.resetForm();
  }

}
