import { MemoryStorage } from '@tonkeeper/core/dist/Storage';
import { Message } from './message';

const func = async () => {
  const message: Message = { id: '1' };
  const response = await (window as any).versions.ping(message);
  console.log(response);
};

func();

export const DesktopStorage = MemoryStorage;

// const fs = (electron as any).remote.require('fs');
// const path = (electron as any).remote.require('path');
// const util = (electron as any).remote.require('util');

// export class DesktopStorage implements IStorage {
//   configPath = path.join(electron.app.getAppPath(), 'config.json');

//   readFileAsync = util.promisify(fs.readFile);
//   writeFileAsync = util.promisify(fs.writeFile);

//   getConfig = async (): Promise<Record<string, unknown>> => {
//     console.log(this.configPath);
//     if (!fs.existsSync(this.configPath)) {
//       return {};
//     } else {
//       const rawdata = await this.readFileAsync(this.configPath);
//       return JSON.parse(rawdata.toString('utf8'));
//     }
//   };

//   setConfig = async (config: Record<string, unknown>) => {
//     await this.writeFileAsync(this.configPath, JSON.stringify(config));
//   };

//   get = async <R>(key: string) => {
//     const config = await this.getConfig();
//     return (config[key] as R) ?? null;
//   };

//   set = async <R>(key: string, payload: R) => {
//     const config = await this.getConfig();
//     config[key] = payload;
//     await this.setConfig(config);
//     return payload;
//   };

//   setBatch = async <V extends Record<string, unknown>>(values: V) => {
//     const config = await this.getConfig();
//     Object.assign(config, values);
//     await this.setConfig(config);
//     return values;
//   };

//   delete = async <R>(key: string) => {
//     const config = await this.getConfig();
//     const value = config[key] as R | undefined;
//     if (value) {
//       delete config[key];
//     }
//     await this.setConfig(config);
//     return value ?? null;
//   };
// }
