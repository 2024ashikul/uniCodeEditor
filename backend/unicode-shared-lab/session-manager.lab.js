const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

const NGINX_CONF_PATH = '/etc/nginx/nginx.conf';
const BASE_PORT = 10000;
let nextPort = BASE_PORT;
const sessions = {};

const userList = process.env.USER_LIST || '';

function updateNginxConfig() {
    let upstreams = '';
    for (const user in sessions) {
        upstreams += `    upstream user_${user} { server 127.0.0.1:${sessions[user].port}; }\n`;
    }
    const template = fs.readFileSync('/opt/lab/nginx.template.conf', 'utf8');
    const newConfig = template.replace('# {{UPSTREAMS}}', upstreams);
    fs.writeFileSync(NGINX_CONF_PATH, newConfig);
    console.log('Nginx config file created successfully.');
}

function startSessionForUser(user, role) {
    if (spawnSync('id', [user]).status !== 0) {
        spawnSync('useradd', ['-m', '-s', '/bin/bash', user]);
        if (role === 'student' || role === 'member') {
            spawnSync('usermod', ['-aG', 'students', user]);
            spawnSync('chmod', ['750', `/home/${user}`]);
        } else if (role === 'teacher' || role === 'admin') {
            spawnSync('usermod', ['-aG', 'sudo', user]);
        }
    }

    const port = nextPort++;
    const proc = spawn('gosu', [
        user, 'code-server', '--bind-addr', `127.0.0.1:${port}`, '--auth', 'none', `/home/${user}`
    ], { detached: true, stdio: 'inherit' });
    proc.unref();
    sessions[user] = { port };
    console.log(`Started code-server for ${user} on internal port ${port}`);
}

// --- Main Logic ---
console.log('Internal setup script starting...');
spawnSync('groupadd', ['-r', 'students']);

userList.split(' ').forEach(userRolePair => {
    if (!userRolePair) return;
    const [user, role] = userRolePair.split(':');
    if (user && role) {
        startSessionForUser(user.toLowerCase(), role.toLowerCase());
    }
});

updateNginxConfig();
console.log('All user sessions started. Setup script finished.');
// The script will now exit, and entrypoint.sh will start Nginx.