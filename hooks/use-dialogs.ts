import { create } from "zustand";

interface DialogState {
  aboutOpen: boolean;
  helpOpen: boolean;
  setAboutOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
  openAbout: () => void;
  closeAbout: () => void;
  openHelp: () => void;
  closeHelp: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  aboutOpen: false,
  helpOpen: false,
  setAboutOpen: (open: boolean) => set({ aboutOpen: open }),
  setHelpOpen: (open: boolean) => set({ helpOpen: open }),
  openAbout: () => set({ aboutOpen: true }),
  closeAbout: () => set({ aboutOpen: false }),
  openHelp: () => set({ helpOpen: true }),
  closeHelp: () => set({ helpOpen: false }),
}));
