"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/forms/form-field";
import { CreateRequestValues, createRequestSchema } from "../schema";
import { ItemsSection } from "./items-section";
import { useCreateRequest } from "../../actions/create-request";
import { useUser } from "@/api/fetch-user";
import { DatePicker } from "@/components/date-picker";
import { 
  COST_CENTER_OPTIONS, 
  CHARGE_TO_OPTIONS, 
  MANAGEMENT_NUMBER_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PURCHASE_TYPE_OPTIONS,
  CURRENCY_OPTIONS
} from "../../data/options";

import { Paperclip, X, FileIcon, UploadCloud } from "lucide-react";

export function CreateRequestForm() {
  const { user } = useUser();
  const { trigger, isMutating } = useCreateRequest();

  const form = useForm<CreateRequestValues>({
    resolver: zodResolver(createRequestSchema) as any,
    defaultValues: {
      desired_delivery_date: new Date(),
      transaction_type: "Vendor Payment",
      payment_method: "Cash",
      purchase_type: "Purchase of Goods",
      cost_center: "N/A",
      currency: "PHP",
      vendor: "",
      payee: "",
      charge_to: "N/A",
      management_number: "N/A",
      attachments: [],
      items: [
        {
          item_title: "",
          quantity: 1,
          unit_price: 0,
          item_name: "",
          item_purpose: "",
          item_remarks: "",
          budget_code: "",
        },
      ],
    },
  });

  const attachments = form.watch("attachments");

  async function onSubmit(values: any) {
    const formData = new FormData();
    
    // Append top-level fields
    formData.append("user_id", String(user?.user?.id || ""));
    
    if (values.desired_delivery_date) {
      formData.append("desired_delivery_date", values.desired_delivery_date.toISOString().split('T')[0]);
    }
    
    formData.append("transaction_type", values.transaction_type);
    formData.append("payment_method", values.payment_method);
    formData.append("purchase_type", values.purchase_type);
    formData.append("cost_center", values.cost_center);
    formData.append("currency", values.currency);
    formData.append("vendor", values.vendor);
    formData.append("payee", values.payee);
    formData.append("charge_to", values.charge_to);
    formData.append("management_number", values.management_number);

    // Append items as JSON string (standard approach for nested data in multipart)
    formData.append("items", JSON.stringify(values.items));

    // Append files
    if (values.attachments && values.attachments.length > 0) {
      values.attachments.forEach((file: File) => {
        formData.append("attachments[]", file);
      });
    }

    await trigger(formData);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentAttachments = form.getValues("attachments") || [];
    const newFiles = Array.from(files);
    
    form.setValue("attachments", [...currentAttachments, ...newFiles], { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  const removeAttachment = (index: number) => {
    const currentAttachments = form.getValues("attachments");
    form.setValue("attachments", currentAttachments.filter((_, i) => i !== index), {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-8 pb-32">
        <div className="space-y-8">
          {/* Main Content Area */}
          <Card className="shadow-sm border-none bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Procurement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DatePicker 
                  control={form.control} 
                  name="desired_delivery_date" 
                  label="Desired Delivery Date"
                  placeholder="When is this needed?"
                />
                <Field
                  control={form.control}
                  name="transaction_type"
                  label="Transaction Type"
                  variant="select_by_name"
                  selectOptions={TRANSACTION_TYPE_OPTIONS}
                />
                <Field
                  control={form.control}
                  name="payment_method"
                  label="Payment Method"
                  variant="select_by_name"
                  selectOptions={PAYMENT_METHOD_OPTIONS}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Field
                  control={form.control}
                  name="purchase_type"
                  label="Purchase Type"
                  variant="select_by_name"
                  selectOptions={PURCHASE_TYPE_OPTIONS}
                />
                <Field
                  control={form.control}
                  name="currency"
                  label="Currency"
                  variant="select_by_name"
                  selectOptions={CURRENCY_OPTIONS}
                />
                <Field
                  control={form.control}
                  name="vendor"
                  label="Vendor"
                  variant="input"
                />
                <Field
                  control={form.control}
                  name="payee"
                  label="Payee / Recipient"
                  variant="input"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Accounting Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  control={form.control}
                  name="cost_center"
                  label="Cost Center"
                  variant="select_by_name"
                  selectOptions={COST_CENTER_OPTIONS}
                />
                <Field
                  control={form.control}
                  name="charge_to"
                  label="Charge To"
                  variant="select_by_name"
                  selectOptions={CHARGE_TO_OPTIONS}
                />
                <Field
                  control={form.control}
                  name="management_number"
                  label="Management No."
                  variant="select_by_name"
                  selectOptions={MANAGEMENT_NUMBER_OPTIONS}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsSection />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Attachments</CardTitle>
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="file-upload"
                />
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-primary/50 transition-colors bg-muted/5">
                  <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">Click or drag files</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Excel, Images up to 10MB</p>
                  </div>
                </div>
              </div>

              {attachments && attachments.length > 0 && (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {attachments.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border shadow-sm group animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-2 bg-muted rounded">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold truncate pr-2">{file.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-[var(--sidebar-width,0px)] bg-background/80 backdrop-blur-xl border-t z-50 px-6 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="h-10 px-8 hover:bg-muted font-medium transition-colors border-muted-foreground/20" 
              onClick={() => window.history.back()}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="min-w-[180px] h-10 text-sm font-bold shadow-md hover:shadow-lg transition-all" 
              disabled={isMutating}
            >
              {isMutating ? "Processing..." : "Create Request"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
