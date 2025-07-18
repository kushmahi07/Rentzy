import { createServer } from 'http';
import { createApp } from './app';

const app = createApp();
const server = createServer(app);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`[Backend] Server running on ${HOST}:${PORT}`);
});

export { app, server };