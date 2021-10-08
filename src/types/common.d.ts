interface IRoute {
  path?: string;
  component?: Promise | (() => any);
  wrappers?: string[];
  redirect?: string;
  icon?: Promise | (() => any);
  exact?: boolean;
  routes?: Route[];
  name?: string;
  [k: string]: any;
}

interface ILogRaw {
  data: string;
  topics: string[];
}

interface ILogEvent {
  address: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  id: string;
  returnValues: string;
  signature: string;
  raw: Raw;
}