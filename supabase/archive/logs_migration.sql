-- Clean up all existing logs (including mocks) to start fresh
TRUNCATE TABLE system_logs;

-- Optional: If you want to delete specific mock entries but keep real ones:
-- DELETE FROM system_logs WHERE metadata->>'is_mock' = 'true'; -- Assuming you tagged them, otherwise TRUNCATE is best for a fresh start.
