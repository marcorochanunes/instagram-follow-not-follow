import { Component, OnInit } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";

import { Subscription } from "rxjs";
import { UserData } from "../../models/user-data";
import { FileProcessingService } from "../../services/file-processing.service";
import { CardComponent } from "../shared/card/card.component";

@Component({
  selector: "app-results",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    CardComponent,
  ],
  templateUrl: "./results.component.html",
  styleUrl: "./results.component.scss",
})
export class ResultsComponent implements OnInit {
  rows: number = 5;
  notFollowMe: UserData[] = [];
  notFollowing: UserData[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private fileProcessingService: FileProcessingService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.fileProcessingService.notFollowMe$.subscribe((data) => {
        this.notFollowMe = data;
      })
    );

    this.subscriptions.push(
      this.fileProcessingService.notFollowing$.subscribe((data) => {
        this.notFollowing = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.fileProcessingService.clearData();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
