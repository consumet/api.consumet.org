module.exports = {
  apps: [{
    name: 'consumet-api-preview',
    script: 'dist/main.js',
    cwd: process.env.HOME + '/api.consumet.org-preview',
    interpreter: process.env.HOME + '/.bun/bin/bun',
    cron_restart: '0 0 * * *',
    env: {
      PORT: 8001,
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
