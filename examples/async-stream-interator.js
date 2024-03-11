import { pipeline } from 'stream/promises'
import { setTimeout } from 'timers/promises'


async function* myCustomReadable() {
  yield Buffer.from('this is my')
  await setTimeout(1000)
  yield Buffer.from('custom readable')
  await setTimeout(1000)
  yield Buffer.from('custom readable')
  await setTimeout(1000)
  yield Buffer.from('custom readable')
}

async function* myCustomWritable(stream) {
  for await (const chunk of stream) {
    console.log('[wirtable] ', chunk)
  }
}

async function* myCustomTransform(stream) {
  for await (const chunk of stream) {
    yield chunk.toString().replace(/\s/g, "_");

  }
}

try {
  const controller = new AbortController()

  setImmediate(() => controller.abort())

  await pipeline(myCustomReadable, myCustomTransform, myCustomWritable)
  console.log('Process finished')
} catch (error) {
  console.error('abort', error.message)
}

