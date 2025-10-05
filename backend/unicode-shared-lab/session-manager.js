const http = require('http');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

const TEMPLATE_PATH = '/opt/lab/nginx.template.conf';
const NGINX_CONF_PATH = '/etc/nginx/nginx.conf';
const BASE_PORT = 10000;
let nextPort = BASE_PORT;
const sessions = {};

function updateNginxConfig() {
    let upstreams = '';
    for (const user in sessions) {
        upstreams += `    upstream user_${user} { server 127.0.0.1:${sessions[user].port}; }\n`;
    }
    const newConfig = fs.readFileSync(TEMPLATE_PATH, 'utf8').replace('# {{UPSTREAMS}}', upstreams);
    fs.writeFileSync(NGINX_CONF_PATH, newConfig);

    if (fs.existsSync('/run/nginx.pid')) {
        spawnSync('nginx', ['-s', 'reload']);
    }
}

function startSession(username, role) {
    if (sessions[username]) return;

    const userHome = `/home/${username}`;
    if (spawnSync('id', [username]).status !== 0) {
        console.log(`Creating user: ${username}`);
        spawnSync('useradd', ['-m', '-s', '/bin/bash', username]);
        if (role === 'student') {
            spawnSync('usermod', ['-aG', 'students', username]);
            fs.symlinkSync('/home/teacher/shared', `${userHome}/shared`);
            spawnSync('chmod', ['750', userHome]);
        }
    }

    const port = nextPort++;
    const proc = spawn('gosu', [
        username, 'code-server', '--bind-addr', `127.0.0.1:${port}`, '--auth', 'none', userHome
    ], { detached: true, stdio: 'inherit' });
    proc.unref();

    sessions[username] = { port: port, pid: proc.pid };
    console.log(`Started session for ${username} on port ${port}`);
    updateNginxConfig();
}

const server = http.createServer((req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const user = url.searchParams.get('user');
        const role = url.searchParams.get('role') || 'student';
        if (user) {
            startSession(user, role);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(sessions[user] || {}));
        }
    } catch (e) {
        console.error("Server Error:", e);
        res.statusCode = 500;
        res.end("Server error.");
    }
});

server.listen(5000, () => {
    console.log('Session manager listening on 5000');
    updateNginxConfig();
});