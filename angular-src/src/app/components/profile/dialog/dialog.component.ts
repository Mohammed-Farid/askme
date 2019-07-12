import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Reply, Question, CustomResponse, Cookies } from 'src/app/models/models';
import { RepliesService } from 'src/app/services/replies.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  modes;
  input;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private repliesService: RepliesService,
    private cookieService: CookieService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    console.log(data);
    this.modes = {
      edit: this.data.mode === 'edit',
      reply: this.data.mode === 'reply',
      delete: this.data.mode === 'delete'
    };

    if (this.modes.edit) {
      this.input = new FormControl(this.data.data.content, Validators.required);
    } else {
      this.input = new FormControl('', Validators.required);
    }
  }

  // For Repl



  onSubmit() {
    const question: Question = this.data.question;
    const userReply: Reply = {
      question: question.id,
      by: question.asked,
      content: this.input.value,
    };

    const cookies: Cookies = this.cookieService.getAll();

    const token = cookies.token;

    this.repliesService.postReply(userReply, token).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onEditSubmit() {
    console.log(this.input.value);
  }

  ngOnInit() {
  }

}
