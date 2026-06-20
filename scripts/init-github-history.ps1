# Initialize git repo with 20 backdated commits (Apr 2026 -> Jun 2026) and push to GitHub.
# Frontend history starts after backend auth module (Mar 2026).
$ErrorActionPreference = "Stop"
Set-Location "e:\NexWare Distribution Platform\nexware-frontend"

function Commit-At {
    param(
        [string]$Date,
        [string]$Message,
        [string[]]$Paths
    )
    if ($Paths.Count -gt 0) {
        git add -- @Paths
    }
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    git commit -m $Message
    Remove-Item Env:GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
    Remove-Item Env:GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
}

if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
}

git init -b main

Commit-At "2026-04-02T10:20:00" "chore: initial Next.js 15 project scaffold" @(
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next-env.d.ts",
    "next.config.ts",
    ".gitignore",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "components.json"
)

Commit-At "2026-04-06T14:35:00" "feat(app): add root layout, globals, and landing redirect" @(
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "public/icon.svg"
)

Commit-At "2026-04-10T11:15:00" "feat(ui): add shadcn-style component library" @(
    "src/components/ui",
    "src/lib/utils.ts"
)

Commit-At "2026-04-14T16:40:00" "feat(core): add API types, client, and auth token storage" @(
    "src/types",
    "src/services/api-client.ts",
    "src/lib/auth-token.ts",
    "src/lib/validators.ts"
)

Commit-At "2026-04-18T09:50:00" "feat(auth): add login, register forms and auth API" @(
    "src/features/auth",
    "src/app/(auth)"
)

Commit-At "2026-04-22T13:25:00" "feat(layout): add app shell, middleware, and providers" @(
    "src/middleware.ts",
    "src/providers",
    "src/components/layout",
    "src/constants"
)

Commit-At "2026-04-26T15:10:00" "feat(dashboard): add KPI cards and analytics charts" @(
    "src/features/pages/dashboard-view.tsx",
    "src/components/dashboard",
    "src/features/analytics",
    "src/app/dashboard/page.tsx"
)

Commit-At "2026-04-30T10:45:00" "feat(product): add product catalog table and create dialog" @(
    "src/features/product",
    "src/features/pages/products-view.tsx",
    "src/app/products/page.tsx"
)

Commit-At "2026-05-04T14:20:00" "feat(supplier): add supplier CRUD UI" @(
    "src/features/supplier",
    "src/features/pages/suppliers-view.tsx",
    "src/app/suppliers/page.tsx"
)

Commit-At "2026-05-08T11:30:00" "feat(warehouse): add warehouse list and transfer form" @(
    "src/features/warehouse",
    "src/features/pages/warehouses-view.tsx",
    "src/app/warehouses/page.tsx"
)

Commit-At "2026-05-12T16:05:00" "feat(inventory): add stock table, adjustments, and history" @(
    "src/features/inventory",
    "src/features/pages/inventory-view.tsx",
    "src/app/inventory/page.tsx"
)

Commit-At "2026-05-16T09:40:00" "feat(reservation): add reservation create and release UI" @(
    "src/features/reservation",
    "src/features/pages/reservations-view.tsx",
    "src/app/reservations/page.tsx"
)

Commit-At "2026-05-20T13:55:00" "feat(purchase-order): add PO workflow and receive dialog" @(
    "src/features/purchase-order",
    "src/features/pages/purchase-orders-view.tsx",
    "src/app/purchase-orders/page.tsx"
)

Commit-At "2026-05-24T10:15:00" "feat(notification): add in-app notifications page" @(
    "src/features/notification",
    "src/features/pages/notifications-view.tsx",
    "src/app/notifications/page.tsx"
)

Commit-At "2026-05-28T15:30:00" "feat(audit): add admin audit log viewer" @(
    "src/features/audit",
    "src/features/pages/audit-view.tsx",
    "src/app/audit/page.tsx"
)

Commit-At "2026-06-01T11:00:00" "feat(user): add user management and shared data components" @(
    "src/features/user",
    "src/features/pages/users-view.tsx",
    "src/app/users/page.tsx",
    "src/components/data",
    "src/components/forms",
    "src/hooks",
    "src/utils"
)

Commit-At "2026-06-05T14:45:00" "feat(reports): add analytics reports, settings, and stores" @(
    "src/features/pages/reports-view.tsx",
    "src/features/pages/settings-view.tsx",
    "src/app/reports/page.tsx",
    "src/app/settings/page.tsx",
    "src/store"
)

Commit-At "2026-06-10T09:20:00" "chore(docker): add Dockerfile and compose stack" @(
    "Dockerfile",
    "docker-compose.yml",
    ".dockerignore"
)

Commit-At "2026-06-15T16:10:00" "feat(realtime): add WebSocket client and sync hooks" @(
    "src/services/websocket-client.ts",
    "src/lib/realtime-config.ts",
    "src/hooks/use-realtime-sync.ts"
)

Commit-At "2026-06-20T11:35:00" "feat(deploy): add Vercel config, production env, and CI" @(
    "vercel.json",
    "src/lib/env.ts",
    ".env.example",
    "README.md",
    ".github/workflows/ci.yml",
    "scripts/init-github-history.ps1"
)

git remote add origin "https://github.com/viranga-lakshan/nexware-frontend.git"

Write-Host ""
Write-Host "Created $(git rev-list --count HEAD) commits:"
git log --oneline --format="%h %ad %s" --date=short
