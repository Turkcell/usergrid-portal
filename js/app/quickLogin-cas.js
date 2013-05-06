/*
 This file enables the page to quickly redirect the user to the SSO login page.
 Requires:
 Usergrid.Params - params.js
 Usergrid.userSession -session.js

 Its prefered that Usergrid.Params loads parameters before QuickLogin.init() is called.
 */

(function () {
    Usergrid.QuickLogin = function () {
    };
    window.Usergrid = window.Usergrid || {};
    var dfd = new $.Deferred();
    Usergrid.authenticationPromise = dfd.promise();
    function setParameters(data) {
        Usergrid.userSession.setUserUUID(data.user.uuid);
        Usergrid.userSession.setUserEmail(data.user.email);
        Usergrid.userSession.setAccessToken(data.access_token);
        dfd.resolve("authentication ok");
    }

    function loginWithGateway() {
        var success = false;
        $.jsonp({
            url: Usergrid.SSO.getGatewayUrl(),
            callbackParameter: "callback",
            success: function (data) {
                setParameters(data);
            },
            error:function(xOptions,status){
                Usergrid.SSO.sendToSSOLoginPage();
            }
        });

    }

    function runManagementQuery(_queryObj) {
        var obj = _queryObj || queryObj;
        Usergrid.ApiClient.runManagementQuery(obj);
        return false;
    }

    /** //TODO Update documentation for .login() usage
     *  Authenticate an admin user and store the token and org list
     *  @method login
     *  @params {string} email - the admin's email (or username)
     *  @params {string} password - the admin's password
     *  @params {function} successCallback - callback function for success
     *  @params {function} errorCallback - callback function for error
     */
    function login(ticket) {
        //empty local storage
        Usergrid.userSession.clearAll();

        var formdata = {
            ticket: ticket,
            service: Usergrid.SSO.default.loginService
        };
        runManagementQuery(new Usergrid.Query('GET', 'token', null, formdata,
            function (response) {
                if (!response || response.error) {
                    loginWithGateway();
                    return;
                }
                setParameters(response);
            },
            function (response) {
                //call the error function
                loginWithGateway();
            }
        ));
    }

    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    Usergrid.QuickLogin.prototype = {
        init: function (queryParams, sessionExists, useSSO) {
            if (!sessionExists && useSSO) {
                var ticket = getURLParameter("ticket");
                Usergrid.ApiClient.setApiUrl(Usergrid.SSO.default.api_url);
                if (ticket != "null")
                    login(ticket);
                else
                    loginWithGateway();
            } else {
                dfd.resolve("authentication not sso");
            }
        }

    };


})(Usergrid);

Usergrid.QuickLogin = new Usergrid.QuickLogin();
