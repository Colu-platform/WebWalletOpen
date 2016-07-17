//First load the React Core and React Router
var React = require('react');  
var Router = require('react-router'); 

//What should happen when someone opens our page without adding any segments to the url
var DefaultRoute = Router.DefaultRoute;

var Main = require('./app.js');
//Load the Route component which forms the base of every other Route in our application
var Route = Router.Route;

//We define a base route called 'wallet'. Because we've set the path to / it will match all our routes.
//In the handler attribute of this route, we define what component should be loaded when the route is matched.
//We nest every other route in our base route (eg. DefaultRoute). The only required attribute for a route is the handler attribute.
var routes = (  
    <Route name="app" path="/" handler={Main}>
        <Route name="wallet" handler={require(./wallet.jsx)} />
    </Route>
);