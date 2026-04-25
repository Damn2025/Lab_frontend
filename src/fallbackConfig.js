const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Meghalaya",
  "Mizoram",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const labTypeOptions = [
  "Biological",
  "Chemical",
  "Electrical",
  "Electronics",
  "Forensic",
  "Mechanical",
  "Non-destructive",
  "Photometry",
  "Radiological"
];

export const fallbackConfig = {
  label: "All Labs",
  description:
    "Searches biological and chemical lab sources together while lab type works as a filter.",
  columns: [
    "Sr. No",
    "Lab Name",
    "State",
    "Discipline Name", // Added Discipline Name
    "Group Name", // Added Group Name
    "Details" // Placeholder for the icon column
  ],
  labTypeOptions,
  filterFields: {
    state: {
      label: "State",
      type: "dropdown",
      options: stateOptions
    },
    labName: {
      label: "Lab Name",
      type: "text"
    },
    product: {
      label: "Product",
      type: "text"
    }
  },
  defaultLimit: 10,
  defaultSort: {
    column: "Lab Name",
    ascending: true
  }
};
