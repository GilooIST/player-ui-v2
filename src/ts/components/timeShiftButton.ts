import {Button, ButtonConfig} from './button';
import {UIInstanceManager} from '../uimanager';
import {NoArgs, EventDispatcher, Event} from '../eventdispatcher';
import PlayerEvent = bitmovin.PlayerAPI.PlayerEvent;
import {PlayerUtils} from '../playerutils';
import TimeShiftAvailabilityChangedArgs = PlayerUtils.TimeShiftAvailabilityChangedArgs;

/**
 * A button that do timeShift
 */

export interface TimeShiftButtonConfig extends ButtonConfig {
  /**
   * For selecting the shifting direction
   * move_forward => true
   * move_backward => false
   */
  moveDirection?: Boolean;
  text?: string;
}

export class TimeShiftButton<Config extends TimeShiftButtonConfig> extends Button<TimeShiftButtonConfig> {

  constructor(config: TimeShiftButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config,<TimeShiftButtonConfig>{
      cssClass: 'ui-timeShiftButton',
      text: 'timeShift',
      moveDirection: true
    },this.config)
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager, handleClickEvent: boolean = true): void {
    super.configure(player, uimanager);

    const config = this.getConfig() as TimeShiftButtonConfig;

    if (handleClickEvent) {
      // Control player by button events
      // When a button event triggers a player API call, events are fired which in turn call the event handler
      // above that updated the button state.
      // player.getCurrentTime => 得到現在時間
      // player.getDuration => 得到全部時間
      this.onClick.subscribe(() => {
        let currentTime = player.getCurrentTime();
        let totalTime = player.getDuration();
        if(config.moveDirection) {
          if(currentTime + 10 >= totalTime) player.seek(totalTime);
          else player.seek(currentTime+10);
        }
        else {
          if(currentTime - 10 <= 0) player.seek(0);
          else player.seek(currentTime-10);
        }

      });
    }

    /**
     * [mod] How we determined whether to display or not?
     *  Ans: In 'playbacktoggleoverlay.ts'
     */

  }
}