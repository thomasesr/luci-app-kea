'use strict';
'require view';
'require rpc';
'require ui';

const callReservations = rpc.declare({
	object: 'luci.kea',
	method: 'reservations',
	expect: { '': { subnets: [] } }
});

const callReservationAdd = rpc.declare({
	object: 'luci.kea',
	method: 'reservation_add',
	params: [ 'data' ],
	expect: { '': {} }
});

const callReservationUpdate = rpc.declare({
	object: 'luci.kea',
	method: 'reservation_update',
	params: [ 'data' ],
	expect: { '': {} }
});

const callReservationDelete = rpc.declare({
	object: 'luci.kea',
	method: 'reservation_delete',
	params: [ 'section_id' ],
	expect: { '': {} }
});

function reservationFormBody(subnets, values) {
	values = values || {};

	let subnetSelect = E('select', { 'class': 'cbi-input-select', 'name': 'subnet' },
		subnets.map(function(s) {
			return E('option', {
				'value': s.id,
				'selected': values.subnet == s.id ? 'selected' : null
			}, '%s (%s)'.format(s.description || s.interface || s.id, s.subnet || '?'));
		})
	);

	return E('div', {}, [
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('Subnet')),
			E('div', { 'class': 'cbi-value-field' }, [ subnetSelect ])
		]),
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('IP address')),
			E('div', { 'class': 'cbi-value-field' }, [
				E('input', {
					'class': 'cbi-input-text',
					'name': 'ip_address',
					'type': 'text',
					'value': values.ip_address || '',
					'placeholder': '192.168.1.10'
				})
			])
		]),
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('MAC address')),
			E('div', { 'class': 'cbi-value-field' }, [
				E('input', {
					'class': 'cbi-input-text',
					'name': 'hw_address',
					'type': 'text',
					'value': values.hw_address || '',
					'placeholder': 'AA:BB:CC:DD:EE:FF'
				})
			])
		]),
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('Hostname')),
			E('div', { 'class': 'cbi-value-field' }, [
				E('input', {
					'class': 'cbi-input-text',
					'name': 'hostname',
					'type': 'text',
					'value': values.hostname || ''
				})
			])
		]),
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('Client ID')),
			E('div', { 'class': 'cbi-value-field' }, [
				E('input', {
					'class': 'cbi-input-text',
					'name': 'client_id',
					'type': 'text',
					'value': values.client_id || ''
				})
			])
		]),
		E('div', { 'class': 'cbi-value' }, [
			E('label', { 'class': 'cbi-value-title' }, _('Description')),
			E('div', { 'class': 'cbi-value-field' }, [
				E('input', {
					'class': 'cbi-input-text',
					'name': 'description',
					'type': 'text',
					'value': values.description || ''
				})
			])
		])
	]);
}

function formValues(container, current) {
	let q = function(name) { return container.querySelector('[name="%s"]'.format(name)); };

	return {
		section_id: current && current.section_id || '',
		subnet: q('subnet').value,
		ip_address: q('ip_address').value.trim(),
		hw_address: q('hw_address').value.trim(),
		hostname: q('hostname').value.trim(),
		client_id: q('client_id').value.trim(),
		description: q('description').value.trim()
	};
}

return view.extend({
	load: function() {
		return callReservations();
	},

	handleOpenReservationModal: function(subnets, current) {
		let body = reservationFormBody(subnets, current);

		ui.showModal(current ? _('Edit reservation') : _('Add reservation'), [
			body,
			E('div', { 'class': 'right' }, [
				E('button', {
					'class': 'btn cbi-button',
					'click': ui.hideModal
				}, _('Cancel')),
				' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-save important',
					'click': ui.createHandlerFn(this, async function() {
						let payload = formValues(body, current);

						if (!payload.subnet || !payload.ip_address || !payload.hw_address) {
							ui.addNotification(null, E('p', _('Subnet, IP address and MAC address are required.')));
							return;
						}

						if (current)
							await callReservationUpdate(payload);
						else
							await callReservationAdd(payload);

						ui.hideModal();
						window.location.reload();
					})
				}, _('Save'))
			])
		]);
	},

	handleDeleteReservation: function(section_id) {
		return ui.showModal(_('Delete reservation?'), [
			E('p', _('This reservation will be removed.')),
			E('div', { 'class': 'right' }, [
				E('button', { 'class': 'btn cbi-button', 'click': ui.hideModal }, _('Cancel')),
				' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-negative important',
					'click': ui.createHandlerFn(this, async function() {
						await callReservationDelete(section_id);
						ui.hideModal();
						window.location.reload();
					})
				}, _('Delete'))
			])
		]);
	},

	renderSubnetBlock: function(allSubnets, subnetGroup) {
		let rows = (subnetGroup.reservations || []).map(L.bind(function(r) {
			return E('tr', {}, [
				E('td', {}, r.ip_address || '—'),
				E('td', {}, r.hw_address || '—'),
				E('td', {}, r.hostname || '—'),
				E('td', {}, r.last_status || _('Configured')),
				E('td', {}, [
					E('button', {
						'class': 'btn cbi-button cbi-button-action',
						'click': ui.createHandlerFn(this, 'handleOpenReservationModal', allSubnets, r)
					}, _('Edit'))
				]),
				E('td', {}, [
					E('button', {
						'class': 'btn cbi-button cbi-button-negative',
						'click': ui.createHandlerFn(this, 'handleDeleteReservation', r.section_id)
					}, _('Delete'))
				])
			]);
		}, this));

		if (!rows.length) {
			rows.push(E('tr', {}, [
				E('td', { 'colspan': '6', 'style': 'text-align:center' }, _('No reservations configured for this subnet.'))
			]));
		}

		return E('div', { 'class': 'cbi-section' }, [
			E('h3', {}, '%s (%s)'.format(subnetGroup.description || subnetGroup.interface || subnetGroup.id, subnetGroup.subnet || '?')),
			E('div', { 'class': 'cbi-section-node' }, [
				E('div', { 'style': 'margin-bottom:1em' }, [
					E('button', {
						'class': 'cbi-button cbi-button-add',
						'click': ui.createHandlerFn(this, 'handleOpenReservationModal', allSubnets, { subnet: subnetGroup.id })
					}, _('Add reservation'))
				]),
				E('table', { 'class': 'table' }, [
					E('tr', { 'class': 'tr table-titles' }, [
						E('th', { 'class': 'th' }, _('IP address')),
						E('th', { 'class': 'th' }, _('MAC address')),
						E('th', { 'class': 'th' }, _('Hostname')),
						E('th', { 'class': 'th' }, _('Last status')),
						E('th', { 'class': 'th' }, _('Edit')),
						E('th', { 'class': 'th' }, _('Delete'))
					]),
					rows
				])
			])
		]);
	},

	render: function(data) {
		let groups = data.subnets || [];

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', _('Reservations')),
			E('p', {}, _('Manage static DHCP reservations by subnet.')),
			groups.map(L.bind(function(g) {
				return this.renderSubnetBlock(groups, g);
			}, this))
		]);
	}
});