module.exports = {
  apps: [{
    name: 'consumet-api-preview',
    script: 'dist/main.js',
    cwd: '~/api.consumet.org-preview',
    interpreter: '~/.bun/bin/bun',
    cron_restart: '0 0 * * *',
    env: {
      PORT: 8001,
      NODE_ENV: 'development'
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
