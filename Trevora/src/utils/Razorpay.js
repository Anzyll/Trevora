export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount) => {
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100, 
    currency: 'INR'
  };
};

export const initializeRazorpayPayment = (orderData, userData, cart, address, onSuccess, onError) => {
  const options = {
    key: 'rzp_test_RVPZP2EvLXA1j8', 
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Trevora',
    description: `Payment for Order #${orderData.id}`,
    order_id: orderData.id,
    handler: function (response) {
      onSuccess({
        ...response,
        orderData,
        userData,
        cart,
        address
      });
    },
    prefill: {
      name: userData?.name || 'Customer',
      email: userData?.email || 'customer@example.com',
      contact: userData?.phone || '9999999999'
    },
    theme: {
      color: '#000000'
    },
    modal: {
      ondismiss: function() {
        onError('Payment cancelled by user');
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};