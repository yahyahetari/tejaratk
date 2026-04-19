const crypto = require('crypto');
const secret = 'ntfset_01knhzhm8bp8cztf9h8h125v86';

async function testHook() {
  const payload = {
    event_type: 'subscription.created',
    data: {
      id: 'sub_123',
      customer_id: 'cus_123',
      items: [{ price: { id: 'pri_premium_monthly' } }],
      status: 'active',
      current_billing_period: { starts_at: new Date().toISOString(), ends_at: new Date().toISOString() },
      custom_data: {
        merchantId: 'cmlyyou0e000nqhi1bmoy5xa1',
        userId: 'cmlyyotpi000lqhi1x6aqbd23'
      }
    }
  };
  
  const rawBody = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const payloadSequence = `${ts}:${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadSequence);
  const h1 = hmac.digest('hex');
  const signature = `ts=${ts};h1=${h1}`;

  console.log("Sending payload...");
  try {
    const res = await fetch('https://tejaratk.vercel.app/api/webhooks/paddle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paddle-signature': signature
      },
      body: rawBody
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error(err);
  }
}

testHook();
