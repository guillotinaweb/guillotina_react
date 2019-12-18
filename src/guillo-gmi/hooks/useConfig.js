import {Config} from '../models/config'

let calculated = Object.assign({}, Config)

const addConfig = (additional, original) => {
  const rest = Object.assign({}, original)
  Object.keys(additional).forEach(item => {
    if (typeof Config[item] === "object" && Array.isArray(Config[item])) {
      rest[item] = [].concat(Config[item], additional[item])
    } else if (typeof Config[item] === "object") {
      rest[item] = Object.assign({}, Config[item], additional[item])
    } else {
      rest[item] = additional[item]
    }
  })
  return rest
}


export function useConfig(cfg) {

  if (cfg) {
    calculated = addConfig(cfg)
  }

  return calculated

}


// export function useConfig(cfg) {
//   const [config, setState] = useState(Config)

//   useEffect(() => {
//     const addConfig = (additional) => {
//       const rest = Object.assign({}, Config)
//       Object.keys(additional).forEach(item => {
//         if (typeof Config[item] === "object" && Array.isArray(Config[item])) {
//           rest[item] = [].concat(Config[item], additional[item])
//         } else if (typeof Config[item] === "object") {
//           rest[item] = Object.assign({}, Config[item], additional[item])
//         } else {
//           rest[item] = additional[item]
//         }
//       })
//       setState(rest)
//     }

//     if (cfg) {
//       addConfig(cfg)
//     }
//   }, [])

//   return {
//     ...config,
//   }


// }

