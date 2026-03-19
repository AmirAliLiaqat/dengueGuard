import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { createStyles } from "../styles/AdminDashboardScreen.styles";
import {
  useGetAdminOverviewQuery,
  useGetAdminUsersQuery,
} from "../services/api";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const AdminDashboardScreen = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme);
  const { data: overview } = useGetAdminOverviewQuery();
  const { data: users } = useGetAdminUsersQuery();
  const screenWidth = Dimensions.get("window").width - 32; // padding adjustment

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.cardRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Users</Text>
                <Text style={styles.statValue}>{overview.total_users}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Reports</Text>
                <Text style={styles.statValue}>{overview.total_reports}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Doctors</Text>
                <Text style={styles.statValue}>{overview.total_doctors}</Text>
              </View>
            </View>
          </View>
        )}

        {overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Country</Text>
            <View style={styles.chartCard}>
              <PieChart
                data={Object.entries(overview.diagnoses_by_country || {}).map(
                  ([country, count], idx) => ({
                    name: country,
                    population: count,
                    color: chartColors[idx % chartColors.length],
                    legendFontColor: theme.colors.text,
                    legendFontSize: 10,
                  }),
                )}
                width={screenWidth}
                height={200}
                chartConfig={chartConfig(theme)}
                accessor="population"
                paddingLeft="16"
                backgroundColor="transparent"
              />
            </View>
          </View>
        )}

        {overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Age Band</Text>
            <View style={styles.chartCard}>
              <BarChart
                data={{
                  labels: Object.keys(overview.diagnoses_by_age_band || {}),
                  datasets: [
                    {
                      data: Object.values(overview.diagnoses_by_age_band || {}),
                    },
                  ],
                }}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig(theme)}
                fromZero
                showValuesOnTopOfBars
                style={{ borderRadius: 12 }}
              />
            </View>
          </View>
        )}

        {overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Gender</Text>
            <View style={styles.chartCard}>
              <BarChart
                data={{
                  labels: Object.keys(overview.diagnoses_by_gender || {}),
                  datasets: [
                    {
                      data: Object.values(overview.diagnoses_by_gender || {}),
                    },
                  ],
                }}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig(theme, true)}
                fromZero
                showValuesOnTopOfBars
                style={{ borderRadius: 12 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;

const chartColors = ["#00D2FF", "#3A7BD5", "#FF0072", "#10B981", "#F59E0B"];

const chartConfig = (theme, secondary = false) => ({
  backgroundColor: theme.colors.card,
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) =>
    secondary
      ? `rgba(58, 123, 213, ${opacity})`
      : `rgba(0, 210, 255, ${opacity})`,
  labelColor: () => theme.colors.textMuted,
  propsForBackgroundLines: {
    stroke: theme.colors.glassBorder,
  },
  propsForLabels: {
    fontSize: 10,
  },
});
