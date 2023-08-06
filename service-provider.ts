import { AppContainerTypeReadOnly } from "./app-container";

export type ServicesType = { [key: string]: () => {} };
export interface ServiceProvider {
  /**
   * services
   */
  services: (container: AppContainerTypeReadOnly) => ServicesType;
  init: (container: AppContainerTypeReadOnly) => Promise<boolean>;
}
