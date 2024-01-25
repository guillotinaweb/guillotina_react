import { IndexSignature } from '../../types/global'

interface Props {
  style?: IndexSignature
}
export const Loading = ({ style = {} }: Props) => (
  <div className="progress-line" style={style}></div>
)
