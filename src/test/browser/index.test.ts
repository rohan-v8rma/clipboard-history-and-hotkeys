import {
  EXTENSION_TYPE_MAP,
  ExtensionType
} from "../../constants";

import testSuiteGenerator from "../testSuiteGenerator";

testSuiteGenerator(EXTENSION_TYPE_MAP.browser as ExtensionType);