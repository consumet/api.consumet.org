module.exports = {
  apps: [{
    name: 'consumet-api',
    script: 'dist/main.js',
    cwd: process.env.HOME + '/api.consumet.org',
    interpreter: process.env.HOME + '/.bun/bin/bun',
    cron_restart: '0 0 * * *',
    env: {
      PORT: 8000,
      NODE_ENV: 'production'
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
