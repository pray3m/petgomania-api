import crypto from "crypto";
/**
 * @description Verify the signature sent by PayU
 * @param {Object} params - Parameters required for signature verification
 * @param {Boolean} isWebhook - Indicates if the verification is for webhook
 * @returns {Boolean} True if signature is valid
 */
export const verifySignature = (params, isWebhook = false) => {
  const { signature, referenceCode, TX_VALUE, currency, polTransactionState } =
    params;

  const { PAYU_API_KEY, PAYU_MERCHANT_ID } = process.env;

  if (!PAYU_API_KEY || !PAYU_MERCHANT_ID) {
    throw new AppError(500, "PayU configuration is incomplete");
  }

  // Construct the signature string based on the type of request
  let signatureString;
  if (isWebhook) {
    // For webhook: ApiKey~merchantId~referenceCode~value~currency~state_pol
    signatureString = `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${TX_VALUE}~${currency}~${polTransactionState}`;
  } else {
    // For payment response: ApiKey~merchantId~referenceCode~amount~currency
    signatureString = `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${TX_VALUE}~${currency}`;
  }

  const expectedSignature = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex");

  // Debugging logs
  console.log("----- Signature Verification -----");
  console.log("Signature String:", signatureString);
  console.log("Expected Signature:", expectedSignature);
  console.log("Received Signature:", signature);
  console.log("-----------------------------------");

  // Compare signatures in a case-insensitive manner
  return (
    signature.trim().toLowerCase() === expectedSignature.trim().toLowerCase()
  );
};
