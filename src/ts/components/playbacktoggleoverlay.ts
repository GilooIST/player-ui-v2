import {Container, ContainerConfig} from './container';
import {HugePlaybackToggleButton} from './hugeplaybacktogglebutton';
import { PlaybackTimeLabel, PlaybackTimeLabelMode } from './playbacktimelabel';
import {UIInstanceManager} from '../uimanager';
import { TimeShiftButton } from './timeShiftButton';

/**
 * Overlays the player and displays error messages.
 * 
 * Edited By Louis 18/6/2
 * 我計畫讓這個ts檔變成hover時，壓在畫面上的 { timeShift, play/pause, timeLabel }的container。
 * 
 * Edited By Louis 18/6/4
 * 目前多掛上一層 shownState
 * 會多出 bmpui-hidden 的 class ，再用css控制
 * 
 * E.B.L 6/5
 * 改寫顯示的邏輯
 * 
 * [TODO] components
 * [mod]
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
        new TimeShiftButton({moveDirection: false, cssClass: 'ui-timeShiftButton-moveBack'}),
        // fast-forward
        new TimeShiftButton({moveDirection: true, cssClass: 'ui-timeShiftButton-moveForward'}),
        // time remaining
        new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentAndTotalTime,cssClass: 'ui-hugePlaybackTimeLabel' })
      ],
    }, this.config);

  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager, handleClickEvent: boolean = true): void {

    let shouldBeShown = false;

    // let shownStateHandler = () => {
    //   if(!player.isPlaying()) this.show();
    //   else this.hide();
    // }



    // // Call handler upon these events
    // player.addEventHandler(player.EVENT.ON_PLAY, shownStateHandler);
    // player.addEventHandler(player.EVENT.ON_PAUSED, shownStateHandler);
    // if (player.EVENT.ON_PLAYING) {
    //   // Since player 7.3. Not really necessary but just in case we ever miss the ON_PLAY event.
    //   player.addEventHandler(player.EVENT.ON_PLAYING, shownStateHandler);
    // }
    // // after unloading + loading a new source, the player might be in a different playing state (from playing into stopped)
    // player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, shownStateHandler);
    // player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, shownStateHandler);
    // // when playback finishes, player turns to paused mode
    // player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, shownStateHandler);
  
    uimanager.onControlsShow.subscribe(() => {
      shouldBeShown = true;
      this.show();
    });
    uimanager.onControlsHide.subscribe(() => {
      shouldBeShown = false;
      this.hide();
    });
  
  }

}