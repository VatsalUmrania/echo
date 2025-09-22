import { atom } from "jotai";
import { WIDGET_SCREENS } from "@/modules/widget/types";

//Basic Widget state atoms
export const screenAtom = atom<WIDGET_SCREENS>("contact");