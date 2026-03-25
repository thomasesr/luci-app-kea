'use strict';
'require view';
'require rpc';
'require ui';

const callKeaStatus = rpc.declare({
	object: 'luci.kea',
	method: 'status',
	expect: { '': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callKeaStatus(), {})
		]);
	},

	render: function(data) {
		const st = data[0] || {};

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', _('Kea DHCP')),
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
						])
					])
				])
			])
		]);
	}
});