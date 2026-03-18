import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Search, Filter } from "lucide-react-native";
import { createStyles } from "../styles/DoctorPanel.styles";

const DoctorPanel = () => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const styles = createStyles(theme);

  const patients = [
    { id: "1", name: "Amir Khan", status: "Warning", platelets: "85,000" },
    { id: "2", name: "Sara Ahmed", status: "Severe", platelets: "32,000" },
    { id: "3", name: "Zain Malik", status: "Mild", platelets: "145,000" },
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
              <Text style={styles.patientPlatelets}>
                Platelets: {item.platelets}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "Severe"
                      ? colors.error + "1A"
                      : colors.warning + "1A",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    item.status === "Severe" ? colors.error : colors.warning,
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
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

export default DoctorPanel;
