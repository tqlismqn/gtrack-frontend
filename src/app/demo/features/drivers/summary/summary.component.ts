import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DriversSummary } from '../../../shared/models';

@Component({
  selector: 'app-drivers-summary',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class DriversSummaryComponent {
  @Input() summary!: DriversSummary;
}
