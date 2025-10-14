import { atom } from "jotai";
import { atomFamily, atomWithStorage} from "jotai/utils";
import { WIDGET_SCREENS } from "@/modules/widget/types";
import { CONTACT_SESSION_KEY } from "@/modules/widget/constants";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";

//Basic Widget state atoms
export const screenAtom = atom<WIDGET_SCREENS>("loading");
export const organizationIdAtom = atom<string | null>(null)


export const contactSessionIdAtomFamily = atomFamily((organizationId: string) => {
    return atomWithStorage<Id<"contactSessions"> | null>(`${CONTACT_SESSION_KEY}_${organizationId}`, null)
});
  

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null)
export const conversationIdAtom = atom<Id<"conversations"> | null>(null);

export const widgetSettingsAtom = atom<Doc<"widgetSettings"> | null>(null)