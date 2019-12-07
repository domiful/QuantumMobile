const calendarModule = require("nativescript-ui-calendar");
const observableModule = require("tns-core-modules/data/observable");
const Kinvey = require('kinvey-nativescript-sdk');
const topmost = require("ui/frame").topmost;
const dataStore = Kinvey.DataStore.collection("Appointments", Kinvey.DataStoreType.Sync);

function AppointmentsViewModel() {
    const viewModel = observableModule.fromObject({
        title: "Appointments",
        prop: 0,
        sbSelectedIndex: 0,
        calViewMode: "Month",
        visibility1: true,
        visibility2: false,
        line: "green",
        events: [],
        items: {},
        sbLoaded: function (event) {
            const segmentedBarComponent = event.object;
            segmentedBarComponent.on("selectedIndexChange", (sbargs) => {
                //console.log(this.sbSelectedIndex);
                //let filteredList = [];
                if (this.sbSelectedIndex !== 0) {
                    //   console.log("Month");
                    this.calViewMode = "Month";
                }
                else {
                    this.calViewMode = "Day";

                }

                // this.items = filteredList;
            });

        },

        onDateSelected: function (args) {
            console.log("onDateSelected: " + args.date);
        },
        onNavigatedToDate: function (event) {
            //console.log(event.eventData.id);
            this.navCal(event.eventData.id);
            //console.log("date: " +);
        },
        navCal: function (title) {
            const that = this;
            //const myPage = frame.topmost().currentPage;
            topmost().navigate({
                moduleName: "appointments/appt-item-detail/appts-item-detail-page",
                context: { data: that.items[title] },
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
        },
        onNavigatedTo: function (args) {

            dataStore.pull().then((entities) => {
                    //console.log(entities);
                    this.contentLoaded();

                })
                .catch((error) => {
                    console.log(`${error}`);
                });
        },
        refreshList: function (args) {

            // Get reference to the PullToRefresh component;
            var pullRefresh = args.object;

            //dataStore.push();

            dataStore.push().then((entities) => {
                    //console.log(entities);
                    dataStore.pull().then((entities) => {
                            //console.log(entities);
                            this.contentLoaded();

                        })
                        .catch((error) => {
                            console.log(`${error}`);
                        });
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 500);

                })
                .catch((error) => {
                    console.log(`${error}`);
                });
            setTimeout(() => {
                pullRefresh.refreshing = false;
            }, 500);
        },
        contentLoaded: function () {
            let that = this;
            const subscription = dataStore.find()
                .subscribe((entities) => {
                        //         console.log("Retrieved : " + JSON.stringify(entities));
                        let nitems = {};
                        let withoutClose = [];
                        let newEvents = entities.map((ent) => {
                            let newEnt = {};
                            //console.log(ent);
                            let sdate = new Date(ent["date"]);
                            let calTitle = `${ent["custName"]}, ${ent["issueType"]}`;
                            //  const event = new calendarModule.CalendarEvent(calTitle, sdate, new Date(Date.parse(sdate) + 3600000));
                            const event = new CustomEvent(ent["_id"], calTitle, sdate, new Date(Date.parse(sdate) + 3600000));

                            newEnt["_id"] = ent["_id"];
                            newEnt["id"] = ent["custID"];
                            newEnt["status"] = ent["status"];
                            newEnt["techId"] = ent["tech_id"];
                            newEnt["address"] = ent["address1"];
                            newEnt["city"] = ent["city"];
                            newEnt["state"] = ent["state"];
                            newEnt["zip"] = ent["zip"];
                            newEnt["date"] = new Date(ent["date"]);
                            newEnt["cell"] = ent["cellphone"];
                            newEnt["email"] = ent["email"];
                            newEnt["cust"] = ent["custName"];
                            newEnt["company"] = ent["custCompany"];
                            newEnt["service"] = ent["serviceType"];
                            newEnt["issue"] = ent["issueType"];
                            newEnt["price"] = ent["Price"];
                            newEnt["lat"] = ent["ackGeoLat"];
                            newEnt["long"] = ent["ackGeoLong"];
                            newEnt["eventX"] = new Array(event);
                            //console.log(newEnt);
                            //let kvp = {};
                            nitems[ent["_id"]] = newEnt;

                            if (ent["status"] !== "3") {
                                console.log("3equals: " + ent["status"]);
                                withoutClose.push(event);
                            }

                            return event;
                        });
                        that.events = withoutClose;
                        that.items = nitems;
                        //console.log(that.items);

                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        console.log('pulled accounts');
                    });
            //return subscription;
        }

    });

    return viewModel;
}

class CustomEvent extends calendarModule.CalendarEvent {
    constructor(id, title, startDate, endDate, isAllDay, eventColor) {
        super(title, startDate, endDate, isAllDay, eventColor);
        this.id = id;
    }
}

module.exports = AppointmentsViewModel;
