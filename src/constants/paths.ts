import { Immutable } from "../utils/types";

const paths = {
  Base: "/api",
  Archive: {
    Base: "/",
    File: {
      Post: "/archive",
    },
  },
  Verify: {
    Base: "/verify",
    BankAccountOwner: {
      Post: "/bankAccountOwner",
    },
    BankAccount: {
      Post: "/bankAccount",
    },
    Email: {
      Post: "/email",
    },
    BusinessFEIN: {
      Post: "/businessFEIN",
    },
    PhoneNumber: {
      Post: "/phone",
    },
    SSN: {
      Post: "/ssn",
    },
    PostalAddress: {
      Post: "/postalAddress",
    },
    TypeaheadAddress: {
      Post: "/typeaheadAddress",
    },
  },
  Auth: {
    Base: "/oauth",
    Authorize: {
      Get: "/authorize",
    },
    Token: {
      Post: "/token",
    },
    UserInfo: {
      Get: "/userinfo",
    },
  },
};

export type TPaths = Immutable<typeof paths>;
export default paths as TPaths;
