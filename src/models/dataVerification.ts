// type SpecifiedFile = {
//   name: string;
//   content: string;
//   contentType: 'bytes' | 'url';
//   path: string;
//   pathTemplateValues?: string[];
// };

export interface EmailBody {
  email: string;
}

export interface EmailResponse {
  verified: boolean;
  verifyFailureReason?: string;
}
