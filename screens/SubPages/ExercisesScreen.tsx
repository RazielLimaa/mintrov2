"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import type { ExerciseLog } from "@/types/health/exercise"
import { getExerciseLogs } from "@/services/exercise/listExerciseLog"
import Header from "@/components/Header"

const { width, height } = Dimensions.get("window")

interface WeekDay {
  id: string
  letter: string
  date: Date | null
  exercised: boolean
}

const ExerciseActivityScreen: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState("Esta Semana")
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])

  const [weekDays, setWeekDays] = useState<WeekDay[]>(
    [...Array(7)].map((_, i) => ({
      id: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][i],
      letter: ["D", "S", "T", "Q", "Q", "S", "S"][i],
      date: null,
      exercised: false,
    })),
  )

  useEffect(() => {
    const loadExerciseLogs = async () => {
      try {
        const logs = await getExerciseLogs()
        setExerciseLogs(logs)

        const today = new Date()
        const dayOfWeek = today.getDay()
        const start = new Date(today)
        start.setDate(today.getDate() - dayOfWeek)
        start.setHours(0, 0, 0, 0)

        const updatedWeek = [...Array(7)].map((_, i) => {
          const d = new Date(start)
          d.setDate(start.getDate() + i)

          const exercised = logs.some((log) => {
            const logDate = new Date(log.datetime)
            return (
              logDate.getFullYear() === d.getFullYear() &&
              logDate.getMonth() === d.getMonth() &&
              logDate.getDate() === d.getDate()
            )
          })

          return {
            id: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][i],
            letter: ["D", "S", "T", "Q", "Q", "S", "S"][i],
            date: d,
            exercised,
          }
        })

        setWeekDays(updatedWeek)
      } catch (err) {
        console.error("Error loading exercise logs:", err)
      }
    }

    loadExerciseLogs()
  }, [])

  const completedDays = weekDays.filter((d) => d.exercised).length
  const totalExercises = exerciseLogs.length

  const handleBack = () => {
    router.back()
  }

  const handleAddExercise = () => {
    router.push("/registerexercise")
  }

  const navigateWeek = (direction: "prev" | "next") => {
    // Handle week navigation
    console.log(`Navigate ${direction}`)
  }

  return (
    <View style={styles.container}>
      <Header avatarChar="A" />
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Atividade</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity onPress={() => navigateWeek("prev")}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.weekText}>Esta Semana</Text>
          <TouchableOpacity onPress={() => navigateWeek("next")}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Exercise Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryMain}>{completedDays} de 7</Text>
            <Text style={styles.summarySubtitle}>dias com exercícios</Text>
          </View>
          <Text style={styles.summaryDescription}>
            Você se exercitou um total de {totalExercises} vez{totalExercises !== 1 ? "es" : ""}
          </Text>
        </View>

        {/* Week Days Indicators */}
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <View key={day.id} style={styles.dayContainer}>
              <View style={[styles.dayIndicator, day.exercised && styles.dayIndicatorActive]}>
                {day.exercised && <MaterialCommunityIcons name="check" size={16} color="white" />}
              </View>
              <Text style={styles.dayLabel}>{day.letter}</Text>
            </View>
          ))}
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico</Text>
          <Text style={styles.historyDate}>Hoje, {new Date().toLocaleDateString("pt-BR")}</Text>

          {exerciseLogs.length > 0 ? (
            exerciseLogs.slice(0, 3).map((log, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyCardContent}>
                  <View>
                    <Text style={styles.exerciseType}>{log.type || "Exercício"}</Text>
                    <Text style={styles.exerciseDetails}>
                      {log.distance ? `${log.distance}km` : ""}
                      {log.distance && log.duration ? " - " : ""}
                      {log.duration ? `${log.duration}min` : ""}
                    </Text>
                  </View>
                  <Text style={styles.exerciseCount}>{log.duration || 0} min</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.historyCard}>
              <View style={styles.historyCardContent}>
                <View>
                  <Text style={styles.exerciseType}>Nenhum exercício registrado</Text>
                  <Text style={styles.exerciseDetails}>Adicione seu primeiro exercício</Text>
                </View>
                <Text style={styles.exerciseCount}>0 min</Text>
              </View>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddExercise}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  weekNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  weekText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  summarySection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  summaryMain: {
    fontSize: 48,
    fontWeight: "700",
    color: "#333",
    marginRight: 8,
  },
  summarySubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  summaryDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  dayContainer: {
    alignItems: "center",
    gap: 8,
  },
  dayIndicator: {
    width: 40,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  dayIndicatorActive: {
    backgroundColor: "#4CAF50",
  },
  dayLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
  },
  exerciseCount: {
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    bottom: 30,
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
  bottomSpacing: {
    height: 40,
  },
})

export default ExerciseActivityScreen
