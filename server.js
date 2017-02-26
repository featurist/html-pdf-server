const http = require('http')
const url = require('url')
const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const tempfile = require('tempfile')
const electron = require('electron')

const server = http.createServer((req,res) => {
  const parsedUrl = url.parse(req.url, true)
  if (parsedUrl.pathname == '/pdf') {
    const query = parsedUrl.query
    const tempPath = tempfile('.pdf')

    const child = childProcess.spawn(electron, [path.join(__dirname, 'main.js'), query.url, tempPath])
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    process.stdin.pipe(child.stdin)

    child.on('close', function (code) {
      fs.readFile(tempPath, function (err, contents) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'})
          res.end(err.message)
        } else {
          res.writeHead(200, {'Content-Type': 'application/pdf'})
          res.end(contents)
        }
      })
    })
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not found')
  }
});

const port = process.env.PORT || 8877
server.listen(port, function() {
  console.log("http://localhost:" + port)
})
