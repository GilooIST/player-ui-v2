import {Container, ContainerConfig} from './container';
import {HugePlaybackToggleButton} from './hugeplaybacktogglebutton';
import { PlaybackTimeLabel, PlaybackTimeLabelMode } from './playbacktimelabel';

/**
 * Overlays the player and displays error messages.
 */
export class PlaybackToggleOverlay extends Container<ContainerConfig> {

  private playbackToggleButton: HugePlaybackToggleButton;

  constructor(config: ContainerConfig = {}) {
    super(config);

    this.playbackToggleButton = new HugePlaybackToggleButton();

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-playbacktoggle-overlay',
      components: [
        this.playbackToggleButton,
        // reverse
        // fast-forward
        // time remaining
        new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentAndTotalTime,cssClass: 'ui-hugePlaybackTimeLabel' })
      ],
    }, this.config);
  }
}