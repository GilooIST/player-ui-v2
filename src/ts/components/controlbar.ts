import {ContainerConfig, Container} from './container';
import {UIInstanceManager} from '../uimanager';
import {UIUtils} from '../uiutils';
import {Spacer} from './spacer';

/**
 * Configuration interface for the {@link ControlBar}.
 */
export interface ControlBarConfig extends ContainerConfig {
  // nothing yet
}

/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 */
export class ControlBar extends Container<ControlBarConfig> {

  constructor(config: ControlBarConfig) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-controlbar',
      hidden: true,
    }, <ControlBarConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // Counts how many components are hovered and block hiding of the control bar
    let hoverStackCount = 0;

    // Track hover status of child components
    UIUtils.traverseTree(this, (component) => {
      // Do not track hover status of child containers or spacers, only of 'real' controls
      if (component instanceof Container || component instanceof Spacer) {
        return;
      }

      // Subscribe hover event and keep a count of the number of hovered children
      component.onHoverChanged.subscribe((sender, args) => {
        /**
         * Rewrite reason
         * itemListSelector: When I click a option, mouse enter event would trans addtional one.
         * closeButton: I click close button, can't fire hovered Changed
         */
        if(sender.getConfig().cssClass == 'ui-itemselectionlist' || sender.getConfig().cssClass == 'ui-closebutton') return;
        if (args.hovered) {
          hoverStackCount++;
        } else {
          hoverStackCount--;
        }
      });
    });

    uimanager.onControlsShow.subscribe(() => {
      player.fireEvent(player.EVENT.ON_SHOW_CONTROLS,{});
      this.show();
    });
    uimanager.onPreviewControlsHide.subscribe((sender, args) => {
      // Cancel the hide event if hovered child components block hiding
      args.cancel = (hoverStackCount > 0);
    });
    uimanager.onControlsHide.subscribe(() => {
      player.fireEvent(player.EVENT.ON_HIDE_CONTROLS,{});
      this.hide();
    });
  }
}