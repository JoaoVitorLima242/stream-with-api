import axios from 'axios'
import { PassThrough, Writable } from 'stream'

const API_01 = "http://localhost:3000"
const API_02 = "http://localhost:4000"

const requests = await Promise.all([
  axios({
    method: 'get',
    url: API_01,
    responseType: 'stream'
  }),
  axios({
    method: 'get',
    url: API_02,
    responseType: 'stream'
  })
])

const result = requests.map(({ data }) => data)

const output = new Writable({
  write(chunk, enconding, callback) {
    const data = chunk.toString().replace(/\n/, "");
    // ?=- -> 
    const name = data.match(/:"(?<name>.*)(?=-)/).groups.name
    console.log(`[${name}] ${data}`)

    callback()
  }
})


function merge(streams) {
  return streams.reduce((previous, current, index, items) => {
    current.pipe(previous, { end: false })
    current.on('end', () => items.every(s => s.ended) && previous.end())

    return previous
  }, new PassThrough())
}

const streams = merge(result).pipe(output)
