# Chat Worm
## A ChatGPT Client to access the API

<img src="src/assets/chatworm.png" alt="Chatworm" width="250"/>

Web app: https://chatworm.com/  
Android app: https://play.google.com/store/apps/details?id=com.chatworm.twa

Example screenshot:  
![demo](src/assets/demo_screenshot.png "Example Screenshot")

## Setting Up Local Development
1. First, open a terminal and navigate to the project directory.
2. Run the command `npm install` to install all frontend packages.
3. Once the installation is complete, run `npm start`. 
4. This will start a web service accessible via http://localhost:4200/.

## Preparing a Pull Request for Improvements
1. Start coding changes to the project using your local setup.
2. Once the improvements have been made, run `npm build`. This will generate new files in the `dist` folder which are hosted on our demo page.
3. Create a pull request which includes the updated `dist` folder.

## Deploy to production
1. Make sure everything is pushed to master.
2. Run `npm deploy` to deploy it to production server.
3. Check out https://chatworm.com/

## Release on different App Stores
1. Open https://www.pwabuilder.com/reportcard?site=https://chatworm.com
2. Release on the stores

## License
This project is licensed under the [MIT License](./LICENSE).
