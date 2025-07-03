
-- Enable real-time for comments table
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Enable real-time for replies table  
ALTER PUBLICATION supabase_realtime ADD TABLE replies;

-- Check if real-time is enabled
SELECT 
    schemaname,
    tablename,
    hasreplication
FROM pg_tables 
WHERE tablename IN ('comments', 'replies');

-- Verify publication includes our tables
SELECT 
    schemaname,
    tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('comments', 'replies'); 