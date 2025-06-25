import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/Header';

import { Goal } from '@/types/user/goal';
import { getGoals } from '@/services/goals/getGoals';

import { User } from '@/types/user/user';
import { getUser } from '@/services/user/getUser';

import StatCard from '@/components/StatCard';

// NOVO: Importar os nomes das fontes Poppins do pacote google-fonts
import { 
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';


const { width } = Dimensions.get('window');
const cardGap = 10;
const screenContentPaddingHorizontal = 20;

const threeColumnCardWidth = (width - (screenContentPaddingHorizontal * 2) - (cardGap * (3 - 1))) / 3;
const twoColumnCardWidth = (width - (screenContentPaddingHorizontal * 2) - (cardGap * (2 - 1))) / 2;


export default function ProfileScreen() {
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const [userGoals, setUserGoals] = useState<Goal | null>(null);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [errorGoals, setErrorGoals] = useState<string | null>(null);

  const handleEditProfile = () => {
    console.log('Editar perfil');
  };

  const handleShowAllAchievements = () => {
    console.log('Mostrar todas as conquistas');
  };

  const handleProfileHeaderPress = () => console.log('Perfil pressionado (header)');
  const handleChatHeaderPress = () => console.log('Chat pressionado');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const data = await getUser();
        setFetchedUser(data);
      } catch (err: any) {
        setErrorUser(err.message || 'Falha ao carregar dados do usuário.');
        console.error('Erro ao buscar usuário:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchUserGoals = async () => {
      setLoadingGoals(true);
      setErrorGoals(null);
      try {
        const data = await getGoals();
        setUserGoals(data);
      } catch (err: any) {
        setErrorGoals(err.message || 'Falha ao carregar metas.');
        console.error('Erro ao buscar metas:', err);
      } finally {
        setLoadingGoals(false);
      }
    };

    fetchUserData();
    fetchUserGoals();
  }, []);

  const displayName = fetchedUser?.username || 'Carregando...';
  const joinYear = fetchedUser?.created_at ? new Date(fetchedUser.created_at).getFullYear() : 'N/A';
  const avatarChar = fetchedUser?.username ? fetchedUser.username.charAt(0).toUpperCase() : 'A';

  const statistics = fetchedUser ? [
    { iconName: 'notebook-outline' as const, value: fetchedUser.diarys_registers, label: 'Diários registrados' },
    { iconName: 'meditation' as const, value: fetchedUser.mindfulness_registers, label: 'Sessões de Mindfulness' },
    { iconName: 'run' as const, value: fetchedUser.exercises_registers, label: 'Exercícios físicos' },
  ] : [];

  const transformedGoals = userGoals ? [
    { iconName: 'water' as const, value: userGoals.hydration_goal, label: 'ml', unit: 'por dia' },
    { iconName: 'dumbbell' as const, value: userGoals.exercise_goal, label: 'Minutos', unit: 'por dia' },
    { iconName: 'brain' as const, value: userGoals.mindfulness_goal, label: 'Minutos', unit: 'por dia' },
  ] : [];

  const achievements = [
    {
      iconName: 'trophy-variant-outline' as const,
      iconBackgroundColor: '#8BC34A',
      title: 'Diário Ativo',
      description: '15 dias consecutivos escrevendo',
    },
    {
      iconName: 'zodiac-aquarius' as const,
      iconBackgroundColor: '#9B59B6',
      title: 'Mente Equilibrada',
      description: '10 sessões mindfulness',
    },
    {
      iconName: 'food-apple-outline' as const,
      iconBackgroundColor: '#34D399',
      title: 'Hábitos Saudáveis',
      description: '5 dias de alimentação saudável',
    },
    {
      iconName: 'medal-outline' as const,
      iconBackgroundColor: '#FBBF24',
      title: 'Atleta do Mês',
      description: '300 minutos de exercício',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleProfileHeaderPress} style={styles.iconButton}>
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileText}>{avatarChar}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Mintros</Text>
          <View style={styles.plantIconPlaceholder} />
        </View>
        <TouchableOpacity onPress={handleChatHeaderPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="#34495E" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formCardCommon}>
          <View style={styles.userInfo}>
            <View>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.joinDate}>Entrou em {joinYear}</Text>
              <TouchableOpacity onPress={handleEditProfile}>
                <Text style={styles.editProfileLink}>Editar perfil</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{avatarChar}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
        </View>
        {loadingUser ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : errorUser ? (
          <Text style={[styles.errorText, { marginHorizontal: 20 }]}>Erro ao carregar estatísticas: {errorUser}</Text>
        ) : statistics.length === 0 ? (
          <Text style={[styles.noDataText, { marginHorizontal: 20 }]}>Nenhuma estatística disponível.</Text>
        ) : (
          <View style={styles.metricCardGrid}>
            {statistics.map((stat, index) => (
              <StatCard
                key={index}
                iconName={stat.iconName}
                value={stat.value}
                label={stat.label}
                cardWidth={threeColumnCardWidth}
              />
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Minhas Metas</Text>
        </View>
        {loadingGoals ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : errorGoals ? (
          <Text style={[styles.errorText, { marginHorizontal: 20 }]}>Erro ao carregar metas: {errorGoals}</Text>
        ) : transformedGoals.length === 0 ? (
          <Text style={[styles.noDataText, { marginHorizontal: 20 }]}>Nenhuma meta definida.</Text>
        ) : (
          <View style={styles.metricCardGrid}>
            {transformedGoals.map((goal, index) => (
              <StatCard
                key={index}
                iconName={goal.iconName}
                value={goal.value}
                label={goal.label}
                cardWidth={threeColumnCardWidth}
              />
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <TouchableOpacity onPress={handleShowAllAchievements}>
            <Text style={styles.showAllLink}>Mostrar todas</Text>
          </TouchableOpacity>
        </View>
        {achievements.length === 0 ? (
          <Text style={styles.noDataText}>Nenhuma conquista disponível.</Text>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementCarouselContent}
          >
            {achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItemCustom, { width: twoColumnCardWidth }]}>
                <View style={styles.achievementItemContent}>
                  <View style={[styles.achievementIconBackground, { backgroundColor: achievement.iconBackgroundColor }]}>
                    <MaterialCommunityIcons name={achievement.iconName} size={28} color="white" />
                  </View>
                  <View style={styles.achievementTextContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    marginTop: 10,
    paddingBottom: 20,
    paddingHorizontal: screenContentPaddingHorizontal,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ADDEA1',
    width: '100%',
  },
  iconButton: {
    padding: 5,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold', // Aplicando Poppins_700Bold
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold', // Aplicando Poppins_700Bold
    color: '#34495E',
    marginRight: 4,
  },
  plantIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
  },

  formCardCommon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },

  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold', // Aplicando Poppins_700Bold
    color: '#2C3E50',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular', // Aplicando Poppins_400Regular
    color: '#7F8C8D',
    marginBottom: 8,
  },
  editProfileLink: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold', // Aplicando Poppins_600SemiBold
    color: '#3498DB',
    // fontWeight: '600', // Removido, fontFamily já define o peso
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ADDEA1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold', // Aplicando Poppins_700Bold
    color: 'white',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold', // Aplicando Poppins_600SemiBold
    color: '#2C3E50',
  },
  showAllLink: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold', // Aplicando Poppins_600SemiBold
    color: '#3498DB',
    // fontWeight: '600', // Removido
  },

  metricCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: cardGap,
  },
  statMetricCardCustom: {
    width: threeColumnCardWidth,
  },
  // As propriedades de estilo dentro do StatCard (como statMetricCardContent, etc.)
  // são gerenciadas pelo próprio componente StatCard.tsx
  // Você precisará aplicar os fontFamilys lá também.

  achievementCarouselContent: {
    gap: cardGap,
    alignItems: 'flex-start',
  },
  achievementItemCustom: {
    width: twoColumnCardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  achievementItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular', // Aplicando Poppins_700Bold
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular', // Aplicando Poppins_400Regular
    color: '#7F8C8D',
  },
  loadingIndicator: {
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    fontFamily: 'Poppins_400Regular', // Aplicando Poppins_400Regular
  },
  noDataText: {
    color: 'gray',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    fontFamily: 'Poppins_400Regular', // Aplicando Poppins_400Regular
  },
});