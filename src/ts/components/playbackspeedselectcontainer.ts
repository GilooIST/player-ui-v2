import {Container, ContainerConfig} from './container';
import {PlaybackSpeedSelectionList} from './playbackspeedselectionlist';
import {UIInstanceManager} from '../uimanager';
import {Timeout} from '../timeout';
import {Label,LabelConfig} from './label';
import {CloseButton} from './closebutton';

/**
 * Configuration interface for a {@link PlaybackSpeedSelectionContainerConfig}.
 */
export interface PlaybackSpeedSelectionContainerConfig extends ContainerConfig {
  
}

export class PlaybackSpeedSelectContainer<Config> extends Container<PlaybackSpeedSelectionContainerConfig> {

  private static readonly CLASS_SELECTED = 'selected';
  private selectionList: PlaybackSpeedSelectionList;
  private currentModeLabel: Label<LabelConfig>;
  private closeButton: CloseButton;
  private selectionListContainer: Container<Config>;

  constructor(config: PlaybackSpeedSelectionContainerConfig = {}) {
    super(config);

    this.selectionListContainer = new Container({
      cssClass: 'selectionListContainer'
    })

    this.closeButton = new CloseButton({target:this.selectionListContainer});
    this.selectionList = new PlaybackSpeedSelectionList;
    this.currentModeLabel = new Label({text: this.selectionList.getCurrentMode(),cssClasses: ["playbackspeed-currentMode"]});

    this.selectionListContainer.addComponents(
      [this.closeButton,this.selectionList]
    );

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-playbackspeedselectcontainer',
      components: [
        this.currentModeLabel,
        this.selectionListContainer
      ]

    }, <PlaybackSpeedSelectionContainerConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.currentModeLabel.onClick.subscribe(()=>{
      this.selectionListContainer.show();
    })

    let resetPanelDisplay = () => {
      this.selectionListContainer.hide();
    }

    // Update qualities when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, resetPanelDisplay);
    // Update qualities when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, resetPanelDisplay);
    // Update qualities when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, resetPanelDisplay);


    let playbackSpeedChanged = () => {
      this.currentModeLabel.setText(this.selectionList.getCurrentMode());
      this.selectionListContainer.hide();
    }

    // Update quality selection when quality is changed (from outside)
    player.addEventHandler(player.EVENT.ON_PLAYBACK_SPEED_CHANGED, playbackSpeedChanged);

  }
}