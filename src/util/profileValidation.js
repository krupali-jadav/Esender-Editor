export const checkProfile = (profile) => {
  if (!profile) return true;

  return (
    !profile.name ||
    !profile.email ||
    !profile.address?.addressLine1 ||
    !profile.address?.city ||
    !profile.address?.state
  );
};

export const checkBasicInfo = (basicInfo) => {
  if (!basicInfo) return true;

  return (
    !basicInfo.businessName ||
    !basicInfo.category ||
    !basicInfo.address ||
    !basicInfo.email ||
    !basicInfo.phone ||
    !basicInfo.description
  );
};