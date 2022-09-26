import {createContext, ReactNode, useCallback, useContext, useEffect, useState,} from "react";
import types, {OpenFeature} from "@openfeature/js-sdk";
import {CloudbeesProvider} from 'cloudbees-openfeature-provider-browser'
import {missingRequiredQueryParameters, QueryParams} from '../../configuration/QueryParams'
import Rox from 'rox-browser'
import { SDK_MS_TO_FIRST_FETCH } from "../../configuration/Envs";

type ContextState = {
  client: types.Client
  lastUpdated: number
};

const initialState = {
  client: undefined as unknown as types.Client,
  lastUpdated: Date.now(),
};

const FeatureFlagsContext = createContext<ContextState | undefined>(undefined);

export const FeatureFlagsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState(initialState);

  const roxSetup = useCallback(async () => {
    try {
      console.log("Initializing SDK")
      // await Rox.setup(QueryParams.environment_id, {
      //   debugLevel: QueryParams.debug_sdk ? 'verbose' : undefined,
      //   configurationFetchedHandler: (fetcherResult: RoxFetcherResult) => {
      //     if(fetcherResult.hasChanges) {
      //       console.log('Pushing change')
      //       setState({client, lastUpdated: Date.now()})
      //     }
      //     console.log('Update from UI')
      //   },
      // });

      OpenFeature.setProvider(await CloudbeesProvider.build(QueryParams.environment_id))
      console.log("Rox was initialized")
      const client = OpenFeature.getClient()
      setState({client, lastUpdated: Date.now()})
      setTimeout(async ()=> {
        //When the environment has never been initialized before, because some edge conditions, SSE may not be started properly
        //Forcing the fetch makes sure it will be
        Rox.fetch()
      }, SDK_MS_TO_FIRST_FETCH)
    } catch (err) {
      console.error("Rox initialization failed", err)
    }
  }, []);

  useEffect(() => {
    if(!missingRequiredQueryParameters()) {
      roxSetup();
    }
  }, [roxSetup]);

  return (
    <FeatureFlagsContext.Provider value={state}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export function useFeatureFlags() {
    const state = useContext(FeatureFlagsContext)
    if(!state) throw new Error("useFeatureFlags can only be used inside a FeatureFlagsContextProvider")

    return state
}
