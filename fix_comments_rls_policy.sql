-- Drop the existing INSERT policy that references non-existent profiles table
DROP POLICY IF EXISTS "Authenticated users can create comments" ON "public"."comments";

-- Create new INSERT policy that works with admin_profiles and voter_profiles tables
CREATE POLICY "Authenticated users can create comments"
ON "public"."comments"
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND (
    -- Check if user is admin and has access to the post's organization
    (user_type = 'admin' AND EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM posts p
        JOIN organizations o ON o.id = p.org_id
        WHERE p.id = comments.post_id
        AND (p.is_uni_lev = true OR ap.administered_org = o.organization_name)
      )
    ))
    OR
    -- Check if user is voter and has access to the post's organization
    (user_type = 'voter' AND EXISTS (
      SELECT 1 FROM voter_profiles vp
      WHERE vp.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM posts p
        JOIN organizations o ON o.id = p.org_id
        WHERE p.id = comments.post_id
        AND (p.is_uni_lev = true OR vp.department_org = o.organization_name)
      )
    ))
  )
);

-- Also fix the SELECT policies to work with the correct table structure
DROP POLICY IF EXISTS "Users can view comments on accessible posts" ON "public"."comments";
DROP POLICY IF EXISTS "Users can view comments on posts they can access" ON "public"."comments";

-- Create new SELECT policy
CREATE POLICY "Users can view comments on accessible posts"
ON "public"."comments"
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = comments.post_id
    AND (
      p.is_uni_lev = true
      OR (
        p.is_uni_lev = false 
        AND EXISTS (
          SELECT 1 FROM organizations o
          WHERE o.id = p.org_id
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
      )
    )
  )
);

-- Fix replies table RLS policies as well
-- Drop existing policies that might reference non-existent profiles table
DROP POLICY IF EXISTS "Authenticated users can create replies" ON "public"."replies";
DROP POLICY IF EXISTS "Users can view replies on accessible comments" ON "public"."replies";

-- Create new INSERT policy for replies
CREATE POLICY "Authenticated users can create replies"
ON "public"."replies"
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND (
    -- Check if user is admin and has access to the comment's post organization
    (user_type = 'admin' AND EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM comments c
        JOIN posts p ON p.id = c.post_id
        JOIN organizations o ON o.id = p.org_id
        WHERE c.id = replies.comment_id
        AND (p.is_uni_lev = true OR ap.administered_org = o.organization_name)
      )
    ))
    OR
    -- Check if user is voter and has access to the comment's post organization
    (user_type = 'voter' AND EXISTS (
      SELECT 1 FROM voter_profiles vp
      WHERE vp.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM comments c
        JOIN posts p ON p.id = c.post_id
        JOIN organizations o ON o.id = p.org_id
        WHERE c.id = replies.comment_id
        AND (p.is_uni_lev = true OR vp.department_org = o.organization_name)
      )
    ))
  )
);

-- Create new SELECT policy for replies
CREATE POLICY "Users can view replies on accessible comments"
ON "public"."replies"
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM comments c
    JOIN posts p ON p.id = c.post_id
    WHERE c.id = replies.comment_id
    AND (
      p.is_uni_lev = true
      OR (
        p.is_uni_lev = false 
        AND EXISTS (
          SELECT 1 FROM organizations o
          WHERE o.id = p.org_id
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
      )
    )
  )
); 