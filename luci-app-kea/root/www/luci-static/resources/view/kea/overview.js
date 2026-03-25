'use strict';
'require view';
'require rpc';
'require ui';
'require uci';

const callKeaStatus = rpc.declare({
	object: 'luci.kea',
	method: 'status',
	expect: { '': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callKeaStatus(), {}),
			uci.load('kea')
		]);
	},

	handleDhcp4Toggle: function(ev) {
		let checked = ev.currentTarget.checked;
		let newValue = checked ? '0' : '1';

		return uci.load('kea').then(function() {
			uci.set('kea', 'dhcp4', 'disabled', newValue);
			return uci.save();
		}).then(function() {
			return uci.apply();
		}).then(function() {
			ui.addNotification(null, E('p', _('DHCPv4 setting applied successfully.')));
			window.location.reload();
		}).catch(function(err) {
			ui.addNotification(null, E('p', _('Failed to apply DHCPv4 setting: %s').format(err)));
		});
	},

	render: function(data) {
		const st = data[0] || {};
		const dhcp4Disabled = uci.get('kea', 'dhcp4', 'disabled');
		const dhcp4Enabled = (dhcp4Disabled === '0');

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', _('Kea DHCP')),

			E('div', { 'class': 'cbi-section' }, [
				E('h3', _('DHCPv4 Server')),
				E('div', { 'class': 'cbi-section-node' }, [
					E('label', {
						'class': 'cbi-value-title',
						'style': 'display:inline-flex; align-items:center; gap:0.6em; cursor:pointer;'
					}, [
						E('input', {
							'type': 'checkbox',
							'checked': dhcp4Enabled ? 'checked' : null,
							'change': ui.createHandlerFn(this, 'handleDhcp4Toggle')
						}),
						E('span', _('Enable DHCPv4 server'))
					]),
					E('div', {
						'class': 'cbi-value-description',
						'style': 'margin-top:0.5em;'
					}, _('This toggles kea.dhcp4.disabled between 0 and 1.'))
				])
			]),

			E('div', { 'class': 'cbi-section' }, [
				E('div', { 'class': 'cbi-section-node' }, [
					E('div', { 'class': 'table' }, [
						E('div', { 'class': 'tr' }, [
							E('div', { 'class': 'td left', 'style': 'width:30%' }, _('Service running')),
							E('div', { 'class': 'td left' }, st.running ? _('Yes') : _('No'))
						]),
						E('div', { 'class': 'tr' }, [
							E('div', { 'class': 'td left' }, _('Control Agent reachable')),
							E('div', { 'class': 'td left' }, st.ctrl_reachable ? _('Yes') : _('No'))
						]),
						E('div', { 'class': 'tr' }, [
							E('div', { 'class': 'td left' }, _('Configured subnets')),
							E('div', { 'class': 'td left' }, '%s'.format(st.subnets || 0))
						]),
						E('div', { 'class': 'tr' }, [
							E('div', { 'class': 'td left' }, _('Configured reservations')),
							E('div', { 'class': 'td left' }, '%s'.format(st.reservations || 0))
						]),
						E('div', { 'class': 'tr' }, [
							E('div', { 'class': 'td left' }, _('DHCPv4 enabled')),
							E('div', { 'class': 'td left' }, dhcp4Enabled ? _('Yes') : _('No'))
						])
					])
				])
			])
		]);
	}
});