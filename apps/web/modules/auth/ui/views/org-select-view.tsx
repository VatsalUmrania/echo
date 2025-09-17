import { OrganizationList } from "@clerk/nextjs";
import { after } from "node:test";

export const OrgSelectView = () => {
    return(
        <OrganizationList
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            hidePersonal
            skipInvitationScreen
        />
    );
}