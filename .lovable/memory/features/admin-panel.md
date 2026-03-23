Admin panel implementation details and architecture decisions.

## Database
- `user_roles` table with `app_role` enum ('admin', 'moderator', 'user')
- `has_role()` security definer function for RLS
- First admin must be added manually via database insert

## Files
- `src/pages/AdminPage.tsx` — layout + auth guard
- `src/components/admin/AdminSidebar.tsx` — navigation
- `src/components/admin/AdminStats.tsx` — platform overview (mock)
- `src/components/admin/AdminUsers.tsx` — user management (mock)
- `src/components/admin/AdminAgents.tsx` — agent moderation (mock)
- `src/components/admin/AdminContent.tsx` — CMS UI (mock)
- `src/hooks/useIsAdmin.ts` — role check via has_role() RPC

## Route
- `/admin` — protected, redirects non-admins to /dashboard

## Backend Integration Points
- Replace mock data in AdminUsers with database query
- Replace mock agents in AdminAgents with marketplace table
- AdminContent save → database/API
- AdminStats → analytics API
