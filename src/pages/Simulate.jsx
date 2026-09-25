import { useEffect } from "react";
import { CartStep } from "@/components/checkout/Cart";
import { DetailsStep } from "@/components/checkout/Details";
import { MethodStep } from "@/components/checkout/Method";
import { ProcessingView } from "@/components/checkout/Processing";
import { ReceiptView } from "@/components/checkout/Receipt";
import { StepRail } from "@/components/checkout/Steps";
import { cartTotal } from "@/lib/payments/catalog";
import { useLab } from "@/lib/store";
export function SimulatePage() {
  const step = useLab((state) => state.step);
  const go = useLab((state) => state.go);
  const items = useLab((state) => state.items);
  const total = cartTotal(items);
  useEffect(() => {
    if (total === 0 && (step === "method" || step === "details" || step === "processing")) {
      go("cart");
    }
  }, [go, step, total]);
  return (
    <div>
      {step !== "receipt" && step !== "processing" ? <StepRail step={step} onJump={go} /> : null}
      <div className="mt-10">
        {step === "cart" || ((step === "method" || step === "details") && total === 0) ? (
          <CartStep />
        ) : null}
        {step === "method" && total > 0 ? <MethodStep /> : null}
        {step === "details" && total > 0 ? <DetailsStep /> : null}
        {step === "receipt" ? <ReceiptView /> : null}
      </div>
      {step === "processing" && total > 0 ? <ProcessingView /> : null}
    </div>
  );
}
