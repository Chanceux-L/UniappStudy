const NodeSSH = require('node-deploy');
const dayjs = require('dayjs');
const path = require('path');

module.exports = () => {
  return NodeSSH.deploy({
    project_dir: '/var/www/xxx-frontend',
    namespace: 'app',
    release_name: dayjs().format('YYYY-MM-DD_HH_mm'),
    local_target: path.resolve('dist/build/h5'),
    tar: true,
    ssh_configs: [
      {
        host: process.env.SSH_HOST,
      },
    ]
  });
};
