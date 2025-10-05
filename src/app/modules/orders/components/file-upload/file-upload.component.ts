import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  @Input()
  multiple = false;

  @Input()
  label = 'Upload';

  @Output()
  files$ = new EventEmitter<FileList | null>();

  @Input()
  uploadedFileName?: string;

  @Input()
  disabled = false;

  public files: FileList | null = null;

  protected onFilesChange(files: FileList | null) {
    this.files = files;
    this.files$.emit(files);
  }

  get uploadedFile() {
    if (this.files && this.files.length > 0) {
      return this.files[0].name;
    }

    return this.uploadedFileName;
  }
}
