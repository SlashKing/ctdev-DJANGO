import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import React, { Component } from 'react'
import { render } from 'react-dom'
import {
    createStore,
    compose,
    applyMiddleware,
    combineReducers,
} from 'redux'
import { connect, Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, IndexRoute, browserHistory } from 'react-router'
import { routerMiddleware, routerReducer, ConnectedRouter } from 'react-router-redux'
import * as reducers from './reducers'
import * as screens from './common/constants/screens'
import App1Container from './containers/App1Container'
import NavBar from './components/NavBar'
import { ChatAPI } from './ChatAPI'
import { loginUser } from './actions/chatActions'
import { setCurrentUser, setCurrentProfile, fetchUser } from './actions/postActions'
import { setCache, cacheByKey } from './common/cache_utils'
import * as routes from './common/constants/routes'
import throttle from 'lodash/throttle'
let history = createBrowserHistory()
const reduxRouterMiddleware = routerMiddleware( history );
let reducer = combineReducers( {
    ...reducers,
    routing: routerReducer
} );
const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
        <LogMonitor theme="tomorrow" preserveScrollTop={false} />
    </DockMonitor>
);
let finalCreateStore = compose(
    applyMiddleware( thunk, reduxRouterMiddleware ),
    //Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()
)( createStore );
let store = finalCreateStore( reducer )
if ( module.hot ) {
    module.hot.accept( './reducers', () => {
        store.replaceReducer( require( './reducers' ).default );
    } );
}
class App1 extends Component {
    constructor( props ) {
        super( props )
        if ( typeof window !== 'undefined' ) {
            console.log( 'constructing' )
            // pass in the user id when the request is for a user's profile
            // this is done by passing JSON from a Django roundtrip
            // **TODO: use the user id or username to make AJAX request when profile page is requested to avoid full roundtrip to server
            var these_props = JSON.parse( document.getElementById( "props" ).innerHTML );
            this.state = {
                user: these_props.user,
                request_user: these_props.request_user
            }
            store.dispatch( setCurrentUser( this.state.request_user ) )
            console.log( 'user', this.state.user )
            if ( this.state.user !== null ) {
                store.dispatch( setCurrentProfile( this.state.user ) )
            }
        }


    }
    componentWillUpdate( nextProps ) {

    }
    componentWillReceiveProps( nextProps, nextState ) {

    }
    componentDidUpdate( nextProps, nextState ) {

    }
    componentDidMount() {
        /*
         * Hook into the Chat Websockets operated through Django Channels
         * Opens a socket to listen on
         * */
        ChatAPI.connect();
        ChatAPI.listen( store );
        /* 
         * --- 
         * ---
         * 
         * */
        this._isMounted = true;
        window.onpopstate = ( e ) => {
            if ( this._isMounted ) {
                var pathname = e.currentTarget.location.pathname
                pathname = pathname.replace( /\/+$/, "" )
                if ( pathname.match( 'profile' ) ) {
                    pathname = pathname.split( '/' )
                    pathname = pathname.pop()
                    window.location.reload()
                }
                //store.dispatch(fetchUser(pathname))
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    render() {
        return (
            <div className="master-flex">
                <DevTools store={store} />
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <Switch>
                            {/* search routes */}
                            
                            <Route exact path={routes.SEARCH_FOLLOWING} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.FOLLOWING_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH_USERS} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.USERS_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH_FRIENDS} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.FRIEND_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH_HASHTAGS} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.HASHTAG_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH_FOLLOWERS} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.FOLLOWERS_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH} render={() => (
                                <App1Container {...this.state} history={history}
                                    search_screen={screens.POSTS_SCREEN}
                                    screen={screens.SEARCH_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )} />
                            <Route exact path={routes.SEARCH_POSTS} render={() => (
                                    <App1Container {...this.state} history={history}
                                        search_screen={screens.POSTS_SCREEN}
                                        screen={screens.SEARCH_SCREEN}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )} />

                            {/* notification routes */}
                            <Route exact path={routes.NOTIFICATIONS_UNREAD + 'deleted/'} render={() => (
                                console.log( 'got here notifications' ),
                                <App1Container {...this.state} history={history} all={false} deleted={true} screen={screens.NOTIFICATIONS_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )} />

                            <Route exact path={routes.NOTIFICATIONS_UNREAD} render={() => (
                                console.log( 'got here notifications' ),
                                <App1Container {...this.state} history={history} all={false} deleted={false} screen={screens.NOTIFICATIONS_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )} />

                            <Route exact path={routes.NOTIFICATIONS + 'deleted/'} render={() => (
                                console.log( 'got here notifications' ),
                                <App1Container {...this.state} history={history} all={true} deleted={true} screen={screens.NOTIFICATIONS_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )} />
                            <Route exact path={routes.NOTIFICATIONS} render={() => (
                                console.log( 'got here notifications' ),
                                <App1Container {...this.state} history={history} all={true} deleted={false} screen={screens.NOTIFICATIONS_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )} />

                            {/* profile routes */}
                            <Route exact path={routes.PROFILE + ':username/'} render={() => (
                                console.log( 'got profile username' ),
                                <App1Container {...this.state} history={history} screen={screens.FEED_SCREEN}
                                    current_profile={this.state.user} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/images/'} render={() => (
                                <App1Container {...this.state} images={'true'} history={history} current_profile={this.state.user} screen={screens.FEED_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/videos/'} render={() => (
                                <App1Container {...this.state} videos={'true'} history={history} current_profile={this.state.user} screen={screens.FEED_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE} render={() => (
                                console.log( 'got profile' ),
                                <App1Container {...this.state} history={history} screen={screens.FEED_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>

                            {/* settings route */}

                            <Route exact path={routes.PROFILE + ':username/settings/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/username/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='username'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/about/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='about'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/change-password/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='password'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/lost-password/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='lostpassword'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/privacy/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='privacy'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/gender/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='gender'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/interested-in/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='interested'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/relationship-status/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='rel_status'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/email/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='email'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/birthday/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='birthday'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.PROFILE + ':username/settings/general/'}
                                render={( props ) => (
                                    <App1Container
                                        {...props}
                                        {...this.state}
                                        type='general'
                                        local={true}
                                        screen={screens.SETTINGS}
                                        request_user={this.state.request_user}
                                        user={this.state.user} /> )}>
                            </Route>

                            {/* globalfeed/post routes */}
                            <Route exact path={routes.LOCAL} render={() => (
                                console.log( 'got here1' ),
                                <App1Container {...this.state}
                                    local={true}
                                    history={history}
                                    screen={screens.FEED_SCREEN}
                                    request_user={this.state.request_user}
                                    user={this.state.user} /> )}>
                            </Route>
                            <Route exact path="/:id/" render={() => (
                                console.log( 'got here1' ),
                                <App1Container {...this.state} single={'true'} history={history} screen={screens.FEED_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>
                            <Route exact path={routes.ROUTE_ROOT} render={() => (
                                console.log( 'got here1' ),
                                <App1Container {...this.state} history={history} screen={screens.FEED_SCREEN} request_user={this.state.request_user} user={this.state.user} /> )}>
                            </Route>

                            {/* 404 route */}
                            <Route render={() => ( <App1Container {...this.state}
                                history={history}
                                screen={-1}
                                request_user={this.state.request_user}
                                user={this.state.user} /> )} />

                        </Switch>
                    </ConnectedRouter>
                </Provider>
            </div>
        )
    }
}

render( <App1 />, document.getElementById( 'App1' ))