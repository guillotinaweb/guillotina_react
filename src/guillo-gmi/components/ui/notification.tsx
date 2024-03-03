interface Props {
  isColor?: string
  children: React.ReactNode
}
export function Notification({ isColor = '', children }: Props) {
  return (
    <div className={'notification is-' + isColor} data-test="notificationTest">
      {children}
    </div>
  )
}
