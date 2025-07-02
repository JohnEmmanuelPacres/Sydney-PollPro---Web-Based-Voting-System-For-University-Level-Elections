-- Simple fix for comments table RLS policies
-- This version is more straightforward and easier to debug

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Authenticated users can create comments" ON "public"."comments";
DROP POLICY IF EXISTS "Users can view comments on accessible posts" ON "public"."comments";
DROP POLICY IF EXISTS "Users can view comments on posts they can access" ON "public"."comments";

-- Simple INSERT policy for comments
CREATE POLICY "Authenticated users can create comments"
ON "public"."comments"
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND (
    -- Allow comments on university-level posts
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = comments.post_id
      AND p.is_uni_lev = true
    )
    OR
    -- Allow admin comments on their organization's posts
    (user_type = 'admin' AND EXISTS (
      SELECT 1 FROM admin_profiles ap
      JOIN posts p ON p.org_id IN (
        SELECT o.id FROM organizations o 
        WHERE o.organization_name = ap.administered_org
      )
      WHERE ap.id = auth.uid()
      AND p.id = comments.post_id
    ))
    OR
    -- Allow voter comments on their department's posts
    (user_type = 'voter' AND EXISTS (
      SELECT 1 FROM voter_profiles vp
      JOIN posts p ON p.org_id IN (
        SELECT o.id FROM organizations o 
        WHERE o.organization_name = vp.department_org
      )
      WHERE vp.id = auth.uid()
      AND p.id = comments.post_id
    ))
  )
);

-- Simple SELECT policy for comments
CREATE POLICY "Users can view comments on accessible posts"
ON "public"."comments"
FOR SELECT
TO public
USING (
  -- Allow viewing comments on university-level posts
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = comments.post_id
    AND p.is_uni_lev = true
  )
  OR
  -- Allow viewing comments on organization posts if user has access
  EXISTS (
    SELECT 1 FROM posts p
    JOIN organizations o ON o.id = p.org_id
    WHERE p.id = comments.post_id
    AND (
      -- Admin access
      EXISTS (
        SELECT 1 FROM admin_profiles ap
        WHERE ap.id = auth.uid()
        AND ap.administered_org = o.organization_name
      )
      OR
      -- Voter access
      EXISTS (
        SELECT 1 FROM voter_profiles vp
        WHERE vp.id = auth.uid()
        AND vp.department_org = o.organization_name
      )
    )
  )
);

-- Simple fix for replies table RLS policies
DROP POLICY IF EXISTS "Authenticated users can create replies" ON "public"."replies";
DROP POLICY IF EXISTS "Users can view replies on accessible comments" ON "public"."replies";

-- Simple INSERT policy for replies
CREATE POLICY "Authenticated users can create replies"
ON "public"."replies"
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND (
    -- Allow replies on university-level post comments
    EXISTS (
      SELECT 1 FROM comments c
      JOIN posts p ON p.id = c.post_id
      WHERE c.id = replies.comment_id
      AND p.is_uni_lev = true
    )
    OR
    -- Allow admin replies on their organization's post comments
    (user_type = 'admin' AND EXISTS (
      SELECT 1 FROM admin_profiles ap
      JOIN comments c ON c.post_id IN (
        SELECT p.id FROM posts p
        JOIN organizations o ON o.id = p.org_id
        WHERE o.organization_name = ap.administered_org
      )
      WHERE ap.id = auth.uid()
      AND c.id = replies.comment_id
    ))
    OR
    -- Allow voter replies on their department's post comments
    (user_type = 'voter' AND EXISTS (
      SELECT 1 FROM voter_profiles vp
      JOIN comments c ON c.post_id IN (
        SELECT p.id FROM posts p
        JOIN organizations o ON o.id = p.org_id
        WHERE o.organization_name = vp.department_org
      )
      WHERE vp.id = auth.uid()
      AND c.id = replies.comment_id
    ))
  )
);

-- Simple SELECT policy for replies
CREATE POLICY "Users can view replies on accessible comments"
ON "public"."replies"
FOR SELECT
TO public
USING (
  -- Allow viewing replies on university-level post comments
  EXISTS (
    SELECT 1 FROM comments c
    JOIN posts p ON p.id = c.post_id
    WHERE c.id = replies.comment_id
    AND p.is_uni_lev = true
  )
  OR
  -- Allow viewing replies on organization post comments if user has access
  EXISTS (
    SELECT 1 FROM comments c
    JOIN posts p ON p.id = c.post_id
    JOIN organizations o ON o.id = p.org_id
    WHERE c.id = replies.comment_id
    AND (
      -- Admin access
      EXISTS (
        SELECT 1 FROM admin_profiles ap
        WHERE ap.id = auth.uid()
        AND ap.administered_org = o.organization_name
      )
      OR
      -- Voter access
      EXISTS (
        SELECT 1 FROM voter_profiles vp
        WHERE vp.id = auth.uid()
        AND vp.department_org = o.organization_name
      )
    )
  )
); 