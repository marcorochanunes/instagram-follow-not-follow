import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

import { UserData } from '../../models/user-data';
import { FileProcessingService } from '../../services/file-processing.service';
import { CardComponent } from '../shared/card/card.component';
import { FILE_TYPE_NAME } from '../../models/file-names.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    RouterModule,
    CardComponent,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  followers: UserData[] = [];
  following: UserData[] = [];
  notFollowing: UserData[] = [];
  notFollowMe: UserData[] = [];

  showResultsLink = false;

  constructor(
    private messageService: MessageService,
    private fileProcessingService: FileProcessingService,
    private router: Router
  ) {}

  private validateFileNames(files: File[]): boolean {
    const missingFiles = Object.values(FILE_TYPE_NAME).filter(
      (key) => !files.some((file) => file.name === key)
    );

    if (missingFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `JSON File(s) missing: ${missingFiles.join(', ')}`,
      });
      return false;
    }

    return true;
  }

  async handleFileInput(event: { files: File[] }) {
    {
      if (event.files?.length === 2) {
        const files: File[] = event.files;
        if (!this.validateFileNames(files)) {
          return;
        }

        try {
          this.messageService.add({
            severity: 'info',
            summary: 'Processing Files',
            detail:
              'Your files are being processed. Please wait until the process is completed.',
          });
          const result = await this.fileProcessingService.processFiles(files);

          if (result) {
            this.showResultsLink = true;

            this.messageService.add({
              severity: 'success',
              summary: 'Files Processed Successfully',
              detail:
                'Files have been processed. You can now view the results.',
            });
          }
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error}`,
          });
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Please upload exactly two files: ${Object.values(
            FILE_TYPE_NAME
          )} `,
        });
      }
    }
  }
}
