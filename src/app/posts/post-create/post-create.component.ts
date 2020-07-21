import { Component, OnInit, EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public postCreated = new EventEmitter<Post>();

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
  }

  public onAddPost(form: NgForm): void{
    if (form.invalid){
      return;
    }
    this.postsService.addPost(form.value.title.toString(), form.value.content.toString());
    form.resetForm();
  }

}
