import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Header from "../../components/Header"; // Verifique se Header.tsx tem 'export default'
import ProgressCircle from "../../components/ProgressCircle"; // Verifique se ProgressCircle.tsx tem 'export default'

import FormHeader from "../../components/FormHeader"; // Verifique se FormHeader.tsx tem 'export default'

import { registerHydratationLog } from "@/services/hydratation/registerHydratation";
import { getHydratationList } from "@/services/hydratation/listHydratation";
import { Hydratation } from "@/types/health/hydratation";

import { format, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import WaterDropIcon from "@/components/WaterDropIcon";
import HeaderWithOptions from "@/components/HeaderWithOptions";

// FUNÇÃO DEFINIDA AQUI (FORA DO COMPONENTE)
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const { width, height } = Dimensions.get("window");

export default function HydrationScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Zera hora para comparação de dia
    return d;
  });

  const [hydrationLogs, setHydrationLogs] = useState<Hydratation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalHydrationToday = hydrationLogs.reduce((sum, log) => {
    return sum + (log.quantity || 0);
  }, 0);

  const dailyGoal = 3750;
  const remaining = dailyGoal - totalHydrationToday;
  const progress = (totalHydrationToday / dailyGoal) * 100;

  const formatDateDisplay = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = isSameDay(date, today);
    const isYesterday = isSameDay(date, yesterday);
    const isTomorrow = isSameDay(date, tomorrow);

    if (isToday) return "Hoje";
    if (isYesterday) return "Ontem";
    if (isTomorrow) return "Amanhã";
    
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  const handleAddWater = () => {
    router.push("/registerhydratation");
  };

  useEffect(() => {
    const fetchHydrationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHydratationList(selectedDate); // Passa o objeto Date, a função da API formata
        setHydrationLogs(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar hidratação.");
        console.error("Erro ao buscar hidratação:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHydrationData();
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <Header avatarChar="A" />
      <HeaderWithOptions title="Hidratação"/>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={() => navigateDay("prev")}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text>
          <TouchableOpacity onPress={() => navigateDay("next")}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftContent}>
            <Text style={styles.currentAmount}>{totalHydrationToday} ml</Text>
            <Text style={styles.remainingText}>
              Faltam {Math.max(0, remaining)} ml para você atingir{"\n"}seu objetivo diário de {dailyGoal} ml
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
          {/* USO DA FUNÇÃO formatDateToYYYYMMDD AQUI */}
          <Text style={styles.historyDate}>Data: {formatDateToYYYYMMDD(selectedDate)}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : hydrationLogs.length === 0 ? (
            <Text style={styles.noDataText}>Nenhum registro de hidratação para essa data.</Text>
          ) : (
            hydrationLogs.map((log, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>Hidratação</Text>
                    <Text style={styles.cardValue}>{log.quantity} ml</Text>
                    <Text style={styles.cardSubtitle}>
                      Registrado em {new Date(log.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
    </SafeAreaView>
  );
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
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },
});