const mobileTokenConfig = {
    iss: 'pg.moe.edu.sg',
    digitalSigningSecret: 'secret',
    algorithm: 'HS256',
    mobileToken: {
      accessTokenExpiresInMins: 60,
      refreshTokenExpiresInMins: 60 * 24 * 365
    }, // 1 year
    webToken: {
      accessTokenExpiresInMins: 30,
      refreshTokenExpiresInMins: 60 * 24 * 1
    }, // 1 day
    refreshTokenHashAlgorithm: 'sha256',
    refreshTokenHashKey: 'somerefreshsecret'
  };

module.exports = mobileTokenConfig;