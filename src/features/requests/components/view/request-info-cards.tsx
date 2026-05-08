import { Package, CreditCard, FileText, Building2, User, Hash, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DetailItem } from "@/components/ui/detail-item";
import { PurchaseRequest } from "@/types/request";

interface RequestCardProps {
  request: PurchaseRequest;
}

export function ProcurementDetails({ request }: RequestCardProps) {
  return (
    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Procurement Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <DetailItem
            label="Transaction Type"
            value={request.transaction_type}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <DetailItem
            label="Payment Method"
            value={request.payment_method}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <DetailItem
            label="Purchase Type"
            value={request.purchase_type}
            icon={<FileText className="h-4 w-4" />}
          />
          <DetailItem
            label="Currency"
            value={request.currency}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <DetailItem
            label="Vendor"
            value={request.vendor}
            icon={<Building2 className="h-4 w-4" />}
          />
          <DetailItem
            label="Payee / Recipient"
            value={request.payee}
            icon={<User className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function AccountingReference({ request }: RequestCardProps) {
  return (
    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Accounting Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DetailItem
            label="Cost Center"
            value={request.cost_center}
            icon={<MapPin className="h-4 w-4" />}
          />
          <DetailItem
            label="Charge To"
            value={request.charge_to}
            icon={<MapPin className="h-4 w-4" />}
          />
          <DetailItem
            label="Management No."
            value={request.management_number}
            icon={<Hash className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
