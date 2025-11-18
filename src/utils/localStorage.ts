import { Model3D, PrintSettings, BedSettings, CostSettings, Filament, Printer } from "@/types/model";

const STORAGE_KEYS = {
  PRINT_SETTINGS: "3d_editor_print_settings",
  BED_SETTINGS: "3d_editor_bed_settings",
  COST_SETTINGS: "3d_editor_cost_settings",
  FILAMENTS: "3d_editor_filaments",
  PRINTERS: "3d_editor_printers",
};

export const savePrintSettings = (settings: PrintSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRINT_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving print settings:", error);
  }
};

export const loadPrintSettings = (): PrintSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRINT_SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading print settings:", error);
    return null;
  }
};

export const saveBedSettings = (settings: BedSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BED_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving bed settings:", error);
  }
};

export const loadBedSettings = (): BedSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BED_SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading bed settings:", error);
    return null;
  }
};

export const saveCostSettings = (settings: CostSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COST_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving cost settings:", error);
  }
};

export const loadCostSettings = (): CostSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COST_SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading cost settings:", error);
    return null;
  }
};

export const saveFilaments = (filaments: Filament[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
  } catch (error) {
    console.error("Error saving filaments:", error);
  }
};

export const loadFilaments = (): Filament[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading filaments:", error);
    return null;
  }
};

export const savePrinters = (printers: Printer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(printers));
  } catch (error) {
    console.error("Error saving printers:", error);
  }
};

export const loadPrinters = (): Printer[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRINTERS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading printers:", error);
    return null;
  }
};
