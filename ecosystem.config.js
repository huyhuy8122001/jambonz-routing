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
      JAMBONZ_ACCOUNT_SID: '6ca847a9-0db6-4f10-8be7-2214d317c5e0',
      JAMBONZ_API_KEY: 'd11af09a-e6eb-4dbf-bd18-10fdbdf5d946',
      JAMBONZ_REST_API_BASE_URL: 'https://cpaas61.epacific.net',
      WEBHOOK_SECRET: 'wh_secret_kZmRWetkAuBP8gEWYwDfqW',
      HTTP_PASSWORD: '',
      HTTP_USERNAME: '',
    }
  }]
};
