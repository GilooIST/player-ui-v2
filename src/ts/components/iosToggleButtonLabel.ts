import {UIInstanceManager} from '../uimanager';
import {Component, ComponentConfig} from './component';
import {EventDispatcher, NoArgs, Event} from '../eventdispatcher';
import {DOM} from '../dom';

// The Main Component is IosToggleButtonContainer!!!
export class IosToggleButtonLabel<Config> extends Component<ComponentConfig> {
  constructor(config:ComponentConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-IosToggleButtonLabel',
    }, this.config);
  }

  protected toDomElement(): DOM {
    // Create the button element with the text label
    let labelElement = new DOM('label', {
      'id': this.config.id,
      'class': this.getCssClasses(),
    }).attr("for","demo");
    return labelElement;
  }
}