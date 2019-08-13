const { join } = require('path');

const Powershell = require('node-powershell');

const powerShellPath = join(__dirname, '/node_modules/PowerShell/MrToolkit/Public/');
const powerShellScripts = require('./modules/loadScripts')(powerShellPath);

if (process.platform !== 'win32') {
  throw new Error('This script is exclusively for the Windows Operating System');
}

/**
 * Run a command in powershell
 *
 * @param {*} command
 */
function runPowershellCommand(command) {
  const ps = new Powershell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  powerShellScripts
  .filter(script => command.toLowerCase().indexOf(script.name.toLowerCase()) !== -1) // case insensitve
  .forEach(script => {
    ps.addCommand(`. ${script.path}`);

    script.dependencies
    .forEach(dependencyPath => ps.addCommand(`. ${dependencyPath}`));
  });

  ps.addCommand(`${command} | ConvertTo-Json`);

  return ps.invoke()
  .then(response => {
    ps.dispose();

    return response && JSON.parse(response);
  }).catch(error => {
    console.log(`Error:  ${error.message}`);
  });
}

/**
 * Get the status of a network interface to see if it's being used for internet
 * connection sharing (ICS)
 *
 * @param {String} interfaceName The network interface of which to get the status
 * @returns {Boolean} True if the network interface is being used for ICS, false if not
 */
function getInternetConnectionSharing(interfaceName = 'Wi-Fi') {
  const command = `Get-MrInternetConnectionSharing ${interfaceName}`;

  return runPowershellCommand(command).then(result => result.SharingEnabled);
}

/**
 * Enable or disable internet connection sharing (ICS) between two network interfaces
 *
 * @param {String} internetInterfaceName The network interface to be shared
 * @param {String} localInterfaceName The network interface with which to share connection
 */
function setInternetConnectionSharing(internetInterfaceName = 'Wi-Fi', localInterfaceName = 'Ethernet', enable = true) {
  const command = `Set-MrInternetConnectionSharing `+
    `-InternetInterfaceName ${internetInterfaceName} `+
    `-LocalInterfaceName ${localInterfaceName} `+
    `-Enabled $${enable.toString()}`;

  return runPowershellCommand(command);
}

/**
 * Test a port or range of ports for a computer or range of computers
 *
 * @param {*} computer
 * @param {*} port 
 * @param {*} useUDP 
 * @param {*} timeout 
 */
function testPort(computer = 'localhost', port = [1, 80], useUDP = false, timeout = 1000) {
  let typePort;

  computer = `-computer ${computer.constructor === Array ? `@("${computer.split('","')}")` : computer}`;
  port = `-port ${port.constructor === Array ? `@(${port[0]}..${port[port.length - 1]})` : port}`;
  typePort = `${useUDP ? '-udp -UDPTimeOut' : '-tcp -TCPTimeOut'} ${timeout}`;

  const command = `Test-Port ${computer} ${port} ${typePort}`;

  return runPowershellCommand(command);
}

/**
 *
 */
function getService() {
  const command = `Get-MrService`;

  return runPowershellCommand(command);
}

module.exports = {
  getService,
  getInternetConnectionSharing,
  setInternetConnectionSharing,
  runPowershellCommand,
  testPort,
};
