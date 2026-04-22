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
    "Address",
    "State",
    "Phone Number",
    "Email"
  ],
  labTypeOptions,
  filterFields: {
    state: {
      label: "State",
      type: "dropdown",
      options: stateOptions
    },
    city: {
      label: "City",
      type: "text"
    },
    labName: {
      label: "Lab Name",
      type: "text"
    },
    product: {
      label: "Product",
      type: "text"
    },
    test: {
      label: "Test",
      type: "text"
    },
    testMethod: {
      label: "Method",
      type: "text"
    }
  },
  defaultLimit: 5,
  defaultSort: {
    column: "Lab Name",
    ascending: true
  }
};
