import { ClAvatar } from '@/components/ClAvatar'
import { ClButton } from '@/components/ClButton'
import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { ClWebView } from '@/components/ClWebView'
import { createStyles } from '@/helpers/createStyles'
import { formatDateTime } from '@/helpers/utils'
import { Cl } from '@/lib/options'
import { useFormStore } from '@/stores/forms'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { View } from 'react-native'

export default function CreateJobPreview() {
  const styles = useStyles()
  const createJobFields = useFormStore((state) => state.createJobFields)

  return (
    <ClPageView
      id="job-preview"
      subtitle="This is what tradespeople will see when they view this post."
    >
      <ClCard>
        <ClText weight="bold" type="h6">
          {createJobFields.title}
        </ClText>
        <View style={{ gap: Spacing[1] }}>
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'map-marker',
            }}
            text={String(createJobFields.location)}
          />
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'hammer',
            }}
            text={
              Cl.categories.find(
                (option) => option.value === createJobFields.category
              )!.label
            }
          />
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'briefcase',
            }}
            text={
              Cl.employmentTypes.find(
                (option) => option.value === createJobFields.employmentType
              )!.label
            }
          />
          {/* {createJobFields.rate && (
            <ClIconText
              icon={{
                set: IconSet.MaterialIcon,
                name: 'attach-money',
              }}
              text={
                !createJobFields.isUsingRange
                  ? `${formatMoney(Number(createJobFields.payAmount))} ${createJobFields.rate}`
                  : `${formatMoney(Number(createJobFields.payAmountMin))} - ${formatMoney(Number(createJobFields.payAmountMax))} ${createJobFields.rate}`
              }
            />
          )} */}
        </View>
      </ClCard>
      <ClCard>
        <ClText weight="bold" type="h6">
          Details
        </ClText>
        <ClWebView html={createJobFields.description as string} />
      </ClCard>
      <ClCard>
        <View style={styles.employer}>
          <View style={{ gap: Spacing[4] }}>
            <ClText type="h5">Employer</ClText>
            <View style={{ gap: Spacing[1] }}>
              <ClIconText
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'account',
                }}
                text={'Engr. John M. Doe'}
              />
            </View>
          </View>
          <ClAvatar size="md" />
        </View>
      </ClCard>
      {createJobFields.deadline && (
        <ClCard>
          <ClText type="h5">Application Deadline</ClText>
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'calendar-alert',
            }}
            text={formatDateTime(createJobFields.deadline)}
          />
        </ClCard>
      )}
      <View style={styles.row}>
        <ClButton text="Save" variant="outline" bodyStyle={{ flex: 1 }} />
        <ClButton text="Apply" bodyStyle={{ flex: 1 }} />
      </View>
    </ClPageView>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  employer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    gap: spacing[4],
  },
}))
