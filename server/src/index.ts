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

app.get('/decode', (req, reply) => {
  console.log(13);
  const stream = fs.createReadStream(path.join(__dirname, '../build/www/index.html'), 'utf8');
  reply.type('text/html').send(stream);
});

app.post('/api/encode', async ({ body }, reply) => {
  try {
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

    await ep
      .open()
      .then(() => ep.writeMetadata(imagePath, data, ['overwrite_original']))
      .then(console.log, console.error)
      .then(() => ep.close())
      .catch(console.error);

    return reply.code(200).send('All ok!');
  } catch (e) {
    console.log(e);
    return e;
  }
});

app.post('/api/decode', async ({ body }, reply) => {
  try {
    let response = '123';

    if (!fs.existsSync(pathToUpload)) {
      return reply.code(404);
    }

    fs.writeFileSync(`${pathToUpload}/decode.png`, body.safeDoc.replace(/^data:image\/png;base64,/, ''), 'base64');

    const ep = new exiftool.ExiftoolProcess();

    const imagePath = path.resolve(__dirname, `${pathToUpload}/decode.png`);

    await ep
      .open()
      .then(() => ep.readMetadata(imagePath, ['Comment']))
      .then(result => {
        console.log(1);
        response = result.data[0].Comment;
      }, console.error)
      .then(() => ep.close())
      .catch(console.error);

    console.log(2);
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
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
