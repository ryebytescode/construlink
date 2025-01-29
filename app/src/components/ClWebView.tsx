import { createHTML } from '@/helpers/createHTML'
import { createStyles } from '@/helpers/createStyles'
import { Styled } from '@/theme'
import { useState } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'
import { ClText } from './ClText'

interface ClWebViewProps {
  html: string
  dim?: boolean
}

export function ClWebView(props: ClWebViewProps) {
  const { html, dim = false } = props
  const styles = useStyles({ dim })
  const [webViewHeight, setWebViewHeight] = useState(0)
  const webViewScript = `
        setTimeout(() => {
            window.ReactNativeWebView.postMessage(document.body.clientHeight)
        }, 500)
    `

  return (
    <View pointerEvents="none" style={{ height: webViewHeight }}>
      <WebView
        originWhitelist={['*']}
        source={{
          html: createHTML({
            preStyles: Styled.RichTextInput.initialCSSText,
            bodyStyles: Styled.RichTextInput.contentCSSText,
            body: html,
            backgroundColor: 'transparent',
            textColor: styles.webviewContainer.color,
          }),
        }}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={false}
        style={{
          backgroundColor: 'transparent',
          height: webViewHeight,
        }}
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        bounces={false}
        startInLoadingState={true}
        renderLoading={() => <ClText type="helper">Loading contents...</ClText>}
        injectedJavaScript={webViewScript}
        onMessage={(event) => setWebViewHeight(Number(event.nativeEvent.data))}
      />
    </View>
  )
}

const useStyles = createStyles(({ colors }, { dim }: { dim: boolean }) => ({
  webviewContainer: {
    color: dim ? colors.secondaryText : colors.primaryText,
    backgroundColor: colors.background,
  },
}))
