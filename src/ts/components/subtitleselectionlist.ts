import {SelectBox} from './selectbox';
import {ListSelectorConfig} from './listselector';
import {UIInstanceManager} from '../uimanager';
import {ItemSelectionList} from './itemselectionlist';

/**
 * A select box providing a selection between available subtitle and caption tracks.
 */
export class SubtitleSelectionList extends ItemSelectionList {

  constructor(config: ListSelectorConfig = {}) {
    super(config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let selectCurrentSubtitle = () => {
      let currentSubtitle = player.getSubtitle();
      
      if (currentSubtitle) {
        this.selectItem(currentSubtitle.id);
      }
    };

    let updateSubtitles = () => {
      this.clearItems();

      for (let subtitle of player.getAvailableSubtitles()) {
        let label = this.translateCH(subtitle.label)
        this.addItem(subtitle.id, label);
      }

      // Select the correct subtitle after the subtitles have been added
      selectCurrentSubtitle();
    };

    this.onItemSelected.subscribe((sender: SubtitleSelectionList, value: string) => {
      player.setSubtitle(value === 'null' ? null : value);
    });

    // React to API events
    player.addEventHandler(player.EVENT.ON_SUBTITLE_ADDED, updateSubtitles);
    player.addEventHandler(player.EVENT.ON_SUBTITLE_CHANGED, selectCurrentSubtitle);
    player.addEventHandler(player.EVENT.ON_SUBTITLE_REMOVED, updateSubtitles);
    // Update subtitles when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateSubtitles);
    // Update subtitles when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, updateSubtitles);
    // Update subtitles when the period within a source changes
    player.addEventHandler(player.EVENT.ON_PERIOD_SWITCHED, updateSubtitles);

    // Populate subtitles at startup
    updateSubtitles();
  }

  /**
   * Translation to Chinese 翻譯到中文
   */
  translateCH(value:string):string {
    let translate = [
      {key: 'off',value: '無'},
      {key: 'en',value: '英文'},
      {key: 'ENG',value: '英文'},
      {key: 'zh_tw',value: '中文'},
      {key: 'de',value: '德文'},
      {key: 'es',value: '西班牙文'},
      {key: 'fr',value: '法文'},
    ]

    for(let item of translate) if(item.key == value) return item.value;
    return value;
  }

}