"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { WarehouseSelect } from "@/components/forms/entity-selects";
import { FormField } from "@/components/forms/form-field";

interface ReceivePurchaseOrderDialogProps {
  orderId: string | null;
  orderNumber?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (warehouseId: string) => void;
  isLoading?: boolean;
}

export function ReceivePurchaseOrderDialog({
  orderId,
  orderNumber,
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: ReceivePurchaseOrderDialogProps) {
  const [warehouseId, setWarehouseId] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive purchase order</DialogTitle>
          <DialogDescription>
            Select the receiving warehouse for {orderNumber ?? orderId}.
          </DialogDescription>
        </DialogHeader>
        <FormField label="Receiving warehouse">
          <WarehouseSelect value={warehouseId} onChange={setWarehouseId} />
        </FormField>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!warehouseId || isLoading}
            onClick={() => {
              onConfirm(warehouseId);
              setWarehouseId("");
            }}
          >
            {isLoading ? "Receiving..." : "Confirm receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
