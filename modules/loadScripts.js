const fs = require('fs');
const { join } = require('path');

const ext = 'ps1';

/**
 * Scan a directory for ps1 scripts, pull the function names, paths
 * and get their dependencies.  Assumes function names are identical
 * to the file names and their dependecies are in the same directory.
 *
 * @param {*} powerShellPath
 */
function loadScripts(powerShellPath) {
  // Get all scripts in the
  const powerShellScripts = fs.readdirSync(powerShellPath)
  .filter(file => file.split('.')[file.split('.').length - 1] === ext)
  .filter(file => file.indexOf('profile.ps1') === -1)
  .map(file => { return {
    name: file.split('.')[0],
    path: join(powerShellPath, file),
    dependencies: []
  };});
  
  // Add dependencies
  powerShellScripts.forEach(script => {
    const data = fs.readFileSync(script.path).toString().toLowerCase();
  
    powerShellScripts
    .filter(_script => _script.name !== script.name) // Exclude self
    .filter(_script => data.indexOf(_script.name.toLowerCase()) !== -1) // Contains reference to other script
    .forEach(dependency => script.dependencies.push(dependency.path));
  });

  return powerShellScripts;
}

module.exports = loadScripts;
