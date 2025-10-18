import { PremiumFeatureOverLay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { FilesView } from "@/modules/files/ui/views/files-view";
import { Protect } from "@clerk/nextjs";

const FilesPage = () => {
    return(
      <Protect
        condition={(has) => has({plan: "pro"})}
        fallback={
          <PremiumFeatureOverLay>
            <FilesView/>
          </PremiumFeatureOverLay>
        }
      >
        <FilesView/>
      </Protect>
    );
  }
  
export default FilesPage;