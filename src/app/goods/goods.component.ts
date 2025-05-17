import { Component, ElementRef, ViewChild } from '@angular/core';

interface Device {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class Goods {
devices: Device[] = [
    {
      id: 'esr-3200',
      name: 'ESR-3200',
      description: 'Устройство ESR-3200 — надёжный выбор для профессионального использования.'
    },
    {
      id: 'MES-5200',
      name: 'MES-5200',
      description: 'Модель MES-5200 — оптимальное сочетание производительности и функционала.'
    },
    {
      id: 'rg-1404',
      name: 'RG-1404',
      description: 'RG-1404 — универсальное решение для домашнего и офисного применения.'
    },
    {
      id: 'sh-10',
      name: 'SH-10',
      description: 'Телефон SH-10 — стильный, удобный и надёжный.'
    },
    {
      id: 'vp-30p',
      name: 'VP-30P',
      description: 'VP-30P — мощное оборудование для связи нового поколения.'
    },
    {
      id: 'wlc-30',
      name: 'wlc-30',
      description: 'Беспроводной маршрутизатор wlc-30 — идеален для больших сетей.'
    },
    {
      id: 'sbc',
      name: 'sbc',
      description: 'Беспроводной маршрутизатор sbc — идеален для больших сетей.'
    },
    {
      id: 'esr-15',
      name: 'esr-15',
      description: 'Беспроводной маршрутизатор esr-15 — идеален для больших сетей.'
    }
  ];
  currentIndex = 0;

  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  next() {
    if (this.currentIndex < this.devices.length - 3) {
      this.currentIndex += 1;
      this.carouselTrack.nativeElement.scrollLeft += 300;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.carouselTrack.nativeElement.scrollLeft -= 300;
    }
  }
}
