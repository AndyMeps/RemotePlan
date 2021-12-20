import * as React from 'react';
import { HubConnection } from '@microsoft/signalr';

const SignalRContext = React.createContext<{
  connection: HubConnection | null;
}>({ connection: null });

export default SignalRContext;
