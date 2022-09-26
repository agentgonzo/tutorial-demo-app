import {FlagLink} from "../../components/FlagLink";
import {Step, StepActionLink, StepDescription, StepStrongText, StepSuccessText} from "../../components/step/Step";
import {StepComponent, StepComponentProps} from "../StepTypes";
import {forwardRef, useEffect, useState} from "react";
import {useFeatureFlags} from '../../lib/featureManagement/FeatureFlagsContext'

export const StringFeature: StepComponent = forwardRef<HTMLDivElement, StepComponentProps>(({number, active, current, onSuccessChange}: StepComponentProps, ref) => {

  const {client} = useFeatureFlags()
  const [speed, setSpeed] = useState('normal')
  const success = speed !== 'normal'

  useEffect(() => {
    (async ()=> {
      const s = await client.getStringValue('speed', 'normal')
      console.log(`speed: ${s}`)
      setSpeed(s)
    })()
    onSuccessChange(success)
  }, [success, client]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Step number={number} title="Change the difficulty" active={active || current}>
      <StepDescription>You can adjust the speed of the snake with a feature flag!</StepDescription>
      <StepDescription>
        <StepStrongText>Enable its targeting</StepStrongText> and <StepStrongText>set its value to
        <span className="value-text"> fast</span></StepStrongText>.
      </StepDescription>
      <StepDescription>
        <StepActionLink>
          <FlagLink
            flag={{name: 'speed'}}
            text={(flagName) => (<>Go to {flagName}</>)}
          />
        </StepActionLink>
      </StepDescription>
      {success && (
        <StepSuccessText>
          Congratulations! You've changed the difficulty of the game!
        </StepSuccessText>
      )}
    </Step>
  );
})

StringFeature.displayName = "StringFeature"
