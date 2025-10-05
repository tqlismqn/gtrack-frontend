import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Driver, DocKey } from '../../../shared/models';
import { DOC_ICONS, daysToState } from '../../../shared/docs.util';

interface IconStat {
  key: DocKey;
  label: string;
  icon: string;
  ok: number;
  warn: number;
  bad: number;
}

@Component({
  selector: 'app-drivers-icons',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class DriversIconsComponent implements OnChanges {
  @Input() drivers: Driver[] = [];
  stats: IconStat[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['drivers']) {
      this.compute();
    }
  }

  private compute(): void {
    const map = new Map<DocKey, IconStat>();
    (Object.keys(DOC_ICONS) as DocKey[]).forEach((key) => {
      map.set(key, {
        key,
        label: key.toUpperCase(),
        icon: DOC_ICONS[key],
        ok: 0,
        warn: 0,
        bad: 0,
      });
    });

    for (const driver of this.drivers) {
      for (const key of Object.keys(driver.docs) as DocKey[]) {
        const stat = map.get(key);
        if (!stat) {
          continue;
        }
        const doc = driver.docs[key];
        const days = Math.round((doc.expires - Date.now()) / (1000 * 60 * 60 * 24));
        const state = doc.uploaded ? daysToState(days) : 'bad';
        stat[state] += 1;
      }
    }

    this.stats = Array.from(map.values());
  }
}
