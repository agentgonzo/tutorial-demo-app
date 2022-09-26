import {Disabled} from "./Disabled";
import {Snake} from "./snake/Snake";
import {OpenFeature} from '@openfeature/js-sdk'
import {useEffect, useState} from 'react'
import {useFeatureFlags} from '../lib/featureManagement/FeatureFlagsContext'

export function DemoApplication() {
  const {client, lastUpdated} = useFeatureFlags()
  const [disabled, setDisabled] = useState(false)
  const [speed, setSpeed] = useState('normal')

  useEffect(() => {
    (async () => {
      const d = !await OpenFeature.getClient().getBooleanValue('snakeGame.release', false);
      setDisabled(d)
      const s = await OpenFeature.getClient().getStringValue('snakeGame.speed', 'normal');
      setSpeed(s)
      console.log(`disabled: ${d}; speed: ${s}`)
    })()
  }, [client, lastUpdated])

  return (
    <div
      className={`demoApplication-wrapper ${disabled ? "is-disabled" : ""}`}
    >
      {disabled ? <Disabled/> : <Snake speed={speed as any}/>}
    </div>
  );
}
