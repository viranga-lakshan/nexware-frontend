"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditTable } from "@/features/audit/components/audit-table";
import { useAuditLogs } from "@/features/audit/hooks/use-audit-logs";
import { useServerPagination } from "@/hooks/use-server-pagination";

export function AuditView() {
  const pagination = useServerPagination(20);
  const audit = useAuditLogs(pagination.params);

  return (
    <AppShell>
      <PageHeader
        title="Audit Logs"
        description="Administrative HTTP audit trail for compliance and incident investigation."
      />
      {audit.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <AuditTable
          data={audit.data?.content ?? []}
          isRefetching={audit.isFetching && !audit.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(audit.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
