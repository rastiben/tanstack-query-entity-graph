import { QueryClient } from '@tanstack/react-query';
import User from "./user.tsx";
import { useState } from "react";
import { EntityQueryClientProvider } from "./lib/provider.tsx";

const queryClient = new QueryClient();

const entityConfig = {
  Name: { name: 'name', invalidate: ['firstname', 'lastname'] },
};

function App() {
  const [step, setStep] = useState(0);

  return <>
      {step === 0 && (
          <EntityQueryClientProvider entityConfig={entityConfig} client={queryClient}>
            <button onClick={() => setStep(1)}>go to step 1</button>
            <User />
          </EntityQueryClientProvider>
      )}
      {step === 1 && (
          <button onClick={() => setStep(0)}>go to step 0</button>
      )}
  </>;
}

export default App;
