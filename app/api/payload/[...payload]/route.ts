// Temporarily disabled due to PayloadCMS v3 compatibility issues
// import { createPayloadClient } from '@payloadcms/next-payload';
// import { nextHandler } from '@payloadcms/next-payload';
// import config from '../../../../payload.config';

// // Initialize Payload
// const payload = createPayloadClient({
//   config,
// });

// // Export the handler
// export const { GET, POST, PATCH, DELETE } = nextHandler({
//   payload,
//   onRequest: async ({ req, res }) => {
//     // Add any custom middleware here
//     console.log(`Payload CMS request: ${req.method} ${req.url}`);
//   },
//   onError: async (err, { req, res }) => {
//     console.log('Payload CMS error:', err);
//   },
// });

export async function GET() {
  return new Response('PayloadCMS temporarily disabled', { status: 503 });
}

export async function POST() {
  return new Response('PayloadCMS temporarily disabled', { status: 503 });
}

export async function PATCH() {
  return new Response('PayloadCMS temporarily disabled', { status: 503 });
}

export async function DELETE() {
  return new Response('PayloadCMS temporarily disabled', { status: 503 });
}
