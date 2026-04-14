import * as React from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import { Input } from "./Input";
import { Label } from "./Label";
import type { ProfileCardData, ProfilePaymentFormValue, ProfilePaymentWidgetPayload } from "../types";

const defaultValue: ProfilePaymentFormValue = {
  amount: "",
  currency: "NGN",
  description: "",
  payerEmail: "",
  payerName: "",
  paymentMethod: "card",
};

export interface ProfilePaymentWidgetProps {
  profile: ProfileCardData;
  value?: Partial<ProfilePaymentFormValue>;
  loading?: boolean;
  feeRatePercent?: number;
  onSubmit: (payload: ProfilePaymentWidgetPayload) => void | Promise<void>;
}

export function ProfilePaymentWidget({
  profile,
  value,
  loading = false,
  feeRatePercent = 2.5,
  onSubmit,
}: ProfilePaymentWidgetProps) {
  const [form, setForm] = React.useState<ProfilePaymentFormValue>({ ...defaultValue, ...value });
  const [step, setStep] = React.useState<"form" | "review">("form");

  const setField = <K extends keyof ProfilePaymentFormValue>(field: K, next: ProfilePaymentFormValue[K]) => {
    setForm((current) => ({ ...current, [field]: next }));
  };

  const amountNumber = Number(form.amount || 0);
  const feeAmount = amountNumber * (feeRatePercent / 100);
  const totalAmount = amountNumber + feeAmount;

  const isValid =
    amountNumber > 0 &&
    form.payerName.trim().length > 0 &&
    form.payerEmail.includes("@");

  async function handleSubmit() {
    await onSubmit({
      username: profile.username,
      amount: amountNumber,
      currency: form.currency,
      description: form.description || undefined,
      payerEmail: form.payerEmail,
      payerName: form.payerName,
      paymentMethod: form.paymentMethod,
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Pay @{profile.username}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Embeddable payment form with API-driven submission.</p>
          </div>
          <Badge variant="outline">{profile.trustScore.badge}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {step === "form" ? (
          <>
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={form.currency}
                  onChange={(event) => setField("currency", event.target.value as ProfilePaymentFormValue["currency"])}
                  className="mt-2 flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(event) => setField("amount", event.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="payerName">Your Name</Label>
                <Input
                  id="payerName"
                  value={form.payerName}
                  onChange={(event) => setField("payerName", event.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="payerEmail">Your Email</Label>
                <Input
                  id="payerEmail"
                  type="email"
                  value={form.payerEmail}
                  onChange={(event) => setField("payerEmail", event.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="What is this payment for?"
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={form.paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setField("paymentMethod", "card")}
                >
                  Card / Bank
                </Button>
                <Button
                  type="button"
                  variant={form.paymentMethod === "crypto" ? "default" : "outline"}
                  onClick={() => setField("paymentMethod", "crypto")}
                >
                  Crypto
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              This widget is UI-only. Submission is delegated to your app through `onSubmit`.
            </div>
          </>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <SummaryRow label="Recipient" value={profile.displayName} />
            <SummaryRow label="Username" value={`@${profile.username}`} />
            <SummaryRow label="Amount" value={`${form.currency} ${amountNumber.toLocaleString()}`} />
            <SummaryRow label="Escrow fee" value={`${form.currency} ${feeAmount.toLocaleString()}`} />
            <SummaryRow label="Total" value={`${form.currency} ${totalAmount.toLocaleString()}`} />
            <SummaryRow label="Method" value={form.paymentMethod === "card" ? "Card / Bank" : "Crypto"} />
            {form.description ? <SummaryRow label="Description" value={form.description} /> : null}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        {step === "review" ? (
          <>
            <Button variant="outline" onClick={() => setStep("form")}>
              Edit
            </Button>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </>
        ) : (
          <Button disabled={!isValid} onClick={() => setStep("review")}>
            Review Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

