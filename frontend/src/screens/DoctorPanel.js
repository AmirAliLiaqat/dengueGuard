import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Search, Filter } from 'lucide-react-native';

const DoctorPanel = () => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const styles = createStyles(theme);

  const patients = [
    { id: '1', name: 'Amir Khan', status: 'Warning', platelets: '85,000' },
    { id: '2', name: 'Sara Ahmed', status: 'Severe', platelets: '32,000' },
    { id: '3', name: 'Zain Malik', status: 'Mild', platelets: '145,000' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Monitor</Text>
        <TouchableOpacity style={styles.searchBar}>
          <Search color={colors.textMuted} size={20} />
          <Text style={styles.searchText}>Search Patients...</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.l }}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientPlatelets}>Platelets: {item.platelets}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'Severe' ? colors.error + '1A' : colors.warning + '1A' }
            ]}>
              <Text style={{
                color: item.status === 'Severe' ? colors.error : colors.warning,
                fontWeight: 'bold',
                fontSize: 12
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Filter color={colors.background} size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const createStyles = (theme) => {
  const { colors, typography, spacing } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.m,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: spacing.m,
      marginTop: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    searchText: {
      color: colors.textMuted,
      marginLeft: 8,
    },
    patientCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    patientPlatelets: {
      ...typography.caption,
      color: colors.textMuted,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    fab: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }
  });
};

export default DoctorPanel;
