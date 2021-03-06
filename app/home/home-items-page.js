const frameModule = require("tns-core-modules/ui/frame");
const HomeItemsViewModel = require("./home-items-view-model");
const topmost = require("ui/frame").topmost;
const Kinvey = require('kinvey-nativescript-sdk');
const Kpush = require("kinvey-nativescript-sdk/push");
const dialogs = require("tns-core-modules/ui/dialogs");
const nativescript_locate_address_1 = require("nativescript-locate-address");

const userService = require("~/services/user-service");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const navigationEntry = {
    moduleName: "home/second-page",
    context: { info: "something you want to pass to your page" },
    animated: false
};

function onNavigatingTo(args) {
    const component = args.object;
    const page = args.object;
    const accountsStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    accountsStore.subscribe({
            onMessage: (m) => {
                alert(m);
            },
            onStatus: (s) => {
                // handle status events, which pertain to this collection
            },
            onError: (e) => {
                alert(e);
            }
        })
        .then(() => { /* success */ })
        .catch(e => { /* handle error */ });

    let activeUser = Kinvey.User.getActiveUser();
    //console.log("active user: " + activeUser.username);

    //register for push notifications
    /* Kpush.Push.register({
             android: {
                 senderID: '390861799348'
             },
             ios: {
                 alert: true,
                 badge: true,
                 sound: true
             }
         })
         .then(function (deviceToken) {
             //alert("Device registered for push notifications.");
             console.log("Device registered for push.  Access token: " + deviceToken);
         })
         .catch(function (error) {
             //alert("Error: " + error);
             console.log("Error: " + error);
         });
     // this will throw up a push notification in an alert box whenever one is received from Kinvey
     Kpush.Push.onNotification(function (data) {
         dialogs.confirm({
             title: data.type,
             message: data.body,
             okButtonText: "Let's Go",
             cancelButtonText: "Cancel",
         }).then(function (result) {
             if (result) {
                 var locator = new nativescript_locate_address_1.LocateAddress();
                 locator.locate({
                     address: "6904 n academy blvd, colorado springs, co 80920",
                 }).then(function () {
                     //console.log("Maps app launched.");
                 }, function (error) {
                     console.log(error);
                 });
             }
             console.log("Dialog result: " + result);
         });
     });
     */
    if (!activeUser) {

        topmost().navigate("login/login-page");
    }
    else {
        //source.set("items", { "name": activeUser });
        console.log("active user: " + activeUser);
        component.bindingContext = new HomeItemsViewModel();
    }

}

function onItemTap(args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;
    console.log("hey");
    page.frame.navigate({
        moduleName: "home/home-item-detail/home-item-detail-page",
        context: tappedItem,
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
}

function onPartsTap(args) {
    const tabView = topmost().parent.parent;
    tabView.selectedIndex = 2;

}

function onApptTap(args) {
    const tabView = topmost().parent.parent;
    tabView.selectedIndex = 1;
}

function onTap(args) {

    const view = args.view;
    const tappedItem = view.bindingContext;
}

function logOut() {
    userService.logout().then(() => {

            topmost().navigate({
                moduleName: "./login/login-page",
                clearHistory: true
            });

        })
        .catch((e) => {

            alert("Unfortunately we could not find your account.");
        });
}

exports.logOut = logOut;
exports.onItemTap = onItemTap;
exports.onPartsTap = onPartsTap;
exports.onApptTap = onApptTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onTap = onTap;
