
import { BaseView, addHubEvents } from './base';
import { all, first } from 'mvdom';
import { route } from 'ts/route';

export class NavView extends BaseView {

	postDisplay() {
		// this.refresh();
	}

	hubEvents = addHubEvents(this.hubEvents, {
		"routeHub; CHANGE": (routeInfo: any) => {
			this.refresh();
		}
	});

	//#region    Privates
	private refresh() {
		// remove the eventual .active
		for (const item of all(this.el, ".sel")) {
			item.classList.remove('sel');
		}

		// get the nav-item based on the url hash
		// TODO: later, we might want to do some pattern matching, so that it is more flexible (we might have many hash mapping to the same nav-item)
		let path0 = route.getInfo().pathAt(0);
		path0 = (!path0 || path0 === '') ? 'home' : path0;

		const selMenu = first(this.el, `a[href='#${path0}'`);
		if (selMenu) {
			selMenu.classList.add('sel');
		} else {
			console.log("DEV ERROR - no .menu-item found for path ", path0);
		}
	}
	//#endregion Privates
}