module.exports = {
  apps : [{
    name: 'my-new-app',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOGLEVEL: 'info',
      HTTP_PORT: 3001,
      JAMBONZ_ACCOUNT_SID: '72377df7-4b8d-4b9b-afd9-ada81ca9bc10',
      JAMBONZ_API_KEY: '21fba1a8-ee61-4153-b2f1-739ea0da1c0b',
      JAMBONZ_REST_API_BASE_URL: 'https://cpaas61.epacific.net',
      WEBHOOK_SECRET: 'wh_secret_pEkAS1Ejmpf3gmBaa4BD41',
      HTTP_PASSWORD: '',
      HTTP_USERNAME: '',
    }
  }]
};
