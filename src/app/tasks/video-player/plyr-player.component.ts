import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import Plyr from 'plyr';
import Hls from 'hls.js';

@Component({
  selector: 'app-plyr-player',
  standalone: true,
  templateUrl: './plyr-player.component.html',
  styleUrls: ['./plyr-player.component.css']
})
export class PlyrPlayerComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;

  @Input()
  streamUrl = '';

  private player!: Plyr;
  private hls?: Hls;

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['streamUrl'] &&
      !changes['streamUrl'].firstChange
    ) {
      this.loadVideo();
    }
  }

  initializePlayer(): void {

    this.player = new Plyr(
      this.videoRef.nativeElement,
      {
        controls: [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen'
        ],

        settings: [
          'captions',
          'quality',
          'speed'
        ],

        seekTime: 10,

        keyboard: {
          focused: true,
          global: true
        }
      }
    );

    this.loadVideo();
  }

  loadVideo(): void {

    if (!this.streamUrl) {
      return;
    }

    if (this.hls) {
      this.hls.destroy();
    }

    const video = this.videoRef.nativeElement;

    if (this.streamUrl.endsWith('.m3u8')) {

      if (Hls.isSupported()) {

        this.hls = new Hls();

        this.hls.loadSource(this.streamUrl);

        this.hls.attachMedia(video);

      } else {

        video.src = this.streamUrl;
      }

    } else {

      this.player.source = {
  type: 'video',
  sources: [
    {
      src: this.streamUrl,
      type: 'video/x-matroska'
    }
  ]
};
 this.player.play();
 //this.player.fullscreen.enter();
    }
  }

  ngOnDestroy(): void {

    this.hls?.destroy();

    this.player?.destroy();
  }
}