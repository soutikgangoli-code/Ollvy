-- Grant execute permission for redeem_credits_atomic function
GRANT EXECUTE ON FUNCTION redeem_credits_atomic(UUID, UUID, BIGINT) TO service_role
