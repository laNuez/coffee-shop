import { PropsWithChildren } from 'react'
import { Header } from './Header'

const DefaultLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Header />
      <div>{props.children}</div>
    </>
  )
}

export default DefaultLayout
