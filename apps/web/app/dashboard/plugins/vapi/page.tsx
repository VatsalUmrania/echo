import { PremiumFeatureOverLay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { VapiView } from "@/modules/plugins/ui/vapi-view";
import { Protect } from "@clerk/nextjs";

const Page = () => {
    return(
      <Protect
        condition={(has) => has({plan: "pro"})}
        fallback={
          <PremiumFeatureOverLay>
            <VapiView/>
          </PremiumFeatureOverLay>
        }
      >
        <VapiView/>
      </Protect>
    );
  }
  
  export default Page;