# Colu Wallet with NodeJS, React and Alt.

In this tutorial we will be using the NodeJS with Express, Colu SDK (http://documentation.colu.co), React and Alt to build a simple wallet App. Although we didn’t necessarily have to, we also included React Routes for the sake of learning. Our app will initialize using a given private key (or generates one if none is given), shows a list of assets the wallet contains, issue a new asset and send an asset to a phone number or address.

## Step 1. Create server
Create a new directory coluwallet. Inside, create 2 empty files package.json and server.js. Paste the following into package.json:

```sh
{
  "dependencies": {
    "alt": "^0.17.8",
    "colu": "^0.10.21",
    "express": "4.13.3",
    "hiredis": "^0.5.0",
    "react": "^15.2.1",
    "react-dom": "^15.2.1",
    "react-router": "^2.5.2"
  },
  "devDependencies": {
    "babel-plugin-transform-react-jsx": ">= 6.3",
    "babel-preset-es2015": "~6.9.0",
    "babel-preset-react": ">= 6.3",
    "babelify": "^7.2.0",
    "gulp": "^3.9.1",
    "gulp-sourcemaps": "^2.0.0-alpha",
    "gulp-util": "^3.0.7",
    "gulp-babel": "~6.1.2",
    "gulp-concat": "~2.6.0",
    "browserify": "^12.0.1",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0",
    "watchify": "^3.6.0"
  }
}
```

Run `npm install` in the Terminal to install the packages that we specified in the package.json. Open [server.js](server.js). It’s a very minimal Express application, just enough to get us started.

Next, create a new directory public. This is where we are going to place the main html (wallet.html),  CSS stylesheet and compiled JavaScript files.
Run `npm start` in the Terminal to make sure our Express app is working without any issues.
You should see Express server listening on port 3000 message in the Terminal.
Our server is ready. It’s serving [wallet.html](wallet.html) file when requesting localhost:3000/wallet.


## Step 2. Build system
We will be using Gulp (task manager) and Browserify to compile our javascript files in this tutorial. Browserify compiles all the javascript files we need into one file and transforms some of our files from jsx to js (we’ll explain this later).
Create a new file gulpfile.js and paste the following code:

[gulpfile.js](gulpfile.js)

Gulp creates two files: vendor.bundle.js  (concatenates vendor dependencies: 'alt', 'react', 'react-dom', 'react-router') and wallet.js (concatenates app files and required node_modules). Babelify transforms our files using presets and plugins, in this project we’re using React and ES6, therefore presets: `['es2015', 'react']`, and we need a plugin to transform jsx to regular js to make it browser readable. Sourcemaps map a concatenated/minified file back to an original state (source file) to be human-readable when debugging.
When we run gulp from the command line, `watchify` re-compiles the bundle files on file changes.
Run `gulp` and see the files being created in your public/compiled folder.


## Step 3. Project Structure
In the public directory create a new file style.css and paste the following: 

[public/style.css](public/style.css)

In the same directory (public) create a new file wallet.html and paste: 
```sh <!DOCTYPE html>
<html>
<head>
	<title>Colu Wallet</title>
	<link rel="stylesheet" href="/style.css">
</head>
<body>
	<div id="display"></div>	
<script src="/compiled/vendor.bundle.js"></script>
<script src="/compiled/wallet.js"></script>
</body>
</html>
```

In the project root, create a new folder app.
Then inside app create 3 new folders actions, components, stores and 3 empty files alt.js, wallet.jsx and consts.js. Your project directory should look like this:

## 4. A bit about React and Alt
### 4.1 React
React is a JavaScript library for creating user interfaces by Facebook and Instagram. Many people choose to think of React as the V in MVC.
React was built to solve one problem: building large applications with data that changes over time. From the React Docs:
Simply express how your app should look at any given point in time, and React will automatically manage all UI updates when your underlying data changes.
When the data changes, React conceptually hits the "refresh" button, and knows to only update the changed parts.
React is all about building reusable components. In fact, with React the only thing you do is build components. Since they're so encapsulated (markup and behavior live in the same place), components make code reuse, testing, and separation of concerns easy.
React is also very fast thanks to the Virtual DOM and diffing algorithm under the hood. When the data changes, React calculates the minimum number of DOM manipulations needed, then efficiently re-renders the component. 
While learning React, the biggest challenge for me was that it required a completely different thinking approach to building UIs. Which is why reading Thinking in React guide is absolutely a must for anyone who is starting out with React.
### 4.2 JSX Syntax
React generates HTML and component trees directly from the JavaScript code such that you can use all of the expressive power of a real programming language to build UIs.
In order to make this easier, FB added a very simple, optional HTML-like syntax to create these React tree nodes.
JSX lets you create JavaScript objects using HTML syntax. Using gulp, jsx in our app is then converted to regular js to make it browser readable.
### 4.3 Alt
We will be using a Flux library called Alt - A true flux compliant library in a very small size. Actions are fire and forget, stores have no setters, you get constants, and Flux's single dispatcher. Flux is the application architecture that was developed at Facebook for building scalable client-side web applications. Data always flows one way through the application and it is picked up along the way by various subscribers (stores) who are listening to it. 



## 5. Colu wallet React structure
Our wallet will look like this:

It consists of the main element ‘display’ and this is where our main wallet container is going to render (see line: ReactDOM.render(<Wallet />, document.getElementById('display')); in wallet.jsx). The main wallet container consists of two main elements: the Private Seed input form and Wallet Content. Wallet Content has a navigation menu (Issue, View Assets and Send An Asset) while each menu link loads its specific view (Asset Grid, Issue, Asset and Send Asset views). These are our basic components. 

### 5.1. Main container (entry point)
Lets look at our main wallet container wallet.jsx:
We create the component with var Wallet = React.createClass and render it with `ReactDOM.render(<Wallet />, document.getElementById('display'))`. 
`render()`:  All components in React have a render() method. It always returns a single child element. The HTML markup above is JSX. As far syntax goes, it is just slightly different from HTML, for example className instead of class to define CSS classes. 
`componentDidMount()`: This method in React is the closest thing to $(document).ready in jQuery. This method runs once (only on the client) immediately after initial rendering of the component. This is where you would typically initialize third-party libraries and jQuery plugins.

[app/wallet.jsx](app/wallet.jsx)

Before the our main component loads, in componentWillMount, we check if user’s private seed is in local storage (means, we have already initialized this private seed’s wallet once and set it’s private seed in local storage). If it is, we initialize Colu with that private seed.
There are three options to render this component: 
When Colu is already initialized with the private seed that was stored in local storage: we display EnterPrivateSeed component and WalletRouter component which loads the Navigation Menu and routes to view components.
When we are waiting for Colu to initialize we display EnterPrivateSeed component and ‘loading..’
There was no private seed in localstorage (a new user), we display only the EnterPrivateSeed.

We subscribe to our Alt’s store (WalletStore) in componentDidMount method and update this component's state with what's in the WalletStore in onChange method.  We stop updating component's state once it's not active in componentWillUnmount. 

### 5.2. Wallet Router
Our wallet’s router is a component that returns Router (we use  Router from react-router). 
```var routes = {
    path: '/',
    component: Container,
    childRoutes: [
        { path: '/issue', component: IssueAsset },
        { path: '/assets', component: AssetsGrid, renderStyle: consts.assetRenderStyle.grid},
        { path: '/sendAsset', component: SendAsset}
    ]
};

var WalletRouter = React.createClass({
	render: function () {
		return (
			<Router routes={routes} />
		);
	}
});

module.exports = WalletRouter;
```
Router has routes: I defined routes using JS and not JSX syntax to solve a React warning about trying to update the routes (Alt does that). This way they are static so it doesn’t try to update them.
```
var Container = React.createClass({
	render: function () {
		return (
			<div className="wallet-content">
				<Nav />
					{this.props.children}
			</div>
		);
	}
});
```
{this.props.children} renders the active child route handler. The reason for nesting routes this particular way is because we are going to place Nav menu (which is constant along all the routes) next to the active route, inside the Container component.


### 5.3 Nav Container
In the Nav menu container we use the Link from ‘react-router’ to link to the routes.
```
	render: function () {
		return (
			<div className="wallet-nav">
				<Link className="btn nav-btn" to='/issue'>ISSUE</Link>
				<Link className="btn nav-btn" to='/assets'>VIEW ASSETS</Link>
				<Link className="btn nav-btn" to='/sendAsset'>SEND AN ASSET</Link>
			</div>
		);
	}
```
### 5.4 EnterPrivateSeed Container


In `getInitialState` we get the state from the store:
```
var EnterPrivateSeed = React.createClass({
	getInitialState: function() {
		return WalletStore.getState();
	},
	componentDidMount: function() {
		WalletStore.listen(this.onChange);
	},
	onChange: function(state) {
		this.setState(state);
	},
	componentWillUnmount: function() {
		WalletStore.unlisten(this.onChange);
	},
```
In handleSubmit we deal with the click logic, and fire Action that will talk to Colu SDK and initialize the wallet with given private seed. if none is entered, colu sdk will generate a random one on initialization. Action will update the Store, and all the components that are subscribed to that store will update their state with what’s in the store.
```
	handleSubmit: function (e) {
		var privateSeed = this.refs.privateSeed.value;
		e.preventDefault();
		ColuActions.coluInit(privateSeed);
	},
	render: function () {
		//Build the Enter Private Seed form
		return (
			<form className="enter-privateseed-form">
				<div className = "group privateseed">
					<div className="privateseed-input">
						<input name="privateSeed" ref="privateSeed" />
						<span className="bar"></span>
						<label className="enter">Private Seed</label>
					</div>
					<button className="btn" type="submit" ref="submitButton" onClick={this.handleSubmit}>VIEW WALLET</button>
				</div>
				<Status/>
			</form>
		);
	}
});

module.exports = EnterPrivateSeed;
```
### 5.5 Actions

In the action folder, create a file ColuActions.js

Alt will create these actions on module.exports:
```
function ColuActions() {
	this.generateActions(
		'coluInitSuccess',
		'actionFailed',
		'getAssetsSuccess'
	);
}
```

Initialize Colu sdk:
```
ColuActions.prototype.coluInit = function(privateSeed) {
  var settings = {
		network: 'testnet',
		privateSeed: privateSeed,
		events: true,
		eventsSecure: false
	},
	that = this;

	function getAssetsCallback(err, assets) {
		if (err) {
```
For errors we have actionFailed action that will update the store with error:
```
			return that.actions.actionFailed(JSON.stringify(err));
		}
		//Update the store with assets
		that.actions.getAssetsSuccess({assets: assets});
	}

	try {
		ColuActions.colu = new Colu(settings);
	
		ColuActions.colu.on('connect', function () {
```
When a new transaction happens (issue, send, receive etc) we get the updated assets:
```
			ColuActions.colu.onNewCCTransaction(function (transaction) {
				if (transaction) {
					ColuActions.colu.getAssets(getAssetsCallback);
				}
			});
```
If no private key is entered, the wallet initialized using a random private key, we retrieve it. Right now there’s a bug where no address is generated when the wallet is initialized without the private seed, therefore we getAddress manually.
```
			if (!privateSeed) {
				privateSeed = ColuActions.colu.hdwallet.getPrivateSeed();
				//get an address to be able to do transactions
				ColuActions.colu.hdwallet.getAddress();
			}
```
If we have successfully initialized the wallet, update the store with the private seed (to be displayed in the wallet content) and continue with getting the assets for this private seed::
```
			that.actions.coluInitSuccess({privateSeed: privateSeed, error: null});
			ColuActions.colu.getAssets(getAssetsCallback);

		});

		ColuActions.colu.init();
	
	} catch (e) {
		that.actions.actionFailed(e);
	}
};

module.exports = alt.createActions(ColuActions);
```

### 5.6 Wallet Store

In stores folder create a file walletStore.js

Update the store with what is passed from the actions:
```
function WalletStore() {
	this.bindActions(ColuActions);
	this.bindActions(GeneralActions);
}
```
this.something is the variable in the state that gets updated with what’s passed from the action. Notice, alt prepends ‘on’ to Action name.
```
//Colu
WalletStore.prototype.onColuInitSuccess = function(obj) {
	this.privateSeed = obj.privateSeed;
	this.error = obj.error;
	localStorage.setItem( 'privateSeed', obj.privateSeed );
}

WalletStore.prototype.onGetAssetsSuccess = function(obj) {
	this.assets = obj.assets;
}

//Status messages

WalletStore.prototype.onActionFailed = function(err) {
	this.error = 'There was an error: ' + err.toString();
	this.updatedStatus = null;
}

module.exports = alt.createStore(WalletStore);
```

This is what the flow looks like:


TODO: 

getAssetInfo - build data structure on the init and save it in state, and then just get the info on the specific asset
sendAsset - move address/phone logic to actions
getMetadata - assets should get their respective metadata and display Name and Icon
viewAssetHistory - view asset transactions
register/login (backup/restore) - allow a colu user to login and fetch their encrypted seed from colu account
Multiple wallet support - allow switching between wallets and networks






# Dillinger

Dillinger is a cloud-enabled, mobile-ready, offline-storage, AngularJS powered HTML5 Markdown editor.

  - Type some Markdown on the left
  - See HTML in the right
  - Magic

You can also:
  - Import and save files from GitHub, Dropbox, Google Drive and One Drive
  - Drag and drop files into Dillinger
  - Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

### Version
3.2.7

### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [markdown-it] - Markdown parser done right. Fast and easy to extend.
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [keymaster.js] - awesome keyboard handler lib by [@thomasfuchs]
* [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

You need Gulp installed globally:

```sh
$ npm i -g gulp
```

```sh
$ git clone [git-repo-url] dillinger
$ cd dillinger
$ npm i -d
$ NODE_ENV=production node app
```

### Plugins

Dillinger is currently extended with the following plugins

* Dropbox
* Github
* Google Drive
* OneDrive

Readmes, how to use them in your own application can be found here:

* [plugins/dropbox/README.md] [PlDb]
* [plugins/github/README.md] [PlGh]
* [plugins/googledrive/README.md] [PlGd]
* [plugins/onedrive/README.md] [PlOd]

### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma start
```

### Docker
Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 80, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd dillinger
docker build -t <youruser>/dillinger:latest .
```
This will create the dillinger image and pull in the necessary dependencies. Once done, run the Docker and map the port to whatever you wish on your host. In this example, we simply map port 80 of the host to port 80 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 80:80 --restart="always" <youruser>/dillinger:latest
```

Verify the deployment by navigating to your server address in your preferred browser.

### N|Solid and NGINX

More details coming soon.

#### docker-compose.yml

Change the path for the nginx conf mounting path to your full path, not mine!

### Todos

 - Write Tests
 - Rethink Github Save
 - Add Code Comments
 - Add Night Mode

License
----

MIT

