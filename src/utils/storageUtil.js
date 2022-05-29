const CryptoJS = require('crypto-js');
Secret = 'i_have_some_small_master_secret_live_pin';

exports.StorageUtil = (function () {
    function StorageUtil() {
    }
    StorageUtil.encryptData = function (data) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), Secret).toString();
        }
        catch (e) {
            console.log(e);
        }
    };
    StorageUtil.decryptData = function (data) {
        try {
            var bytes = CryptoJS.AES.decrypt(data, Secret);
            if (bytes.toString()) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;
        }
        catch (e) {
            console.log(e);
        }
    };
    return StorageUtil;
})();