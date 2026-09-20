require('dotenv').config();

async function payment({ email, amount, callback_url }) {
  const secret = process.env.PAYSTACK_SECRET;

  if (!secret) {
    throw new Error('PAYSTACK_SECRET is missing in environment variables');
  }

  const payload = {
    email,
    amount: Number(amount),
    currency: 'NGN',
    callback_url,
  };

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || 'Paystack request failed';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('Paystack initialize error:', error.message);
    throw error;
  }
}

async function verifyPayment(reference) {
  const secret = process.env.PAYSTACK_SECRET;

  if (!secret) {
    throw new Error('PAYSTACK_SECRET is missing in environment variables');
  }

  if (!reference) {
    throw new Error('Payment reference is required');
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || 'Paystack verification failed';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('Paystack verify error:', error.message);
    throw error;
  }
}

module.exports = { payment, verifyPayment };