const store = new Vuex.Store({
state: {
servers: [
{ name: 'Umbrella Server', status: true, adr: '192.168.0.24' },
{ name: 'Umrella Server', status: true, adr: '192.168.0.25', type: 'database' },
] 
},


  mutations: {
UPDATE_SERVER_STATUS(state, payload) {
  state.servers[payload].status ^= true;
} },

  actions: {
serverStatus({ commit }, server) {
  commit('UPDATE_SERVER_STATUS', server);
} } });



Vue.component('dashboard-clock', {
  props: {
digital: {
  default: true,
  type: Boolean },

binary: {
  default: false,
  type: Boolean } },


  data() {
return {
  time: '' };

  },
  template: `
<div class='dashboard-clock'>
<div v-if="digital" class="dashboard-clock-digital">{{time}}</div>
<table v-if="binary" class="dashboard-clock-binary">
<tr class='hours'>
<td v-for='n in 6'></td>
</tr>
<tr class='minutes'>
<td v-for='n in 6'></td>
</tr>
<tr class='seconds'>
<td v-for='n in 6'></td>
</tr>
</table>
</div>
`,
  mounted: function () {
window.setInterval(this.render, 1000);
  },
  methods: {
render() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();

  this.time = `${this.addZero(h)} : ${this.addZero(m)} : ${this.addZero(s)}`;

  this.light(this.convert(s), '.seconds');
  this.light(this.convert(m), '.minutes');
  this.light(this.convert(h), '.hours');
},
convert(num) {
  let bin = "";
  let conv = [];

  while (num > 0) {
bin = num % 2 + bin;
num = Math.floor(num / 2);
  }

  conv = bin.split('');

  while (conv.length < 6) {
conv.unshift("0");
  }

  return conv;
},
light(array, type) {
  $(type + ' td').attr('class', 'num0');
  for (var i = 0; i < array.length; i++) {
$(type + ' td:eq(' + i + ')').attr('class', 'num' + array[i]);
  }
},
addZero(i) {
  if (i < 10) {
i = "0" + i;
  }
  return i;
} } });



Vue.component('dashboard-header', {
  props: ['title'],
  template: `
<header class="dashboard-header">
<h1 class="dashboard-title">{{title}}</h1>
<slot></slot>
</header>
` });


Vue.component('server-list', {
  template: '<div class="server-list"><slot></slot></div>' });


Vue.component('server', {
  props: ['type'],
  template: `
<div class="server">
<div class="server-icon fa" 
:class="'fa-' + (type === 'database' ? 'tasks' : 'globe')">
</div>
<ul class="server-details">
<li>Server Name:<slot name="name"></slot></li> 
<li>Status:<slot name="status"></slot></li>
<li>IP Address:<slot name="adr"></slot></li>
</ul>
</div>` });


//Vue.use(Vuex);
const dashboard = new Vue({
  el: 'dashboard',
  data: () => {
return {
  servers: store.state.servers };

  },
  methods: {
updateServerStatus(server) {
  store.dispatch('serverStatus', server);
} },

  mounted() {
setInterval(() =>
store.dispatch('serverStatus',
Math.floor(Math.random() * (this.servers.length - 0) + 0)),
5000);
  } });
