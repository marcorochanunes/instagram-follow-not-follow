import { Injectable } from "@angular/core";
import {
  FOLLOWERS,
  FOLLOWERS_FILE,
  FOLLOWING,
  FOLLOWING_FILE,
} from "../constants/file-names.constant";
import { BehaviorSubject } from "rxjs";

import { UserData } from "../models/user-data";
import { IdentifiedFile } from "../models/identified-file.model";
import { FILE_TYPE_NAME, FileType } from "../models/file-names.model";

@Injectable({
  providedIn: "root",
})
export class FileProcessingService {
  private followers: UserData[] = [];
  private following: UserData[] = [];
  private notFollowMeSubject = new BehaviorSubject<UserData[]>([]);
  private notFollowingSubject = new BehaviorSubject<UserData[]>([]);

  notFollowMe$ = this.notFollowMeSubject.asObservable();
  notFollowing$ = this.notFollowingSubject.asObservable();

  private getFileData(fileName: string, fileData: any): UserData[] {
    if (fileName === FOLLOWERS_FILE) {
      return fileData.map((entry: any) => entry.string_list_data[0]);
    }

    if (fileName === FOLLOWING_FILE) {
      return fileData.relationships_following.map(
        (entry: any) => entry.string_list_data[0]
      );
    }

    return [];
  }

  private identifyFiles(files: File[]): IdentifiedFile[] {
    return files
      .map((file) => {
        const type = (Object.keys(FILE_TYPE_NAME) as FileType[]).find(
          (key) => FILE_TYPE_NAME[key] === file.name
        );

        return type ? { type, file } : null;
      })
      .filter((item): item is IdentifiedFile => item !== null);
  }

  private processFile(file: File): Promise<UserData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileData = JSON.parse(reader.result as string);
          const userData: UserData[] = this.getFileData(file.name, fileData);

          resolve(userData);
        } catch (error) {
          reject(`Error processing the ${file.name} file: ${error}`);
        }
      };
      reader.onerror = () => reject(`Error reading the ${file.name} file`);
      reader.readAsText(file);
    });
  }

  private updateFollowersAndFollowing(
    results: { type: FileType; data: UserData[] }[]
  ): void {
    results.forEach(({ type, data }) => {
      switch (type) {
        case FOLLOWERS:
          this.followers = data;
          break;
        case FOLLOWING:
          this.following = data;
          break;
        default:
          break;
      }
    });
  }

  private calculateComparisonBetweenFollowersAndFollowing(): void {
    if (this.followers.length && this.following.length) {
      const notFollowMe = this.following.filter(
        (user) => !this.followers.includes(user)
      );
      const notFollowing = this.followers.filter(
        (user) => !this.following.includes(user)
      );

      this.notFollowMeSubject.next(notFollowMe);
      this.notFollowingSubject.next(notFollowing);
    }
  }

  processFiles(files: File[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const processPromises = this.identifyFiles(files).map(({ type, file }) =>
        this.processFile(file).then((data) => ({ type, data }))
      );

      Promise.all(processPromises)
        .then((results) => {
          this.updateFollowersAndFollowing(results);
          this.calculateComparisonBetweenFollowersAndFollowing();
          resolve(true);
        })
        .catch((error) => reject(error));
    });
  }

  clearData() {
    this.followers = [];
    this.following = [];
    this.notFollowMeSubject.next([]);
    this.notFollowingSubject.next([]);
  }
}
