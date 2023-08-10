# Nodejs-modularity
A simple library to make NodeJS applications modular

# Usage
```
import AppContainer from "../app-container";
import { EventsServiceProvider } from "./src/events-manager/events-service-provider";
import { RouterServiceProvider } from "./src/router/RouterServicerProvider";
import { ServerServiceProvider } from "./src/server/ServerServiceProvider";

async function App() {
  try {
    await AppContainer.new(
      {}, // Config variables goes here
      new RouterServiceProvider(),
      new ServerServiceProvider(),
      new EventsServiceProvider()
    ).boot();
  } catch (error) {
    console.log(error);
  }
}

App();

```
