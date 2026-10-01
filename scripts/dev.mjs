import { spawn } from 'node:child_process'

const isWindows = process.platform === 'win32'
const npmCmd = isWindows ? 'npm.cmd' : 'npm'

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
}

function runService(name, color, args) {
  const prefix = `${color}[${name}]${colors.reset} `
  const proc = spawn(npmCmd, args, {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n')
    for (const line of lines) {
      console.log(`${prefix}${line}`)
    }
  })

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n')
    for (const line of lines) {
      console.error(`${prefix}${line}`)
    }
  })

  proc.on('close', (code) => {
    console.log(`${prefix}processo finalizado com código ${code}`)
  })

  return proc
}

console.log(
  `${colors.yellow}================================================================${colors.reset}`
)
console.log(
  `${colors.yellow}🚀 Iniciando Cash Me — Fullstack Integrado (AdonisJS + Vite)${colors.reset}`
)
console.log(`${colors.gray}Backend:  http://localhost:3333${colors.reset}`)
console.log(`${colors.gray}Frontend: http://localhost:5173${colors.reset}`)
console.log(
  `${colors.yellow}================================================================${colors.reset}\n`
)

const apiProc = runService('API  ', colors.cyan, ['run', 'dev:server'])
const frontProc = runService('FRONT', colors.green, ['run', 'dev:client'])

function cleanup() {
  console.log(`\n${colors.yellow}Encerrando processos...${colors.reset}`)
  if (isWindows) {
    if (apiProc.pid) spawn('taskkill', ['/pid', apiProc.pid.toString(), '/f', '/t'])
    if (frontProc.pid) spawn('taskkill', ['/pid', frontProc.pid.toString(), '/f', '/t'])
  } else {
    apiProc.kill('SIGINT')
    frontProc.kill('SIGINT')
  }
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
