// import {SelectBox} from './selectbox';
import {ItemSelectionList} from './itemselectionlist';
import {ListSelectorConfig} from './listselector';
import {UIInstanceManager} from '../uimanager';

/**
 * A select box providing a selection between 'auto' and the available video qualities.
 */
export class VideoQualitySelectionList extends ItemSelectionList {

  private hasAuto: boolean;
  protected currentMode: string;

  constructor(config: ListSelectorConfig = {}) {
    super(config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let selectCurrentVideoQuality = () => {
      if (player.getVideoQuality) {
        // Since player 7.3.1
        this.selectItem(player.getVideoQuality().id);
      } else {
        // Backwards compatibility for players <= 7.3.0
        // TODO remove in next major release
        let data = player.getDownloadedVideoData();
        this.selectItem(data.isAuto ? 'auto' : data.id);
      }
    };

    let updateVideoQualities = () => {
      let videoQualities = player.getAvailableVideoQualities();

      this.clearItems();

      // Progressive streams do not support automatic quality selection
      this.hasAuto = player.getStreamType() !== 'progressive';

      if (this.hasAuto) {
        // Add entry for automatic quality switching (default setting)
        this.addItem('auto', 'Auto');
      }

      // Add video qualities [Mod] Louis
      this.selectQuality(videoQualities);
      
      // for (let videoQuality of videoQualities) {
      //   this.addItem(videoQuality.id, videoQuality.label);
      // }


      // Select initial quality
      selectCurrentVideoQuality();
    };

    this.onItemSelected.subscribe((sender: VideoQualitySelectionList, value: string) => {
      let videoQualities = player.getAvailableVideoQualities();
      this.currentMode = this.getSelectedItemLabel(value);
      player.setVideoQuality(value);

      // Force Update, we need setting panel to renew!
      player.fireEvent(player.EVENT.ON_VIDEO_QUALITY_CHANGED,{});
      // console.log(this.currentMode);
    });

    // Update qualities when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateVideoQualities);
    // Update qualities when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, updateVideoQualities);
    // Update qualities when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, updateVideoQualities);
    // Update quality selection when quality is changed (from outside)
    if (player.EVENT.ON_VIDEO_QUALITY_CHANGED) {
      // Since player 7.3.1
      player.addEventHandler(player.EVENT.ON_VIDEO_QUALITY_CHANGED, selectCurrentVideoQuality);
    } else {
      // Backwards compatibility for players <= 7.3.0
      // TODO remove in next major release
      player.addEventHandler(player.EVENT.ON_VIDEO_DOWNLOAD_QUALITY_CHANGE, selectCurrentVideoQuality);
    }
  }

  /**
   * Returns true if the select box contains an 'auto' item for automatic quality selection mode.
   * @return {boolean}
   */
  hasAutoItem(): boolean {
    return this.hasAuto;
  }

  /**
   * Return current video quality mode.
   * @return {string}
   */
  getCurrentMode():string {
    return this.currentMode; 
  }

  /**
   * [Mod] Louis
   * Returns video quality of three types { High, Medium, Low },selected from all avaliable video quality
   *   980 <= Low              -> Best: 852 , otherwise the highest
   *   980 < Medium <= 1700    -> Best: 1280 , otherwise the highest
   *   1700 < High             -> Best: 1920 , otherwise the highest
   */
  selectQuality(videoQualities:Array<bitmovin.PlayerAPI.VideoQuality>): void {
    let selectedQualities: Array<bitmovin.PlayerAPI.VideoQuality> = [];
    let eachHighest: Array<bitmovin.PlayerAPI.VideoQuality> = [];
    let qualityNames: Array<string> = [ "Low","Medium","High" ];

    for (let videoQuality of videoQualities) {
      let index = videoQuality.label.indexOf("x");
      let cut = Number(videoQuality.label.slice(0,index));
      if(cut <= 980) {
        if(cut == 852) selectedQualities[0] = videoQuality;
        eachHighest[0] = videoQuality;
      } else if(980 < cut && cut <= 1700) {
        if(cut == 1280) selectedQualities[1] = videoQuality;
        eachHighest[1] = videoQuality;
      } else {
        if(cut == 1920) selectedQualities[2] = videoQuality;
        eachHighest[2] = videoQuality;
      }
    }
    for(let i=0;i<3;i++) if(!selectedQualities[i]) selectedQualities[i] = eachHighest[i];
    for(let i=0;i<3;i++) if(selectedQualities[i]) this.addItem(selectedQualities[i].id, qualityNames[i]);
  }
}