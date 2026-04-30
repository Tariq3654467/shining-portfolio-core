/*
  # Add payment method tracking to payment_sessions

  1. Modified Tables
    - `payment_sessions`: Add payment method tracking fields
      - `payment_method` (text - stripe/paypal/esewa/khalti/ime-pay)
      - `paypal_order_id` (text, nullable)
      - `khalti_transaction_id` (text, nullable)
      - `bank_reference` (text, nullable)

  2. Notes
    - These fields track which payment gateway was used
    - Allows for proper payment reconciliation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_sessions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE payment_sessions ADD COLUMN payment_method text DEFAULT 'stripe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_sessions' AND column_name = 'paypal_order_id'
  ) THEN
    ALTER TABLE payment_sessions ADD COLUMN paypal_order_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_sessions' AND column_name = 'khalti_transaction_id'
  ) THEN
    ALTER TABLE payment_sessions ADD COLUMN khalti_transaction_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_sessions' AND column_name = 'bank_reference'
  ) THEN
    ALTER TABLE payment_sessions ADD COLUMN bank_reference text;
  END IF;
END $$;
