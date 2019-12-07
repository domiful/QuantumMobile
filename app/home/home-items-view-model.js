const observableModule = require("tns-core-modules/data/observable");
const userService = require("~/services/user-service");
const Kinvey = require('kinvey-nativescript-sdk');

const topmost = require("ui/frame").topmost;
const dataStore = Kinvey.DataStore.collection("Appointments", Kinvey.DataStoreType.Sync);

function HomeItemsViewModel() {
    const viewModel = observableModule.fromObject({
        title: "Home",
        scrollEnabled: "true",
        items: [{
            name: Kinvey.User.getActiveUser().username,
            description: "Senior Technician"
        }],
        logOut: function () {
            userService.logout().then(() => {

                    topmost().navigate({
                        moduleName: "./login/login-page",
                        clearHistory: true
                    });

                })
                .catch((e) => {

                    alert("Unfortunately we could not find your account.");
                });
        },
        contentLoaded: function () {
            let activeUser = Kinvey.User.getActiveUser();
            dataStore.pull().then((entities) => {
                    //console.log(entities);
                    console.log(entities);
                    this.appointments = entities + " upcoming";

                })
                .catch((error) => {
                    console.log(`${error}`);
                });
            //(activeUser.data);
            //let username = activeUser.data.username === 'dom.raymond@progress.com' ? "Dom Raymond" : "Dan Mitchell";
            //this.items = [{ name: username, description: "Senior Technician" }];

        },
        appointments: 0
    });

    return viewModel;
}

module.exports = HomeItemsViewModel;
/*
        onScroll(args) {
            const page = args.object;
            const vm = page.bindingContext;
            console.log('poop');
            vm.set("status", "scrolling");
            setTimeout(() => {
                vm.set("status", "not scrolling");
            }, 300);

            console.log(`scrollX:  ${args.scrollX}`);
            console.log(`scrollY: ${args.scrollY}`);
        }
*/
