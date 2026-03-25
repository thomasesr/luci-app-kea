'use strict';
'require view';
'require form';
'require uci';
'require network';

function validateCIDR(section_id, value) {
	if (!value)
		return _('This field is required');

	if (!value.match(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/))
		return _('Must be in IPv4 CIDR format, for example 192.168.1.0/24');

	let parts = value.split('/');
	let ip = parts[0].split('.').map(x => +x);
	let mask = +parts[1];

	if (mask < 0 || mask > 32)
		return _('Invalid prefix length');

	for (let i = 0; i < 4; i++) {
		if (ip[i] < 0 || ip[i] > 255)
			return _('Invalid IPv4 address');
	}

	return true;
}

function validatePool(section_id, value) {
	if (!value)
		return true;

	if (!value.match(/^(\d{1,3}\.){3}\d{1,3}\-(\d{1,3}\.){3}\d{1,3}$/))
		return _('Must be in range format, for example 192.168.1.100-192.168.1.199');

	return true;
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('kea'),
			network.getNetworks()
		]);
	},

	render: function(data) {
		let nets = data[1] || [];
		let m, s, o;

		m = new form.Map('kea', _('Kea DHCP Subnets'),
			_('Define Kea DHCPv4 subnets and bind each subnet to a specific OpenWrt interface.'));

		s = m.section(form.GridSection, 'subnet4', _('Subnets'));
		s.anonymous = true;
		s.addremove = true;
		s.sortable = true;
		s.nodescriptions = true;

		o = s.option(form.Flag, 'enabled', _('Enabled'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'description', _('Name'));
		o.rmempty = false;
		o.placeholder = 'LAN';

		o = s.option(form.ListValue, 'interface', _('Interface'));
		o.rmempty = false;
		nets.forEach(function(net) {
			let name = net.getName();
			if (name)
				o.value(name, name);
		});

		o = s.option(form.Value, 'subnet', _('Subnet'));
		o.rmempty = false;
		o.placeholder = '192.168.1.0/24';
		o.validate = validateCIDR;

		o = s.option(form.DynamicList, 'pool', _('Pools'));
		o.datatype = 'string';
		o.placeholder = '192.168.1.100-192.168.1.199';
		o.validate = validatePool;

		o = s.option(form.Value, 'gateway', _('Gateway'));
		o.datatype = 'ip4addr';
		o.placeholder = '192.168.1.1';

		o = s.option(form.DynamicList, 'dns', _('DNS servers'));
		o.datatype = 'ip4addr';
		o.placeholder = '192.168.1.1';

		o = s.option(form.Value, 'domain', _('Domain'));
		o.placeholder = 'lan';

		o = s.option(form.DynamicList, 'ntp', _('NTP servers'));
		o.datatype = 'ip4addr';
		o.placeholder = '192.168.1.1';

		o = s.option(form.Value, 'next_server', _('Next server'));
		o.datatype = 'ip4addr';
		o.placeholder = '192.168.1.2';

		o = s.option(form.Value, 'boot_file_name', _('Boot file name'));
		o.placeholder = 'pxelinux.0';

		return m.render();
	}
});