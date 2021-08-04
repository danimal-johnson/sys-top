const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

const updateInterval = 2000; // Update every 2 seconds
let cpuOverload = 5; // TODO: Low number for testing only.
let alertFrequency = 1; // In minutes

setInterval(() => {
  // Get CPU usage
  cpu.usage().then((info) => {
    document.getElementById('cpu-usage').innerText = `${info}%`;
    document.getElementById('cpu-progress').style.width = `${info}%`;
  
    document.getElementById('cpu-progress').style.background = 
      info > cpuOverload ? 'red' : '#30c88b';
    
    // Check for overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: 'CPU overload',
        message: `CPU is over ${cpuOverload}`,
        icon: path.join(__dirname, 'img', 'icon.png'),
      });

      localStorage.setItem('lastNotify', new Date());
    };
  });

  // Get CPU free
  cpu.free().then((info) => {
    document.getElementById('cpu-free').innerText = `${info}%`;
  });

  // Get system Uptime
  document.getElementById('sys-uptime').innerText = formatTime(os.uptime());

}, updateInterval);

// Set static system info
document.getElementById('cpu-model').innerText = cpu.model();
document.getElementById('comp-name').innerText = os.hostname();
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;
document.getElementById('sys-uptime').innerText = os.uptime();
mem.info().then(info => {
  document.getElementById('mem-total').innerText =
    `${info.totalMemMb} MB`;
});

// Show days, hours, minutes and seconds
function formatTime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const sec = ((seconds % 86400) % 3600) % 60;

  return `${days}d ${hours}h ${minutes}m ${sec}s`;
}

// Send notification
function notifyUser(options) {
  new Notification(options.title, options);
}

// Check how much time has passed since last notification
function runNotify(frequency) {
  if (localStorage.getItem('lastNotify') === null) {
    localStorage.setItem('lastNotify', new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
  const now = new Date();
  const diff = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diff / (1000 * 60));

  return minutesPassed > frequency ? true : false;
}
