import { ServiceProvider, ServicesType } from "./service-provider";
import isCallable from "is-callable";

export type AppContainerType = InstanceType<typeof AppContainer>;
export type AppContainerTypeReadOnly = Readonly<
  InstanceType<typeof AppContainer>
>;

export interface Ctor<C extends { new (...args: any[]): C }> {}

class AppContainer {
  private static instance: AppContainerType;
  private providers: ServiceProvider[];
  private services: ServicesType;
  private singletons: { [key: string]: {} };
  private config: Object;

  public constructor(config: Object, ...serviceProviders: ServiceProvider[]) {
    this.providers = serviceProviders;
    this.config = config;
    this.services = {};
    this.singletons = {};
  }
  public static new(config: Object, ...serviceProviders: ServiceProvider[]) {
    if (AppContainer.instance) {
      return this.instance;
    }
    AppContainer.instance = new AppContainer(config, ...serviceProviders);

    return AppContainer.instance;
  }
  public boot() {
    this.addServices();
    this.initialize();
    return true;
  }
  private addServices() {
    const services: ServicesType = this.providers.reduce((acc, provider) => {
      const instance = Object.freeze(AppContainer.instance);
      const services = provider.services(instance);
      return { ...acc, ...services };
    }, {});

    for (let key in services) {
      AppContainer.instance.services[key] = services[key];
    }
  }
  private initialize(): void {
    this.providers.forEach((serviceProvider: ServiceProvider) => {
      const instance = Object.freeze(AppContainer.instance);
      serviceProvider.init(instance);
    });
  }
  public get<I>(key: string) {
    const fn = AppContainer.instance.services[key];

    return fn() as I;
  }
  public singleton<T extends {}>(ctorClass: { new (): T }) {
    if (this.singletons[ctorClass.name]) {
      return this.singletons[ctorClass.name] as T;
    }
    this.singletons[ctorClass.name] = new ctorClass();
    return this.singletons[ctorClass.name] as T;
  }
  public callOnce<R extends {}>(func: () => R) {
    if (this.singletons[func.name]) {
      return this.singletons[func.name] as R;
    }

    this.singletons[func.name] = func();
    return this.singletons[func.name] as R;
  }
}

export default AppContainer;
