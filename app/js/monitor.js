const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 5;

// Run every 2 seconds
setInterval(() => {
  // Get CPU usage
  cpu.usage().then((info) => {
    document.getElementById('cpu-usage').innerText = `${info}%`;
    document.getElementById('cpu-progress').style.width = `${info}%`;
  
    document.getElementById('cpu-progress').style.background = 
      info > cpuOverload ? 'red' : '#30c88b';
      
  });

  // Get CPU free
  cpu.free().then((info) => {
    document.getElementById('cpu-free').innerText = `${info}%`;
  });

  // Get system Uptime
  document.getElementById('sys-uptime').innerText = formatTime(os.uptime());

}, 2000);

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

