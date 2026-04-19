const { spawn } = require('child_process');
const path = require('path');

const runProcess = (name, command, cwd, color) => {
  const [cmd, ...args] = command.split(' ');
  const proc = spawn(cmd, args, { 
    cwd: cwd, 
    shell: true,
    stdio: 'pipe' 
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            process.stdout.write(`${color}[${name}]\x1b[0m ${line}\n`);
        }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            process.stderr.write(`\x1b[31m[${name} ERROR]\x1b[0m ${line}\n`);
        }
    });
  });

  proc.on('close', (code) => {
    console.log(`\x1b[33m[${name}] process exited with code ${code}\x1b[0m`);
  });
};

console.log('\x1b[32mStarting Nafees Perfumes Backend and Frontend...\x1b[0m\n');

// Cyan for backend, Magenta for frontend
runProcess('BACKEND', 'npm run dev', path.join(__dirname, 'backend'), '\x1b[36m'); 
runProcess('FRONTEND', 'npm run dev', path.join(__dirname, 'frontend'), '\x1b[35m'); 
