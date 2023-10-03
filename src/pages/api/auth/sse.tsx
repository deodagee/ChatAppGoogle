import { NextApiRequest, NextApiResponse } from 'next';

const sseHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send data to the client periodically
    const intervalId = setInterval(() => {
      res.write('data: Hello, client!\n\n');
    }, 1000);

    // Handle client disconnect
    req.on('close', () => {
      // Clean up resources if necessary
      clearInterval(intervalId);
    });
  } else {
    // Handle other types of requests
    res.statusCode = 404;
    res.end();
  }
};

export default sseHandler;
