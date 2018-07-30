import {SeekBar, SeekBarConfig} from './seekbar';
import {UIInstanceManager} from '../uimanager';
import {DOM} from '../dom';

/**
 * Configuration interface for the {@link VolumeSlider} component.
 */
export interface VolumeSliderConfig extends SeekBarConfig {
  /**
   * Specifies if the volume slider should be automatically hidden when volume control is prohibited by the
   * browser or platform. This currently only applies to iOS.
   * Default: true
   */
  hideIfVolumeControlProhibited: boolean;
}

/**
 * A simple volume slider component to adjust the player's volume setting.
 */
export class VolumeSlider extends SeekBar {

  private static readonly issuerName = 'ui';

  constructor(config: SeekBarConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, <VolumeSliderConfig>{
      cssClass: 'ui-volumeslider',
      hideIfVolumeControlProhibited: true,
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager, false);

    let config = <VolumeSliderConfig>this.getConfig();

    if (config.hideIfVolumeControlProhibited && !this.detectVolumeControlAvailability()) {
      this.hide();

      // We can just return from here, because the user will never interact with the control and any configured
      // functionality would only eat resources for no reason.
      return;
    }

    let volumeChangeHandler = () => {
      if (player.isMuted()) {
        this.setPlaybackPosition(0,1);
      } else {
        this.setPlaybackPosition(player.getVolume(),1);
      }
    };

    player.addEventHandler(player.EVENT.ON_READY, volumeChangeHandler);
    player.addEventHandler(player.EVENT.ON_VOLUME_CHANGED, volumeChangeHandler);
    player.addEventHandler(player.EVENT.ON_MUTED, volumeChangeHandler);
    player.addEventHandler(player.EVENT.ON_UNMUTED, volumeChangeHandler);

    this.onSeekPreview.subscribeRateLimited((sender, args) => {
      if (args.scrubbing) {
        player.setVolume(args.position, VolumeSlider.issuerName);
      }
    }, 50);
    this.onSeeked.subscribe((sender, percentage) => {
      player.setVolume(percentage, VolumeSlider.issuerName);
    });

    // Update the volume slider marker when the player resized, a source is loaded and player is ready,
    // or the UI is configured. Check the seekbar for a detailed description.
    player.addEventHandler(player.EVENT.ON_PLAYER_RESIZE, () => {
      volumeChangeHandler();
    });
    player.addEventHandler(player.EVENT.ON_READY, () => {
      volumeChangeHandler();
    });
    uimanager.onConfigured.subscribe(() => {
      volumeChangeHandler();
    });

    // Init volume bar
    volumeChangeHandler();
  }

  private detectVolumeControlAvailability(): boolean {
    /*
     * "On iOS devices, the audio level is always under the user’s physical control. The volume property is not
     * settable in JavaScript. Reading the volume property always returns 1."
     * https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
     */
    // as muted autoplay gets paused as soon as we unmute it, we may not touch the volume of the actual player so we
    // probe a dummy audio element
    const dummyVideoElement = document.createElement('video');
    // try setting the volume to 0.7 and if it's still 1 we are on a volume control restricted device
    dummyVideoElement.volume = 0.7;
    return dummyVideoElement.volume !== 1;
  }

  // [Todo]
  // Here are lots of duplicated code from seekbar, because we want to override it!
  // It needs time to seperate them!

  /**
   * Sets the position of the playback position indicator.
   * Override func!!
   * @param percent a number between 0 and 100 as returned by the player
   */
  setPlaybackPosition(percent: number,issuer?: number) {
    // Set position of the bar
    // Make Red seekbar wrap the mark

    // Avoid seekbar.ts override call
    if(issuer != 1) return;

    this.setPosition(this.seekBarPlaybackPosition, percent);

    // Set position of the marker
    let totalSize = (this.config.vertical ? (this.seekBar.height() - this.seekBarPlaybackPositionMarker.height()) : this.seekBar.width());
    let px = (totalSize) / 100 * percent;
    if (this.config.vertical) {
      px = this.seekBar.height() - px - this.seekBarPlaybackPositionMarker.height();
    }
    let style = this.config.vertical ?
      // -ms-transform required for IE9
      // -webkit-transform required for Android 4.4 WebView
      {
        'transform': 'translateY(' + px + 'px)',
        '-ms-transform': 'translateY(' + px + 'px)',
        '-webkit-transform': 'translateY(' + px + 'px)',
      } :
      {
        'transform': 'translateX(' + px + 'px)',
        '-ms-transform': 'translateX(' + px + 'px)',
        '-webkit-transform': 'translateX(' + px + 'px)',
      };
    this.seekBarPlaybackPositionMarker.css(style);
  }

  /**
   * Set the actual position (width or height) of a DOM element that represent a bar in the seek bar.
   * Override function!!
   * @param element the element to set the position for
   * @param percent a number between 0 and 100
   */
  protected setPosition(element: DOM, percent: number) {
    let scale = percent / 100;

    // When the scale is exactly 1 or very near 1 (and the browser internally rounds it to 1), browsers seem to render
    // the elements differently and the height gets slightly off, leading to mismatching heights when e.g. the buffer
    // level bar has a width of 1 and the playback position bar has a width < 1. A jittering buffer level around 1
    // leads to an even worse flickering effect.
    // Various changes in CSS styling and DOM hierarchy did not solve the issue so the workaround is to avoid a scale
    // of exactly 1.
    if (scale >= 0.99999 && scale <= 1.00001) {
      scale = 0.99999;
    }

    let style = this.config.vertical ?
      // -ms-transform required for IE9
      // -webkit-transform required for Android 4.4 WebView
      //
      // [mod] 6/2 Louis Assume
      // Because the seekbar would scaleX, we need to calcuate each size's border-radius
      {
        'transform': 'scaleY(' + scale + ')',
        '-ms-transform': 'scaleY(' + scale + ')',
        '-webkit-transform': 'scaleY(' + scale + ')'
      } :
      {
        // 'transform': 'scaleX(' + scale + ')',
        // '-ms-transform': 'scaleX(' + scale + ')',
        // '-webkit-transform': 'scaleX(' + scale + ')',
        'width': `${percent}%`
      };
    element.css(style);
  }

}
