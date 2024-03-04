import http from "http"
import { Readable } from "stream"


function api1(req, res) {
  let count = 0

  const readable = new Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= 1e2) {
          this.push(JSON.stringify({ id: Date.now(), name: `Joao-${count}` }) + '\n')
          return;
        }
        clearInterval(intervalContext)
        this.push(null)
      }

      setInterval(function() { everySecond(this) })
    }
  })

  readable.pipe(res)
}
function api2(req, res) {
  let count = 0

  const readable = new Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= 1e2) {
          this.push(JSON.stringify({ id: Date.now(), name: `Vitor-${count}` }) + '\n')
          return;
        }
        clearInterval(intervalContext)
        this.push(null)
      }

      setInterval(function() { everySecond(this) })
    }
  })

  readable.pipe(res)
}

http.createServer(api1).listen(3000, () => console.log('running at 3000'))
http.createServer(api2).listen(4000, () => console.log('running at 4000'))
