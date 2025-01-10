import { useState } from 'react'
import { type Route, TabView, type TabViewProps } from 'react-native-tab-view'

interface ClTabViewProps<R extends Route> {
  routes: R[]
  renderScene: TabViewProps<R>['renderScene']
}

export function ClTabView<R extends Route>(props: ClTabViewProps<R>) {
  const { routes, renderScene } = props
  const [index, setIndex] = useState(0)

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  )
}
