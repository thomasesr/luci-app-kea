'use strict';
'require view';
'require rpc';
'require ui';

const callLeases = rpc.declare({
	object: 'luci.kea',
	method: 'leases',
	expect: { '': { subnets: [] } }
});

return view.extend({
	load: function() {
		return callLeases();
	},

	handleReservationFromLease: function(lease) {
		let url = L.url('admin/services/kea/reservations') +
			'?subnet=' + encodeURIComponent(lease.subnet_id || '') +
			'&ip_address=' + encodeURIComponent(lease.ip_address || '') +
			'&hw_address=' + encodeURIComponent(lease.hw_address || '') +
			'&hostname=' + encodeURIComponent(lease.hostname || '');

		window.location.href = url;
	},

	renderSubnetBlock: function(subnetGroup) {
		let rows = (subnetGroup.leases || []).map(L.bind(function(l) {
			return E('tr', {}, [
				E('td', {}, l.ip_address || '—'),
				E('td', {}, l.hw_address || '—'),
				E('td', {}, l.hostname || '—'),
				E('td', {}, l.expire_text || '—'),
				E('td', {}, l.state || '—'),
				E('td', {}, [
					E('button', {
						'class': 'btn cbi-button cbi-button-action',
						'click': ui.createHandlerFn(this, 'handleReservationFromLease', {
							subnet_id: subnetGroup.id,
							ip_address: l.ip_address,
							hw_address: l.hw_address,
							hostname: l.hostname
						})
					}, _('Set static reservation'))
				])
			]);
		}, this));

		if (!rows.length) {
			rows.push(E('tr', {}, [
				E('td', { 'colspan': '6', 'style': 'text-align:center' }, _('No active leases in this subnet.'))
			]));
		}

		return E('div', { 'class': 'cbi-section' }, [
			E('h3', {}, '%s (%s)'.format(subnetGroup.description || subnetGroup.interface || subnetGroup.id, subnetGroup.subnet || '?')),
			E('div', { 'class': 'cbi-section-node' }, [
				E('table', { 'class': 'table' }, [
					E('tr', { 'class': 'tr table-titles' }, [
						E('th', { 'class': 'th' }, _('IP address')),
						E('th', { 'class': 'th' }, _('MAC address')),
						E('th', { 'class': 'th' }, _('Hostname')),
						E('th', { 'class': 'th' }, _('Lease time')),
						E('th', { 'class': 'th' }, _('State')),
						E('th', { 'class': 'th' }, _('Reservation'))
					]),
					rows
				])
			])
		]);
	},

	render: function(data) {
		let groups = data.subnets || [];

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', _('Leases')),
			E('p', {}, _('View active leases and convert them into static reservations.')),
			groups.map(L.bind(function(g) {
				return this.renderSubnetBlock(g);
			}, this))
		]);
	}
});