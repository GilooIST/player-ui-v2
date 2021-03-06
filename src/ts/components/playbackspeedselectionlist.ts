import {ItemSelectionList} from './itemselectionlist';
import {ListSelectorConfig} from './listselector';
import {UIInstanceManager} from '../uimanager';

export class PlaybackSpeedSelectionList extends ItemSelectionList {
  protected defaultPlaybackSpeeds: number[];
  protected currentMode: string;

  constructor(config: ListSelectorConfig = {}) {
    super(config);
    // this.defaultPlaybackSpeeds = [0.25, 0.5, 1, 1.5, 2];
    // [Mod] Louis :: for Sketch design
    this.defaultPlaybackSpeeds = [0.5,1,2];
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.addDefaultItems();

    this.onItemSelected.subscribe((sender: PlaybackSpeedSelectionList, value: string) => {
      player.setPlaybackSpeed(parseFloat(value));
      this.selectItem(value);
      
      this.currentMode = this.getSelectedItemLabel(value);
      console.log(this.currentMode);
      // Force Update, we need setting panel to renew!
      player.fireEvent(player.EVENT.ON_PLAYBACK_SPEED_CHANGED,{});
    });

    const setDefaultValue = (): void => {
      const playbackSpeed = player.getPlaybackSpeed();
      this.setSpeed(playbackSpeed);
    };

    // when the player hits onReady again, adjust the playback speed selection
    player.addEventHandler(player.EVENT.ON_READY, setDefaultValue);

    if (player.EVENT.ON_PLAYBACK_SPEED_CHANGED) {
      // Since player 7.8.0
      player.addEventHandler(player.EVENT.ON_PLAYBACK_SPEED_CHANGED, setDefaultValue);
    }
  }

  setSpeed(speed: number): void {
    if (!this.selectItem(String(speed))) {
      // a playback speed was set which is not in the list, add it to the list to show it to the user
      this.clearItems();
      this.addDefaultItems([speed]);
      this.selectItem(String(speed));
    }
  }

  addDefaultItems(customItems: number[] = []): void {
    const sortedSpeeds = this.defaultPlaybackSpeeds.concat(customItems).sort();

    sortedSpeeds.forEach(element => {
      if (element !== 1) {
        this.addItem(String(element), `${element}x`);
      } else {
        this.addItem(String(element), 'Normal');
      }
    });
  }

  /**
   * Return current video quality mode.
   * @return {string}
   */
  getCurrentMode():string {
    return this.currentMode; 
  }


  clearItems(): void {
    this.items = [];
    this.selectedItem = null;
  }
}