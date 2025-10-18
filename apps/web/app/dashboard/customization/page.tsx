import { PremiumFeatureOverLay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { CustomizationView } from "@/modules/customization/ui/views/customization-view";
import { Protect } from "@clerk/nextjs";

const CustomizationPage = () => {
    return(
      <Protect
        condition={(has) => has({plan: "pro"})}
        fallback={
          <PremiumFeatureOverLay>
            <CustomizationView/>
          </PremiumFeatureOverLay>
        }
      >
        <CustomizationView/>
      </Protect>
    );
  }
  
  export default CustomizationPage;