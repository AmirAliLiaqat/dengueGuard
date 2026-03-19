import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Search, Filter, Stethoscope } from "lucide-react-native";
import { createStyles } from "../styles/DoctorPanel.styles";
import { useGetPublicDoctorsQuery } from "../services/api";

const DoctorPanel = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const styles = createStyles(theme);
  const { data: doctors = [] } = useGetPublicDoctorsQuery();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctors Panel</Text>
        <TouchableOpacity style={styles.searchBar}>
          <Search color={colors.textMuted} size={20} />
          <Text style={styles.searchText}>Search Doctors...</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.l }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.patientCard}
            onPress={() => navigation.navigate("DoctorDetail", { doctorId: item.id })}
          >
            <View style={styles.avatarWrap}>
              {item.picture_url ? (
                <Image
                  source={{ uri: item.picture_url }}
                  style={styles.avatarImage}
                />
              ) : (
                <Stethoscope color={colors.primary} size={26} />
              )}
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientPlatelets}>
                Age: {item.age || "N/A"}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: colors.primary + "1A",
                },
              ]}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                VIEW
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Filter color={colors.background} size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DoctorPanel;
