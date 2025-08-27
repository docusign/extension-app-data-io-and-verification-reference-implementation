import { Immutable } from "../utils/types";

const paths = {
  Base: "/api",
  ConnectedFields: {
    Base: '/connectedfields',
    Verify: {
      Post: '/verify',
    },
    GetTypeNames: {
      Post: '/getTypeNames',
    },
    GetTypeDefinitions: {
      Post: '/getTypeDefinitions',
    }
  },
  DataIO: {
    Base: '/dataio',
    PatchRecord: {
      Post: '/patchRecord',
    },
    SearchRecords: {
      Post: '/searchRecords',
    },
    CreateRecord: {
      Post: '/createRecord',
    },
    GetTypeNames: {
      Post: '/getTypeNames',
    },
    GetTypeDefinitions: {
      Post: '/getTypeDefinitions',
    }
  },
  Verify: {
    Base: "/verify",
    Email: {
      Post: "/email",
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
