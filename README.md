# Giloo/ist player-ui
> Developer Version  
> Reference to ``bitmovin-player-ui``  
> Bitmovin-ui is [here](https://github.com/bitmovin/bitmovin-player-ui).  

### Rendering Type: 
> Style: Moderm  
> UIManager.Factory: buildDefaultUI  

### How to develop?
  0. Clone Git repository  
  1. Install node.js  
  2. Install Gulp: ``npm install --global gulp-cli``  
  3. Install required npm packages: ``npm install``  
  4. Run Gulp tasks (``gulp --tasks``)  
    * ``gulp`` to build project into dist directory  
    * ``gulp watch`` to develop and rebuild changed files automatically  
    * ``gulp serve`` to open test page in browser, build and reload changed files automatically  
    * ``gulp lint`` to lint TypeScript and SASS files  
    * ``gulp build-prod`` to build project with minified files into dist directory  


### Feature:
  (feature : embeded place)
  1. Glossary button: Vue
  2. Glossary sidePage: Vue
  3. Highlight button: Vue
  4. Episode: Vue
  5. Back Button: Vue
  6. Title: Vue
  7. Highlight mark: bitmovin
  8. Highlight wave: bitmovin
  9. ...others: bitmovin

### Warning:
I've now use 7.8 (Beta-2) to develop
For reason that I need to catch Event (ON_PLAYBACK_SPEED_CHANGE),which only appears in 7.8+.
Unfortunately, 7.8+ only have beta version!


### Faced:
> Communicating between Bitmovin-ui and Vue
