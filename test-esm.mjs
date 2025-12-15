import KYC_SDK from './dist/index.js'

const sdk = new KYC_SDK({
    apiKey: "test",
    debug: true
});

console.log('SDK created successfully:', sdk);
sdk.init().then(console.log);