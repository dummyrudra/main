import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import { BadInput } from '../../bad-input';
import { NotFoundError } from '../../not-found-error';
import { UnauthorisedError } from '../../unauthorised-error';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  @Output('newPostEvent') newPostEvent = new EventEmitter();
  @Input('user') user: any;
  form: any;
  // localPostImageUrl: string = '';
  images: any = [];
  postImages: any = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write something...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        // 'underline',
        // 'strikeThrough',
        // 'subscript',
        // 'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        // 'indent',
        // 'outdent',
        // 'insertUnorderedList',
        // 'insertOrderedList',
        // 'heading',
        // 'fontName',
      ],
      [
        // 'fontSize',
        // 'textColor',
        // 'backgroundColor',
        'customClasses',
        // 'link',
        // 'unlink',
        'insertImage',
        // 'insertVideo',
        // 'insertHorizontalRule',
        // 'removeFormat',
        // 'toggleEditorMode',
      ],
    ],
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
  };

  constructor(
    private fb: FormBuilder,
    private service: PostsService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      message: fb.control('', []),
      postFile: fb.control('', []),
      fileSource: fb.control('', []),
    });
  }

  get message() {
    return this.form.get('message');
  }

  get postFile() {
    return this.form.get('postFile');
  }

  ngOnInit(): void {}

  post() {
    if (
      !this.form.valid ||
      (!this.form.get('message').value &&
        !this.form.get('fileSource').value &&
        (this.images.length === 0 || this.postImages.length === 0)) ||
      !this.user?._id
    )
      return;

    let formData = new FormData();
    if (this.form.get('message').value)
      formData.append('message', this.form.get('message').value);

    // if (this.form.get('fileSource').value) {
    //   formData.append('postFile', this.form.get('fileSource').value);
    // }

    for (let file of this.postImages) {
      formData.append('postFile', file);
    }

    this.service
      .createById(this?.user?._id, formData)
      .then((response) => {
        this.newPostEvent.emit(response);
        this.form.reset();
        this.images = [];
        this.postImages = [];
        // this.localPostImageUrl = '';
      })
      .catch((error) => {
        this.form.reset();
        this.images = [];
        this.postImages = [];
        // this.localPostImageUrl = '';
        this.handleError(error);
      });
  }

  // updateImageUrl(url: any) {
  //   this.localPostImageUrl = url;
  // }

  onFileSelect(event: any) {
    this.images = [];
    this.postImages = [];
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files && event.target.files[0]) {
      // const file = event.target.files[0];

      for (let i = 0; i < event.target.files.length; i++) {
        if (allowedExtensions.includes(event.target.files[i].type)) {
          //  event.target.value = '';
          //  this.localPostImageUrl = '';
          //  return this.form.controls['postFile'].setErrors({
          //    invalidFileExtension: true,
          //  });
          if (this.images.length < 10) {
            this.images.push(URL.createObjectURL(event.target.files[i]));
            this.postImages.push(event.target.files[i]);
          }
        }
      }
      if (this.images.length === 0) {
        event.target.value = '';
        // this.localPostImageUrl = '';
        return this.form.controls['postFile'].setErrors({
          invalidFileExtension: true,
        });
      }
      // this.form.patchValue({ fileSource: file });
      // this.localPostImageUrl = URL.createObjectURL(event.target.files[0]);
      this.form.controls['postFile'].touched = true;
    }
  }

  deletePostImage(file: any) {
    let index = this.images.indexOf(file);
    this.images.splice(index, 1);
    this.postImages.splice(index, 1);
  }

  getFilePath(file: any) {
    return URL.createObjectURL(file);
  }

  handleError(error: any) {
    if (
      error instanceof UnauthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    )
      this.toastr.error(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status,
        {
          progressBar: true,
          closeButton: true,
          timeOut: 800,
        }
      );
    else
      this.toastr.error('Something went wrong!', '500', {
        progressBar: true,
        closeButton: true,
        timeOut: 800,
      });
  }
}
