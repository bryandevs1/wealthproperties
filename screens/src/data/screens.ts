export type Data = {
    id: number
    image: any
    title: string
    text: string
}

export const data: Data[] = [
    {
        id: 1,
        image: require('../assets/pic2.png'),
        title: 'Explore Multiple Houses at Your Fingertips',
        text: 'Our app offers you the freedom to explore and compare multiple houses all in one place.',
    },
    {
        id: 2,
        image: require('../assets/pic3.png'),
        title: 'Sell Your House with maximum Confidence',
        text: 'Take control of your property journey by listing your house directly on our app. Reach a wide audience of potential buyers',
    },
    {
        id: 3,
        image: require('../assets/pic4.png'),
        title: 'Rent or Buy a House Today, Your Way',
        text: 'Whether you are looking to rent a cozy space or invest in your dream home, our app is your trusted partner.',
    },
]
//         {
//             image: images.onb1, // Replace with your image paths
//             title: 'Explore Multiple Houses at Your Fingertips',
//             description:
//                 'Our app offers you the freedom to explore and compare multiple houses all in one place.',
//         },
//         {
//             image: images.onb2,
//             title: 'Sell Your House with maximum Confidence',
//             description:
//                 'Take control of your property journey by listing your house directly on our app. Reach a wide audience of potential buyers',
//         },
//         {
//             image: images.onb3,
//             title: 'Rent or Buy a House Today, Your Way',
//             description:
//                 "Whether you're looking to rent a cozy space or invest in your dream home, our app is your trusted partner.",
//         },
