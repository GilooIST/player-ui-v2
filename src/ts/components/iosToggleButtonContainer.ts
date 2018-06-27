import {ContainerConfig, Container} from './container';
import {UIInstanceManager} from '../uimanager';
import {Component, ComponentConfig} from './component';
import {IosToggleButton} from './iostogglebutton';
import {IosToggleButtonLabel} from './iostogglebuttonlabel';

/**
 * Contains two Components(IosToggleButton,IosToggleButtonLabel)
 */

export class IosToggleButtonContainer extends Container<ContainerConfig>  {
  constructor(config:ContainerConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config,{
      cssClass:"IosToggleButtonContainer",
      components: [
        new IosToggleButton({}),
        new IosToggleButtonLabel()
      ]
    },this.config);
  }
}