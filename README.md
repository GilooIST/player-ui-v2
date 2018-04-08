# Giloo/ist player-ui
Developer Version  
Reference to ``bitmovin-player-ui``  
Bitmovin-ui is [here](https://github.com/bitmovin/bitmovin-player-ui).  

### Rendering Type: 
style: Moderm  
UIManager.Factory: buildDefaultUI  

### How to develop?
  Clone Git repository  
  Install node.js  
  Install Gulp: ``npm install --global gulp-cli``  
  Install required npm packages: ``npm install``  
  Run Gulp tasks (``gulp --tasks``)  
  ``gulp`` to build project into dist directory  
  ``gulp watch`` to develop and rebuild changed files automatically  
  ``gulp serve`` to open test page in browser, build and reload changed files automatically  
  ``gulp lint`` to lint TypeScript and SASS files  
  ``gulp build-prod`` to build project with minified files into dist directory  


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


### Faced:
  Communicating between Bitmovin-ui and Vue