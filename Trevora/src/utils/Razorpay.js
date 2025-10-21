export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};


export const initializeRazorpayPayment = (
  totalAmount,
  userData,
  cart,
  address,
  onSuccess,
  onError
) => {
  const amountInPaise = totalAmount * 100;
  const options = {
    key: "rzp_test_RVPZP2EvLXA1j8",
    amount: amountInPaise,
    currency: "INR",
    name: "Trevora",
    description: `Payment for Order`,
    handler: function (response) {
      onSuccess({
        ...response,
        userData,
        cart,
        address,
      });
    },
    prefill: {
      name: userData?.name || "Customer",
      email: userData?.email || "customer@example.com",
      contact: userData?.phone || "9999999999",
    },
    theme: {
      color: "#000000",
    },
    modal: {
      ondismiss: function () {
        onError("Payment cancelled by user");
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
