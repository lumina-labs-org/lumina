export type Organization = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

export type OrganizationResponse = {
  organization: Organization;
};
