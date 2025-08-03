import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormsModule } from "@angular/forms";
import { ReadService } from "../../../common/services/read/read.service";
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatCard, MatCardModule, MatCardTitle } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { environment } from "../../../../../environments/environment";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CompanyInfo } from "../../escoInterfaces";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-company-information-history",
  imports: [
    // Angular Common
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    // Angular Forms
    FormsModule,
    // Angular Material Modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule
  ],

  templateUrl: "./company-information-history.component.html",
  styleUrl: "./company-information-history.component.scss",
})
export class CompanyInformationHistoryComponent {
  history: any[] = [];
  loading = false;
  esco_id = "ESCo-A001";
  latestFile: any = null;
  baseUrl = environment.baseUrl + "/";
  rawData: CompanyInfo[] = [];
  dateFilterField: 'ci_created_at' | 'ci_updated_date' = 'ci_created_at';
  filterOn = this.dateFilterField;
  maxDate = new Date();



  displayedColumns: string[] = [
    "created",
    "updated",
    "energy",
    "tech",
    "provinces",
    "filename",
    "category",
  ];
  dataSource: MatTableDataSource<CompanyInfo> | null = null;
  filterValue = {
    allColumns: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private readService: ReadService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.readService.getCompanyInfoHistory(this.esco_id).subscribe((res) => {
      this.loading = false;
      if (res.status === "success") {
        this.rawData = res.history;         // <<--- This is what your filter works on!

        this.dataSource = new MatTableDataSource(res.history);
        console.log('passed data', res.history);
        setTimeout(() => {
          if (this.dataSource) this.dataSource.paginator = this.paginator;
        });
      }
    });
  }


  
  applyGlobalFilter() {
    let filtered = this.rawData;
  
    // Text filter
    if (this.filterValue.allColumns) {
      const val = this.filterValue.allColumns.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(val)
        )
      );
    }
  
    // Always use ci_updated_date
    const filterOn = 'ci_updated_date';
    const fromYMD = this.filterValue.fromDate
      ? this.dateToLocalYMD(this.filterValue.fromDate)
      : null;
    const toYMD = this.filterValue.toDate
      ? this.dateToLocalYMD(this.filterValue.toDate)
      : null;
  
    console.log("Filtering on:", filterOn);
    console.log("From:", fromYMD, "To:", toYMD);
  
    if (fromYMD || toYMD) {
      filtered = filtered.filter((item) => {
        if (!item[filterOn]) return false;
        const itemDateYMD = this.extractLocalYMD(item[filterOn]);
        console.log("Item date:", itemDateYMD);
  
        if (fromYMD && itemDateYMD < fromYMD) return false;
        if (toYMD && itemDateYMD > toYMD) return false;
        return true;
      });
    }
  
    if (this.dataSource) {
      this.dataSource.data = filtered;
    }
  }
  
  dateToLocalYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  extractLocalYMD(dbDateStr: string): string {
    return dbDateStr.slice(0, 10);
  }

  

  resetFilters() {
    this.filterValue = {
      allColumns: "",
      fromDate: null,
      toDate: null,
    };
    if (this.dataSource) {
      this.dataSource.data = this.rawData;
    }
  }

  fileDownload(filePath: string) {
    window.open(filePath, "_blank");
  }

  getFileUrl(fu_path: string): string {
    // Ensure no double slash if your baseUrl already ends with /
    return this.baseUrl.replace(/\/+$/, "") + "/" + fu_path.replace(/^\/+/, "");
  }

  openConfirmationDialog(fu_id: number) {
    // Show confirmation and delete if yes
    alert("Delete file id " + fu_id); // Replace with actual dialog
  }
}
