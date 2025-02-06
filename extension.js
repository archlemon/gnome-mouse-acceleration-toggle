import Gio from 'gi://Gio';
import St from 'gi://St';
import GObject from 'gi://GObject';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const MouseAccelerationToggleButton = GObject.registerClass(
	{
		GTypeName: 'MouseAccelerationToggle'
	},
	class MouseAccelerationToggleButton extends PanelMenu.Button {
		_init() {
			super._init(0.0, 'Mouse Acceleration Toggle', false);
			this._settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.peripherals.mouse' });
			this._accelProfile = this._settings.get_string('accel-profile');
			this._icon = new St.Icon({
				icon_name: this._getIconName(),
				style_class: 'system-status-icon'
			});
			this.actor.add_child(this._icon);
			this.actor.connect('button-press-event', () => {
				this._toggleAcceleration();
			});
		}

		_getIconName() {
			return (this._accelProfile === 'flat')
				? 'media-playback-stop-symbolic'
				: 'input-mouse-symbolic';
		}

		_toggleAcceleration() {
			if (this._accelProfile === 'default') {
				this._settings.set_string('accel-profile', 'flat');
				this._accelProfile = 'flat';
			} else {
				this._settings.set_string('accel-profile', 'default');
				this._accelProfile = 'default';
			}
			this._icon.icon_name = this._getIconName();
		}

		destroy() {
			super.destroy();
		}
	}
);

let _indicator = null;

export default class MouseAccelerationToggle extends Extension {
	enable() {
		_indicator = new MouseAccelerationToggleButton();
		Main.panel.addToStatusArea('mouse-acceleration-toggle', _indicator, 1, 'right');
	}

	disable() {
		if (_indicator) {
			_indicator.destroy();
			_indicator = null;
		}
	}
}
