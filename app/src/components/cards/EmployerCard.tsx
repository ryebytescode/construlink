// import { ClAvatar } from '@/components/ClAvatar'
// import { ClCard } from '@/components/ClCard'
// import { ClIconText } from '@/components/ClIconText'
// import { ClText } from '@/components/ClText'
// import { createStyles } from '@/helpers/createStyles'
// import { joinNames } from '@/helpers/stringUtils'
// import { getDp, getUserDetails } from '@/services/account'
// import { getCompanyDetails } from '@/services/company'
// import { Spacing } from '@/theme'
// import { IconSet } from '@/types/Icons'
// import type { CompanySchema, JobSchema, UserSchema } from '@/types/Schemas'
// import React, { useEffect, useState } from 'react'
// import { View } from 'react-native'
// import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

// export function EmployerCard({ jobDetails }: { jobDetails: JobSchema }) {
//     const styles = useStyles()
//     const [author, setAuthor] = useState<UserSchema>()
//     const [company, setCompany] = useState<CompanySchema>()
//     const [profileUrl, setProfileUrl] = useState<string | null>(null)

//     useEffect(() => {
//         (async () => {
//             const result = await getDp(jobDetails.authorId, {
//                 width: 128, height: 128
//             })

//             setProfileUrl(result)
//         })()

//         if (jobDetails.postAs === 'company') {
//             getCompanyDetails(jobDetails.authorId).then((company) => {
//                 if (company) setCompany(company)
//             })
//         } else {
//             getUserDetails(jobDetails.authorId).then((user) => {
//                 if (user) setAuthor(user as UserSchema)
//             })
//         }
//     }, [])

//     if (jobDetails.postAs === 'company') {
//         return company ? (
//             <Animated.View entering={FadeIn} exiting={FadeOut}>
//                 <ClCard>
//                     <View style={styles.employer}>
//                         <View style={{ gap: Spacing[4], flexGrow: 1 }}>
//                             <ClText type="h5">Employer</ClText>
//                             <View style={{ gap: Spacing[1] }}>
//                                 <ClIconText
//                                     icon={{
//                                         set: IconSet.MaterialCommunityIcons,
//                                         name: 'office-building',
//                                     }}
//                                     text={company.name}
//                                 />
//                                 <ClIconText
//                                     icon={{
//                                         set: IconSet.MaterialCommunityIcons,
//                                         name: 'map-marker',
//                                     }}
//                                     text={company.location}
//                                 />
//                             </View>
//                         </View>
//                         <ClAvatar size="md" source={profileUrl} />
//                     </View>
//                 </ClCard>
//             </Animated.View>
//         ) : null
//     }

//     return author ? (
//         <Animated.View entering={FadeIn} exiting={FadeOut}>
//             <ClCard>
//                 <View style={styles.employer}>
//                     <View style={{ gap: Spacing[4], flexGrow: 1 }}>
//                         <ClText type="h5">Employer</ClText>
//                         <View style={{ gap: Spacing[1] }}>
//                             <ClIconText
//                                 icon={{
//                                     set: IconSet.MaterialCommunityIcons,
//                                     name: 'account',
//                                 }}
//                                 text={joinNames(author!.firstName, author!.lastName)}
//                             />
//                             <ClIconText
//                                 icon={{
//                                     set: IconSet.MaterialCommunityIcons,
//                                     name: 'map-marker',
//                                 }}
//                                 text={author!.address}
//                             />
//                         </View>
//                     </View>
//                     <ClAvatar size="md" source={profileUrl} />
//                 </View>
//             </ClCard>
//         </Animated.View>
//     ) : null
// }

// const useStyles = createStyles(() => ({
//     employer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     }
// }))
