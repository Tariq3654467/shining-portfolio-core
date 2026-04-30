import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Check, Building2 } from "lucide-react";

interface BankTransferCheckoutProps {
  plan: "silver" | "gold" | "platinum";
}

const BankTransferCheckout = ({ plan }: BankTransferCheckoutProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    bankName: "Nepal Bank Limited",
    accountName: "BiheNepal Matrimony Pvt. Ltd.",
    accountNumber: "1234567890",
    swiftCode: "NBLTNTKA",
    branch: "Kathmandu Branch",
    amount: plan === "silver" ? "Rs 500" : plan === "gold" ? "Rs 1000" : "Rs 2000",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitiate = () => {
    if (!user) {
      toast.error("Please log in to make a bank transfer");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleInitiate}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <Building2 className="h-4 w-4 mr-2" />
        Bank Transfer
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Transfer Details</DialogTitle>
            <DialogDescription>
              Transfer {bankDetails.amount} to the account below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              Please include your email as reference so we can verify your payment
            </div>

            <div className="space-y-3">
              {[
                { label: "Bank Name", value: bankDetails.bankName },
                { label: "Account Name", value: bankDetails.accountName },
                { label: "Account Number", value: bankDetails.accountNumber },
                { label: "SWIFT Code", value: bankDetails.swiftCode },
                { label: "Branch", value: bankDetails.branch },
              ].map((item) => (
                <div key={item.label} className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{item.value}</p>
                    <button
                      onClick={() => handleCopy(item.value)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">Next Steps:</p>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Transfer the amount to the account above</li>
                <li>2. Email your payment proof to support@bihe.com</li>
                <li>3. We'll verify and activate your plan</li>
              </ol>
            </div>

            <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
              I've Made the Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BankTransferCheckout;
