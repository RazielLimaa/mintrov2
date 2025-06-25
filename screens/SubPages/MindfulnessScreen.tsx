import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '@/components/Header';
import FormHeader from '@/components/FormHeader';
import { ExerciseLog } from '@/types/health/exercise';
import { getExerciseLogs } from '@/services/exercise/listExerciseLog';

interface DayIndicatorProps {
  dayLetter: string;
  exercised: boolean;
  onPress?: () => void;
}

const DayIndicator: React.FC<DayIndicatorProps> = ({ dayLetter, exercised, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.dayIndicatorContainer,
        exercised ? styles.dayIndicatorExercised : {},
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {exercised && (
        <MaterialCommunityIcons name="check-circle" size={24} color="white" style={styles.checkIcon} />
      )}
      <Text style={[styles.dayIndicatorText, exercised && styles.dayIndicatorTextExercised]}>
        {dayLetter}
      </Text>
    </TouchableOpacity>
  );
};

interface ActivityCardProps {
  name: string;
  details: string;
  durationText: string;
  onPress?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ name, details, durationText, onPress }) => {
  return (
    <Card style={styles.activityCard} elevation={1} onPress={onPress}>
      <View style={styles.activityCardContent}>
        <View>
          <Text style={styles.activityName}>{name}</Text>
          <Text style={styles.activityDetails}>{details}</Text>
        </View>
        <Text style={styles.activityDuration}>{durationText}</Text>
      </View>
    </Card>
  );
};

const ActivityScreen: React.FC = () => {
  interface WeekDay {
  id: string
  letter: string
  date: Date | null
  exercised: boolean
}

const [weekDays, setWeekDays] = useState<WeekDay[]>(
  [...Array(7)].map((_, i) => ({
    id: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][i],
    letter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i],
    date: null,
    exercised: false,
  }))
);

  useEffect(() => {
    const loadExerciseLogs = async () => {
      try {
        const logs = await getExerciseLogs();
        const today = new Date();
        const dayOfWeek = today.getDay();
        const start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        const updatedWeek = [...Array(7)].map((_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);

          const exercised = logs.some((log) => {
            const logDate = new Date(log.datetime);
            return (
              logDate.getFullYear() === d.getFullYear() &&
              logDate.getMonth() === d.getMonth() &&
              logDate.getDate() === d.getDate()
            );
          });

          return {
            id: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][i],
            letter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i],
            date: d,
            exercised,
          };
        });

        setWeekDays(updatedWeek);
      } catch (err) {
        console.error(err);
      }
    };

    loadExerciseLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Header avatarChar="A" />
      <FormHeader title="Exercícios" onSavePress={() => {}} />

      <View style={styles.weeklySummarySection}>
        <View style={styles.weekNavigation}>
          <IconButton icon="chevron-left" onPress={() => console.log('Semana Anterior')} />
          <Text style={styles.weekHeaderText}>Esta Semana</Text>
          <IconButton icon="chevron-right" onPress={() => console.log('Próxima Semana')} />
        </View>

        <View style={styles.summaryNumbers}>
          <Text style={styles.completedDays}>{weekDays.filter(d => d.exercised).length}</Text>
          <Text style={styles.summaryText}> de 7 dias com exercícios</Text>
        </View>
        <Text style={styles.exercisedTotal}>Você se exercitou um total de {weekDays.filter(d => d.exercised).length} vez(es)</Text>

        <View style={styles.dayIndicatorsRow}>
          {weekDays.map(day => (
            <DayIndicator
              key={day.id}
              dayLetter={day.letter}
              exercised={day.exercised}
              onPress={() => console.log(`Dia ${day.letter} clicado`)}
            />
          ))}
        </View>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Histórico</Text>
        <Text style={styles.historyDate}>Hoje, {new Date().toLocaleDateString()}</Text>
        <ActivityCard
          name="Corrida"
          details="1km - 30min"
          durationText="30 min"
          onPress={() => console.log('Corrida clicada')}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/registerexercise')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  weeklySummarySection: { paddingHorizontal: 16, paddingVertical: 15, backgroundColor: 'white', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  weekNavigation: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  weekHeaderText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 },
  summaryNumbers: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 5 },
  completedDays: { fontSize: 32, fontWeight: 'bold', color: '#2e7d32' },
  summaryText: { fontSize: 16, color: 'gray' },
  exercisedTotal: { fontSize: 14, color: 'gray', marginBottom: 15 },
  dayIndicatorsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  dayIndicatorContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  dayIndicatorExercised: { backgroundColor: '#81c784' },
  checkIcon: { position: 'absolute', top: -5, right: -5, zIndex: 1 },
  dayIndicatorText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dayIndicatorTextExercised: { color: 'white' },
  historySection: { paddingHorizontal: 16, marginTop: 10 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  historyDate: { fontSize: 14, color: 'gray', marginBottom: 10 },
  activityCard: { borderRadius: 10, backgroundColor: 'white', padding: 15 },
  activityCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  activityDetails: { fontSize: 14, color: 'gray', marginTop: 4 },
  activityDuration: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#81c784', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  addButtonText: { color: 'white', fontSize: 30, lineHeight: 30 },
});

export default ActivityScreen;
