import axios from "axios"
import React from "react"
import {
    LineChart,
} from "react-native-chart-kit";
import { useQuery } from "react-query"
import { Text, View } from "../components/Themed"

import { Dimensions, Image, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useFavorites } from "../hooks/useGlobalState";
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const AssetScreen = ({ route }: any) => {
    const { id: assetId, symbol, percentChange, price } = route.params
    const endTime = new Date()
    const startTime = new Date(endTime)
    const colorScheme = useColorScheme()
    startTime.setDate(startTime.getDate() - 1)
    const { favorites, setFavorites } = useFavorites()
    const {
        data,
        isLoading
    } = useQuery(`${assetId}`, async () => {
        const res = await axios.get(`https://data.messari.io/api/v1/assets/${assetId}/metrics/price/time-series`)
        return res.data
    })
    const points = data?.data?.values.filter((_, index: number) => index % 32 === 0)
    const labels = points?.map((point: any) => `${new Date(point[0]).getDate()}/${new Date(point[0]).getMonth()}`)
    const point = points?.map((point: any) => point[1])
    const formattedPercentChange = percentChange > 0 ? `+${percentChange?.toFixed(2)}` : percentChange?.toFixed(2)
    const datas = {
        labels,
        datasets: [
            {
                data: point
            }
        ]
    }

    const isFavorite = favorites.map(fav => fav.id).includes(data?.data?.id)

    const toggleFavorite = () => {
        if (isFavorite) {
            setFavorites(favorites.filter((fav) => fav.id !== data?.data?.id))
        } else {
            setFavorites((favorites) => [...favorites, { id: data?.data?.id, symbol, percentChange, price }])
        }
    }

    if (isLoading) return <Text>Loading...</Text>

    return (
        <View style={styles.container}>
            <Pressable style={styles.infoContainer} onPress={toggleFavorite}>
                <View style={styles.logoContainer}>
                    <FontAwesome
                        name="star"
                        size={25}
                        color={isFavorite ? 'gold' : Colors[colorScheme].text}
                        style={{ marginRight: 15 }}
                    />
                    <Image borderRadius={10} source={{ uri: `https://messari.io/asset-images/${data.data.id}/32.png` }} style={styles.logo} />
                    <View style={styles.coinInfo}>
                        <Text style={styles.symbol}>{symbol}</Text>
                        <Text>${price}</Text>
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <Text style={{ color: percentChange > 0 ? 'green' : 'red' }}>{formattedPercentChange}%</Text>
                </View>
            </Pressable>
            <LineChart
                data={datas}
                chartConfig={chartConfig}
                width={screenWidth - 20}
                height={220}
                style={{ marginLeft: 10 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    logo: {
        width: 30,
        height: 30
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    coinInfo: {
        marginLeft: 10
    },
    symbol: {
        fontSize: 20
    },
    loadingText: {
        textAlign: 'center'
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default AssetScreen