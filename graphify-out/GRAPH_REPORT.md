# Graph Report - API Culture  (2026-05-05)

## Corpus Check
- 42 files · ~40,656 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 84 nodes · 76 edges · 6 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 11 edges
2. `requireAdmin()` - 7 edges
3. `GET()` - 5 edges
4. `adminUnauthorized()` - 5 edges
5. `PATCH()` - 4 edges
6. `DELETE()` - 4 edges
7. `generateMetadata()` - 4 edges
8. `sign()` - 4 edges
9. `sitemap()` - 3 edges
10. `EventDetailPage()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `isValidPassword()`  [INFERRED]
  src\app\api\contact\route.ts → src\lib\auth.ts
- `POST()` --calls--> `clearAdminCookie()`  [INFERRED]
  src\app\api\contact\route.ts → src\lib\auth.ts
- `AdminPage()` --calls--> `requireAdmin()`  [INFERRED]
  src\app\admin\page.tsx → src\lib\auth.ts
- `requireAdmin()` --calls--> `GET()`  [INFERRED]
  src\lib\auth.ts → src\app\api\admin\programs\route.ts
- `POST()` --calls--> `requireAdmin()`  [INFERRED]
  src\app\api\contact\route.ts → src\lib\auth.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.19
Nodes (8): getEvent(), getEvents(), getProgram(), getPrograms(), NotFound(), EventDetailPage(), generateMetadata(), sitemap()

### Community 1 - "Community 1"
Cohesion: 0.39
Nodes (7): clearAdminCookie(), createSessionToken(), isValidPassword(), secret(), setAdminCookie(), sign(), verifyAdminToken()

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (3): adminUnauthorized(), GET(), POST()

### Community 3 - "Community 3"
Cohesion: 0.38
Nodes (4): requireAdmin(), AdminPage(), DELETE(), PATCH()

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (2): load(), mutate()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): createPrismaClient(), getPrismaClient()

## Knowledge Gaps
- **Thin community `Community 5`** (3 nodes): `load()`, `mutate()`, `admin-console.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (3 nodes): `createPrismaClient()`, `getPrismaClient()`, `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Community 2` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `Community 3` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `adminUnauthorized()` connect `Community 2` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `POST()` (e.g. with `requireAdmin()` and `adminUnauthorized()`) actually correct?**
  _`POST()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `requireAdmin()` (e.g. with `AdminPage()` and `GET()`) actually correct?**
  _`requireAdmin()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `GET()` (e.g. with `requireAdmin()` and `adminUnauthorized()`) actually correct?**
  _`GET()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `adminUnauthorized()` (e.g. with `GET()` and `POST()`) actually correct?**
  _`adminUnauthorized()` has 4 INFERRED edges - model-reasoned connections that need verification._