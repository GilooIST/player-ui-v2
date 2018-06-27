import {Container, ContainerConfig} from './container';
import {VideoQualitySelectionList} from './videoqualityselectionlist';
import {UIInstanceManager} from '../uimanager';
import {Timeout} from '../timeout';
import {Label,LabelConfig} from './label';

/**
 * Configuration interface for a {@link VideoQualitySelectContainerConfig}.
 */
export interface VideoQualitySelectContainerConfig extends ContainerConfig {
  
}

/**
 * 
 */
export class VideoQualitySelectContainer extends Container<VideoQualitySelectContainerConfig> {

  private static readonly CLASS_SELECTED = 'selected';
  private selectionList: VideoQualitySelectionList;
  private currentModeLabel: Label<LabelConfig>;

  constructor(config: VideoQualitySelectContainerConfig = {}) {
    super(config);

    this.selectionList = new VideoQualitySelectionList;
    this.currentModeLabel = new Label({text: this.selectionList.getCurrentMode(),cssClasses: ["videoQuality-currentMode"]});

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-videoqualityselectcontainer',
      components: [
        this.currentModeLabel,
        this.selectionList
      ]

    }, <VideoQualitySelectContainerConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.currentModeLabel.onClick.subscribe(()=>{
      this.selectionList.show();
    })

    let resetVideoPanelDisplay = () => {
      this.selectionList.hide();
    }

    // Update qualities when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, resetVideoPanelDisplay);
    // Update qualities when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, resetVideoPanelDisplay);
    // Update qualities when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, resetVideoPanelDisplay);


    let videoQualityChanged = () => {
      this.currentModeLabel.setText(this.selectionList.getCurrentMode());
      this.selectionList.hide();
    }

    // Update quality selection when quality is changed (from outside)
    player.addEventHandler(player.EVENT.ON_VIDEO_QUALITY_CHANGED, videoQualityChanged);

    /**
     * Not so sure whether below is necessary or not, it seemed not important!
     * 
     * // Update qualities when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, videoQualityChanged);
    // Update qualities when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, videoQualityChanged);
    // Update qualities when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, videoQualityChanged);
     * 
     */

  }
}