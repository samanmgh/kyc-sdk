const KYC_SDK = require('./dist/index.cjs');

const sdk = new KYC_SDK({
    apiKey: "test",
    debug: true
});

console.log('SDK created successfully:', sdk);
sdk.init().then(console.log);