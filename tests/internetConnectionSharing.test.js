const assert = require('assert');

const { getInternetConnectionSharing, setInternetConnectionSharing } = require('..');

describe('Internet Connection Sharing', _ => {

  // Settings for tests
  const internetInterfaceName = 'Wi-Fi';
  const localInterfaceName = 'Ethernet';

  it('should get internet connection sharing status', done => {
    getInternetConnectionSharing(internetInterfaceName)
    .then(status => {
      assert.equal(status.constructor === Boolean, true);
      done();
    })
  });

  it('should disable internet connection sharing', done => {
    setInternetConnectionSharing(internetInterfaceName, localInterfaceName, false)
    .then(result => console.log(result))
    .then(_ => getInternetConnectionSharing(internetInterfaceName))
    .then(status => {
      assert.equal(status, false);
      done();
    });
  });

  it('should enable internet connection sharing', done => {
    setInternetConnectionSharing(internetInterfaceName, localInterfaceName, true)
    .then(_ => getInternetConnectionSharing(internetInterfaceName))
    .then(status => {
      assert.equal(status, true);
      done();
    });
  });
});
