import {useState} from 'react'
import {useEffect} from 'react'
import {Config} from '../models/config'

export function useConfig(cfg) {
  const [config, setState] = useState(Config)

  useEffect(() => {
    const addConfig = (additional) => {
      const rest = Object.assign({}, Config)
      Object.keys(additional).forEach(item => {
        if (typeof Config[item] === "object" && Array.isArray(Config[item])) {
          rest[item] = [].concat(Config[item], additional[item])
        } else if (typeof Config[item] === "object") {
          rest[item] = Object.assign({}, Config[item], additional[item])
        } else {
          rest[item] = additional[item]
        }
      })
      setState(rest)
    }

    if (cfg) {
      addConfig(cfg)
    }
  }, [])

  return {
    ...config,
  }


}
