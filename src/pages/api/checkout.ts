import { NextApiRequest, NextApiResponse } from 'next';

import { stripe } from '@/lib/stripe';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { priceId } = req.body;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  if (!priceId) {
    return res.status(400).json({ error: 'Price not found' });
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  res.status(201).json({ checkoutUrl: checkoutSession.url });
};

export default handler;
