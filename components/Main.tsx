import React, { useEffect, useState } from 'react';
import {
    Text, StyleSheet, View, Image, ScrollView,
    TextInput, TouchableOpacity, ActivityIndicator
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


export default function Main() {
    const [city, setCity] = useState('Gwalior');
    const [search, setSearch] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateDescription = (temp, condition) => {
        let desc = '';

        // Temperature part
        if (temp <= 5) {
            desc += 'Very cold. ';
        } else if (temp <= 15) {
            desc += 'Cool weather. ';
        } else if (temp <= 25) {
            desc += 'Mild and pleasant. ';
        } else if (temp <= 35) {
            desc += 'Warm and sunny. ';
        } else {
            desc += 'Extremely hot. ';
        }

        // Condition part
        if (condition.includes('Rain')) {
            desc += 'Rain is expected, carry an umbrella!';
        } else if (condition.includes('Cloud')) {
            desc += 'Mostly cloudy skies today.';
        } else if (condition.includes('Sunny') || condition.includes('Clear')) {
            desc += 'Clear skies with plenty of sunshine.';
        } else if (condition.includes('Snow')) {
            desc += 'Snowfall is expected. Stay warm!';
        } else {
            desc += 'No major weather events expected.';
        }

        return desc;
    };


    const fetchWeather = async (cityName) => {
        try {
            setLoading(true);
            const res = await fetch(
                `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5&aqi=no&alerts=no`
            );
            const data = await res.json();

            if (data.error) throw new Error(data.error.message);
            setWeather(data.current);
            setForecast(data.forecast.forecastday);
            setCity(data.location.name);
        } catch (err) {
            console.warn("Weather fetch failed:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    const weatherInfoIcons = [
        {
            icon: <FontAwesome name="thermometer-three-quarters" color="#fff" size={24} />,
            label: 'Temperature',
            value: weather?.temp_c + '°C',
        },
        {
            icon: <Feather name="droplet" color="#fff" size={24} />,
            label: 'Humidity',
            value: weather?.humidity + '%',
        },
        {
            icon: <FontAwesome name="rocket" color="#fff" size={24} />,
            label: 'Wind Speed',
            value: weather?.wind_kph + ' km/h',
        },
        {
            icon: <Feather name="eye" color="#fff" size={24} />,
            label: 'Visibility',
            value: weather?.vis_km + ' km',
        },
    ];

    const handleSearch = () => {
        if (search.trim()) {
            fetchWeather(search.trim());
            setSearch('');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Search + City */}
            <View style={styles.headerRow}>
                <View style={styles.row}>
                    <Image source={require('./assets/location.png')} style={styles.locationImage} />
                    <Text style={styles.text}>{city}</Text>
                    {/* <Text style={styles.text}>{weather.country}</Text> */}
                </View>
                <View style={styles.row}>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search city"
                        placeholderTextColor="#ccc"
                        style={styles.searchInput}
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Image source={require('./assets/search.png')} style={styles.searchIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            ) : (
                <>
                    {/* Current Weather */}
                    {weather && (
                        <>
                            <View style={styles.weatherMain}>
                                <View>
                                    <Text style={styles.tempText}>{weather.temp_c}°C</Text>
                                    <Text style={styles.rangeText}>Feels like: {weather.feelslike_c}°C</Text>
                                </View>
                                <View>
                                    <Image source={{ uri: 'https:' + weather.condition.icon }} style={styles.weatherIcon} />
                                    <Text style={styles.cloudText}>{weather.condition.text}</Text>
                                </View>
                            </View>
                            <Text style={styles.description}>
                                {weather ? generateDescription(weather.temp_c, weather.condition.text) : ''}
                            </Text>


                            {/* Current Details */}
                            <View style={styles.firstBox}>
                                {weatherInfoIcons.map((item, index) => (
                                    <View key={index} style={styles.infoItem}>
                                        {item.icon}
                                        <View style={styles.infoText}>
                                            <Text style={styles.infoLabel}>{item.label}</Text>
                                            <Text style={styles.infoSub}>{item.value}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {/* 5-Day Forecast */}
                    <Text style={{ color: "white", marginTop: 20, marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
                        5-Days Forecast
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
                            {forecast.map((day, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 70,
                                        height: 170,
                                        borderWidth: 1,
                                        marginHorizontal: 6,
                                        padding: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 50,
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                    }}
                                >
                                    <Text style={{ color: "#dadada", fontSize: 12 }}>
                                        {(day.date).slice(8, 10)}-{(day.date).slice(5, 7)}
                                    </Text>
                                    <Text style={{ color: "#dadada", fontSize: 12 }}>
                                        {new Date(day.date).toDateString().slice(0, 3)}
                                    </Text>
                                    <Image
                                        source={{ uri: 'https:' + day.day.condition.icon }}
                                        style={{ width: 40, height: 40, marginVertical: 5 }}
                                    />
                                    <Text style={{ color: "#fff", fontSize: 14 }}>{day.day.avgtemp_c}°C</Text>
                                    <Text style={{ color: "#dadada", fontSize: 11, textAlign: "center", marginTop: 5 }}>
                                        {day.day.condition.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    locationImage: { width: 18, height: 18, marginRight: 5, tintColor: 'white' },
    searchIcon: { width: 22, height: 22, tintColor: 'white', marginLeft: 10 },
    searchInput: {
        width: 120,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: 'white',
        fontSize: 14,
    },
    text: { color: 'white', fontSize: 14 },
    weatherMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
    },
    tempText: { fontSize: 60, color: 'white', fontWeight: '900' },
    rangeText: { color: '#dadada', fontSize: 13, textAlign: 'center', marginTop: 5 },
    weatherIcon: { width: 100, height: 100 },
    cloudText: { color: '#dadada', textAlign: 'center', marginTop: -18 },
    description: {
        color: 'white',
        textAlign: 'center',
        width: '85%',
        alignSelf: 'center',
        marginTop: 20,
    },
    firstBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
        borderRadius: 10,
        borderColor: '#dadada',
        borderWidth: 1,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '45%',
    },
    infoText: { marginLeft: 8 },
    infoLabel: { color: 'white', fontSize: 14 },
    infoSub: { color: 'white', fontSize: 10 },
});
