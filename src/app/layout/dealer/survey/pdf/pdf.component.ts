import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerDelivery } from 'src/app/shared/models/delivery.model';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { appConfig } from 'src/app/core/app-conf';
import { logoUrl } from 'src/app/core/app-conf';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements AfterViewInit, OnInit {
  appConfig = appConfig;
  @ViewChild('contentPdf', { static: false }) contentPdf: ElementRef;
  surveyPreparationJson1: Array<any> = [];
  surveyPreparationJson2: Array<any> = [];
  customerSurveyJson: any = {};
  deliverData: CustomerDelivery;
  vehicleName = '';
  srcurl: string | ArrayBuffer | null;
  Base64d:any;
  logoUrl = logoUrl;
  base64dCarModel: any;
  base64dLogo: any;
  constructor(
    private ref: ChangeDetectorRef,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<PdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.loader.show();
    if (this.data) {
      this.deliverData = this.data.deliverData ? this.data.deliverData : '';
      this.coverBase64Image(this.data.deliverData.model.imagePath);
      const customerSurveyJson = this.data.surveyData.customerSurveyJson ?
        JSON.parse(this.data.surveyData.customerSurveyJson) : '';
      const surveyPreparationJson = this.data.surveyData.surveyPreparationJson ?
        JSON.parse(this.data.surveyData.surveyPreparationJson) : '';
      this.surveyPreparationJson1 = [];
      this.surveyPreparationJson2 = [];
      let index = 0;
      if (surveyPreparationJson) {
        surveyPreparationJson.map((val: any) => {
          val.fields.map((v: any) => {
            if (v.name === 'previousVehicle') {
              this.vehicleName = this.vehicleName ? this.vehicleName : v.answer;
            } else {
              if (index < 5) {
                this.surveyPreparationJson1.push(v);
              } else {
                this.surveyPreparationJson2.push(v);
              }
              index++;
            }
          });
        });
      }

      if (customerSurveyJson) {
        customerSurveyJson.map((v: any) => {
          if (v.Name === 'currentVehicle') { this.vehicleName = v.Answer ? v.Answer : this.vehicleName; }
          this.customerSurveyJson[v.Name] = v.Answer || '';
          if (v.Name === 'receiveInfo') { this.customerSurveyJson[v.Name] = v.Answer === 'Yes' ? v.Question : ''; }

        });
      }
      this.ref.detectChanges();
    } else {
      this.loader.hide();
      this.dialogRef.close();
    }
  }
  coverBase64Image(dimgUrl: any) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Origin': 'https://canadadelivery-uat.porsche.com'  
      }
    };
    fetch(dimgUrl,fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataUrl = reader.result;
          console.log('Base64 data URL:', base64DataUrl);
          this.base64dCarModel = base64DataUrl; 
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error fetching or converting the image:', error);
      });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.printPdf();
      //  this.generateAndPrintPDF();
    }, 1000);
  }

  /*** Print/Download Pdf ***/
  printPdf(): void {
    const content = this.contentPdf.nativeElement;
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight() - 40;
      pdf.addImage(imgData, 'JPEG', 8, 0, width, height);

      if (!this.data.download) {

        setTimeout(() => {
          pdf.save(`infosheet-${this.deliverData.id}.pdf`); // Save the PDF if download is true
          const blob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(blob);
          const newTab = window.open(blobUrl, '_blank');
          if (newTab) {
            newTab.onload = function () {
              newTab.print();
            };
          } else {
            console.error('Failed to open a new tab.');
          }
        }, 500);
      } else {
        setTimeout(() => {
          pdf.save(`infosheet-${this.deliverData.id}.pdf`); // Save the PDF if download is true
        }, 500)
      }

      this.loader.hide();
      this.dialogRef.close();
    }, error => {
      console.log('error:- ', error);
    });
  }

  generateAndPrintPDF() {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text('Hello, this is a PDF generated using jsPDF in Angular!', 10, 10);

    // Save the PDF to a variable
    const pdfData = doc.output();

    // Create a blob from the PDF data
    const blob = new Blob([pdfData], { type: 'application/pdf' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create an iframe to open and print the PDF
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';

    // Append the iframe to the document body
    document.body.appendChild(iframe);

    // Check if contentWindow is not null before using it
    if (iframe.contentWindow !== null) {
      // Access contentWindow and print the PDF when it's not null
      iframe.contentWindow.print();
    } else {
      // Handle the case when contentWindow is null
      // You can log an error or perform any other action
      console.error('contentWindow is null');
    }

    // Clean up
    document.body.removeChild(iframe);
  }
}
