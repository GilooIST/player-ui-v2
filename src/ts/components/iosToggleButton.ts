import {UIInstanceManager} from '../uimanager';
import {Component, ComponentConfig} from './component';
import {EventDispatcher, NoArgs, Event} from '../eventdispatcher';
import {DOM} from '../dom';

/**
 * Configuration interface for a {@link IosToggleButton} component.
 * 
 * The Main Component is IosToggleButtonContainer!!!
 */
export interface IosToggleButtonConfig extends ComponentConfig {
  /**
   * The text on the label.
   */
  text?: string;
}

export class IosToggleButton<Config extends IosToggleButtonConfig> extends Component<IosToggleButtonConfig> {
  private buttonEvents = {
    onClick: new EventDispatcher<IosToggleButton<Config>, NoArgs>(),
  };

  constructor(config:IosToggleButtonConfig) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-iosToggleButton',
      id: 'demo'
    }, this.config);
  }
    protected toDomElement(): DOM {
      // Create the button element with the text label
      let buttonElement = new DOM('input', {
        'type': 'checkbox',
        'id': this.config.id,
        'class': this.getCssClasses(),
      });
  
      // Listen for the click event on the button element and trigger the corresponding event on the button component
      buttonElement.on('click', () => {
        this.onClickEvent();
      });
  
      return buttonElement;
    }
  
    protected onClickEvent() {
      this.buttonEvents.onClick.dispatch(this);
    }
  
    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Button<Config>, NoArgs>}
     */
    get onClick(): Event<IosToggleButton<Config>, NoArgs> {
      return this.buttonEvents.onClick.getEvent();
    }
}