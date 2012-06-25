$(document).ready(function () {

  initCore();

 });

function defaultSuccess(data, status, xhr) {
  start();
  if (data) {
    console.log(data);
  } else {
    console.log('no data');
  }
  // console.log(xhr);
  ok(true, "yahoo!!!");
}

function defaultError(xhr, status, error) {
  start();
  console.log('boo!');
  throw new Error("aorsientaroiesn");
}

function initCore() {
  window.query_params = getQueryParams();
  parseParams();
  prepareLocalStorage();
  usergrid.client.Init();
}

function selectFirstApplication() {
  for (var i in usergrid.session.currentOrganization.applications) {
    usergrid.session.currentApplicationId = usergrid.session.currentOrganization.applications[i];
    localStorage.setItem('currentApplicationId', usergrid.session.currentApplicationId);
    console.log("current application: " + usergrid.session.currentApplicationId);
    break;
  };
}

asyncTest("logging-in with credentials", function() {
  expect(1);
  usergrid.client.loginAdmin("fjendle@apigee.com",
  			     "mafalda1",
  			     defaultSuccess,
                             function() {console.log('boo1')}
  			    );
});

asyncTest("logging-in with token", function() {
  expect(1);
  usergrid.client.autoLogin(defaultSuccess, defaultError);
});

asyncTest("getting applications", function() {
  expect(1);
  usergrid.client.requestApplications(
    function() {
      selectFirstApplication();
      defaultSuccess();
    },
    defaultError);
});

asyncTest("getting users list (999)", function() {
  expect(1);
  usergrid.client.requestUsers(usergrid.session.currentApplicationId, defaultSuccess, defaultError);
});
