import fastify from 'fastify';

import fastifyStatic from 'fastify-static';
import fastifyFormBody from 'fastify-formbody';

import exiftool from 'node-exiftool';

import path from 'path';
import fs from 'fs';

const app = fastify({
  bodyLimit: 10 * 1048576,
  logger: {
    prettyPrint: {
      crlf: true,
    },
  },
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../build/www'),
  prefix: '/',
});

app.register(fastifyFormBody);

const pathToUpload = path.join(__dirname, '../build/www/docs');

app.post('/api/encode', async ({ body }, reply) => {
  const { notSafeDoc, safeDoc } = body;

  if (!fs.existsSync(pathToUpload)) {
    fs.mkdirSync(pathToUpload, { recursive: true });
  }

  fs.writeFileSync(`${pathToUpload}/safe-doc.png`, safeDoc.replace(/^data:image\/png;base64,/, ''), 'base64');

  const ep = new exiftool.ExiftoolProcess();

  const imagePath = path.resolve(__dirname, `${pathToUpload}/safe-doc.png`);

  const data = {
    all: '',
    comment: notSafeDoc,
  };

  ep.open()
    .then(() => ep.writeMetadata(imagePath, data, ['overwrite_original']))
    .then(console.log, console.error)
    .then(() => ep.close())
    .catch(console.error);

  return reply.code(200).send(fs.readFileSync(imagePath, 'base64'));
});

app.post('/api/decode', async ({ body }, reply) => {
  if (!fs.existsSync(pathToUpload)) {
    return reply.code(404);
  }

  fs.writeFileSync(`${pathToUpload}/decode.png`, body.safeDoc.replace(/^data:image\/png;base64,/, ''), 'base64');

  const ep = new exiftool.ExiftoolProcess();

  const imagePath = path.resolve(__dirname, `${pathToUpload}/decode.png`);

  return ep
    .open()
    .then(() => ep.readMetadata(imagePath, ['Comment']))
    .then(result => {
      return reply.code(200).send(result.data[0].Comment);
    }, console.error)
    .then(() => ep.close())
    .catch(console.error);
});

const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port: 4000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
