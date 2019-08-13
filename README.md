Windows-ICS
===========

Control Windows Internet Connection Sharing (ICS) utilizing Powershell functions written by Mike F Robbins found [here](https://github.com/mikefrobbins/PowerShell).  

Note:  I mainly just needed to be able to toggle ICS for an interface since it sometimes stops working and manually resetting is annoying.  It looks like there are other neat functions in Mikes repository so I built this to potentially be able to utilize more of them or other Powershell function libraries.

Usage
-----

```javascript
const { getInternetConnectionSharing, setInternetConnectionSharing } = require('windows-ics');

const internetInterface = 'Ethernet';
const localInterface = 'Wi-Fi';

(async _ => {
  const status = await getInternetConnectionSharing(internetInterface);

  if (!status) {
    await setInternetConnectionSharing(internetInterface, localInterface, true);
  }

  console.log(`Internet from ${internetInterface} is now being shared with ${localInterface}`);
})();
```