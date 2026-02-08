function getCurrentYear(): number {
  const currentYear = new Date().getFullYear();
  return currentYear;
}

export class EditingMedicalDeviceValues {
  medicalDeviceId: number = 0
  productionYear: number = getCurrentYear()
  manufacturerId: number = 0
  medicalDeviceTypeId: number = 0
}
