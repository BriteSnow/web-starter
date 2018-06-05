
import { BaseView, addHubEvents } from './base';
import { display, closest, first, all, empty, hub } from 'mvdom';
import { HomeView } from './HomeView';
import { NavView } from './NavView';
import { DemoTypo, DemoCards, DemoButtons } from './demo/DemoViews';

type BaseViewClass = { new(): BaseView; }

let pathToView: { [name: string]: BaseViewClass } = {
	"home": HomeView,
	"": HomeView,
	"typo": DemoTypo,
	"cards": DemoCards,
	"buttons": DemoButtons
};

export class MainView extends BaseView {

	//// View key elements
	private get nav() { return first(this.el, 'nav')! };
	protected get main() { return first(this.el, 'main')! };

	// Add hub events
	hubEvents = addHubEvents(this.hubEvents, {

		// 'routeHub' is the hub receiving url changes
		'routeHub; CHANGE': (routeInfo: any) => {
			this.displayView(routeInfo);
		},
	});

	async postDisplay() {
		display(NavView, this.nav, null, 'empty');
	}

	private displayView(routeInfo: any) {
		let path0 = routeInfo.pathAt(0);
		path0 = (!path0) ? "" : path0;

		let subViewClass = pathToView[path0];

		display(subViewClass, this.main, null, 'empty');
	}
}