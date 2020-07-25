import { Component, OnInit, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  public form: FormGroup;
  public imagePreview: string;

  constructor(private postsService: PostsService, private route: ActivatedRoute) { }

  public initForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required, mimeType)
    });
  }

  ngOnInit(): void {

    this.initForm();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath };
          this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  public onImagePickedHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; // necessary since by default, typescript does'nt
    // know event.target to be of HTMLInputElement and thus can't access '.files' by default
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  public onSavePost(): void{
    if (this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
     this.postsService.addPost(this.form.value.title.toString(), this.form.value.content.toString(), this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title.toString(),
        this.form.value.content.toString(),
        this.form.value.image);
    }
    this.form.reset();
  }

}
