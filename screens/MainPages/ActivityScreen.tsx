"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import Header from "../../components/Header"
import ProgressCircle from "../../components/ProgressCircle"

const { width, height } = Dimensions.get("window")

export default function HealthScreen() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]
  const exerciseDays = [false, false, false, false, true, false, false]
  const mindfulnessDays = [false, true, true, true, true, true, true]

  const handleHydrationPress = () => {
    router.push("/hydratation")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header avatarChar="A" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={() => navigateDate("prev")}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#374151" />
          </TouchableOpacity>

          <Text style={styles.dateText}>Hoje</Text>

          <TouchableOpacity onPress={() => navigateDate("next")}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainStats}>
          <View style={styles.sideStatItem}>
            <View style={styles.progressContainer}>
              <ProgressCircle progress={53} size={width * 0.18} color="#9CC9FF" />
              <View style={styles.progressContent}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.sideStatValue}>5,31</Text>
            <Text style={styles.sideStatLabel}>km</Text>
          </View>

          <View style={styles.mainStatItem}>
            <View style={styles.progressContainer}>
              <ProgressCircle progress={65} size={width * 0.25} color="#9CC9FF" />
              <View style={styles.progressContent}>
                <MaterialCommunityIcons name="shoe-print" size={24} color="#000" />
              </View>
            </View>
            <Text style={styles.mainStatValue}>6.565</Text>
            <Text style={styles.mainStatLabel}>passos</Text>
          </View>

          <View style={styles.sideStatItem}>
            <View style={styles.progressContainer}>
              <ProgressCircle progress={44} size={width * 0.18} color="#9CC9FF" />
              <View style={styles.progressContent}>
                <MaterialCommunityIcons name="fire" size={16} color="#F97316" />
              </View>
            </View>
            <Text style={styles.sideStatValue}>2.203</Text>
            <Text style={styles.sideStatLabel}>kcal</Text>
          </View>
        </View>

        {/* Hydration Card - Clickable */}
        <TouchableOpacity style={styles.card} onPress={handleHydrationPress} activeOpacity={0.7}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Hidratação</Text>
              <Text style={styles.cardValue}>750 ml</Text>
              <Text style={styles.cardSubtitle}>Hoje</Text>
            </View>
            <View style={styles.hydrationProgress}>
              <ProgressCircle progress={20} size={60} color="#9CC9FF" strokeWidth={6} />
              <View style={styles.hydrationIcon}>
                <MaterialCommunityIcons name="water" size={20} color="#3B82F6" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>Dias com Exercício</Text>
              <Text style={styles.cardValue}>1 de 5</Text>
              <Text style={styles.cardSubtitle}>Esta semana</Text>
            </View>
            <View style={styles.weekProgress}>
              <View style={styles.weekDays}>
                {weekDays.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayLabel}>{day}</Text>
                    <View style={[styles.dayIndicator, exerciseDays[index] && styles.dayIndicatorActive]}>
                      {exerciseDays[index] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>Dias com Mindfulness</Text>
              <Text style={styles.cardValue}>1 de 5</Text>
              <Text style={styles.cardSubtitle}>Esta semana</Text>
            </View>
            <View style={styles.weekProgress}>
              <View style={styles.weekDays}>
                {weekDays.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayLabel}>{day}</Text>
                    <View style={[styles.dayIndicator, mindfulnessDays[index] && styles.dayIndicatorActive]}>
                      {mindfulnessDays[index] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.03,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
  },
  mainStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  mainStatItem: {
    alignItems: "center",
    flex: 1,
  },
  sideStatItem: {
    alignItems: "center",
    flex: 0.8,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  progressContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  sideStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  sideStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  hydrationProgress: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  hydrationIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  weekProgress: {
    alignItems: "flex-end",
  },
  weekDays: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayContainer: {
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dayIndicatorActive: {
    backgroundColor: "#79D457",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
})
