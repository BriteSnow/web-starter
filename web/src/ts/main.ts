import { on, display, first } from "mvdom";
import { route } from "./route";
import { MainView } from "views/MainView";
import { get } from "ts/ajax";


on(document, "APP_LOADED", async function () {

	// then add this new MainView
	display(MainView, first("body")!).then(function () {
		// initialize the route, which will trigger a "CHANGE" on the routeHub hub. 
		// Note: we do that once the MainView has been added to the DOM so that it can react accordingly
		route.init();
	});
});
