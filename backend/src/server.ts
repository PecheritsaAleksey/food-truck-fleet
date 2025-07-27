import Fastify from 'fastify';
import crypto from 'crypto';

function validateInitData(initData: string, botToken: string): number | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  if (computedHash !== hash) return null;
  const userStr = params.get('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id;
  } catch {
    return null;
  }
}

const botToken = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const fastify = Fastify({ logger: true });

fastify.post('/auth', async (request, reply) => {
  const { initData } = request.body as { initData: string };
  const userId = validateInitData(initData, botToken);
  if (!userId) {
    return reply.status(401).send({ error: 'Invalid init data' });
  }
  return { user_id: userId };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
