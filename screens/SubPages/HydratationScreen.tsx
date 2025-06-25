"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import Header from "@/components/Header"
import FormHeader from "@/components/FormHeader"
import ProgressCircle from "../../components/ProgressCircle"
import WaterDropIcon from "../../components/WaterDropIcon"
import { registerHydratationLog } from "@/services/hydratation/registerHydratation"
import { getHydratationList } from "@/services/hydratation/listHydratation" 
import { Hydratation } from "@/types/health/hydratation"

const { width, height } = Dimensions.get("window")

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const HydrationScreen: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState(750)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [hydrationLogs, setHydrationLogs] = useState<Hydratation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dailyGoal = 3750
  const remaining = dailyGoal - currentAmount
  const progress = (currentAmount / dailyGoal) * 100

  const handleAddWater = () => {
    router.push("/registerhydratation")
  }

  useEffect(() => {
    const fetchHydrationData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getHydratationList(formatDateToYYYYMMDD(selectedDate))
        setHydrationLogs(data)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar hidratação.")
      } finally {
        setLoading(false)
      }
    }

    fetchHydrationData()
  }, [selectedDate])

  return (
    <SafeAreaView style={styles.container}>
      <Header avatarChar="A" />
      <FormHeader title="Hidratação" onSavePress={() => []} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDateToYYYYMMDD(selectedDate)}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftContent}>
            <Text style={styles.currentAmount}>{currentAmount} ml</Text>
            <Text style={styles.remainingText}>
              Faltam {remaining} ml para você atingir{"\n"}seu objetivo diário de {dailyGoal} ml
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <ProgressCircle progress={progress} size={120} color="#9CC9FF" strokeWidth={8} />
            <View style={styles.progressIcon}>
              <WaterDropIcon size={32} color="#0022FF" />
            </View>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico</Text>
          <Text style={styles.historyDate}>Data: {formatDateToYYYYMMDD(selectedDate)}</Text>

          {loading ? (
            <Text>Carregando...</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : hydrationLogs.length === 0 ? (
            <Text>Nenhum registro para essa data.</Text>
          ) : (
            hydrationLogs.map((log, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>Hidratação</Text>
                    <Text style={styles.cardValue}>{log.quantity} ml</Text>
                    <Text style={styles.cardSubtitle}>
                      Registrado em {new Date(log.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 16, color: "#333" }}>
                      {Math.round(log.quantity / 250)} copo(s)
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddWater}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="brain" size={24} color="#999" />
          <Text style={styles.navLabel}>Mental</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="heart" size={24} color="#4CAF50" />
          <Text style={styles.navLabelSelected}>Saúde</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={24} color="#999" />
          <Text style={styles.navLabel}>Você</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  scrollView: { flex: 1 },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  dateText: { fontSize: 18, fontWeight: "600", color: "#333" },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  leftContent: { flex: 1 },
  currentAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  remainingText: { fontSize: 14, color: "#666", lineHeight: 20 },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  historySection: { paddingHorizontal: 16, marginBottom: 100 },
  historyTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 8 },
  historyDate: { fontSize: 14, color: "#666", marginBottom: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginVertical: 4,
  },
  cardSubtitle: { fontSize: 14, color: "#666" },
  hydrationProgress: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 20,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 12, color: "#999", marginTop: 4 },
  navLabelSelected: { fontSize: 12, color: "#4CAF50", fontWeight: "600", marginTop: 4 },
})

export default HydrationScreen
