'use strict';

module.exports = {
  encrypt() {
    this.serverless.cli.log(`Name of the secret: ${this.options.name}`);
    this.serverless.cli.log(`Encrypt the text: ${this.options.text}`);

    const params = {
      KeyId: this.serverless.service.custom.cryptKeyId,
      Plaintext: this.options.text,
    };

    return this.provider.request(
      'KMS',
      'encrypt',
      params,
      this.options.stage, this.options.region
    ).then((ret) => {
      const ciperText = ret.CiphertextBlob.toString('base64');
      this.serverless.cli.log(`Cipher text: ${ciperText}`);
      this.cipherText = ciperText;
    });
  },
};
